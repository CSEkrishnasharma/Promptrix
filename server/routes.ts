import { Router, Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'void-neural-matrix-crypto-secret-key-2026!';
const adminEmails = process.env.VITE_ADMIN_EMAILS
  ? process.env.VITE_ADMIN_EMAILS.split(',').map((e: string) => e.trim().toLowerCase())
  : [];

// Middleware to authenticate requests
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role?: string;
    status?: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { db } = await connectToDatabase();
    const user = await db.collection('userCred').findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      res.status(401).json({ error: 'User session invalid.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ error: 'Your account has been suspended.' });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      displayName: user.name,
      photoURL: user.photoURL || '',
      role: adminEmails.includes(user.email.toLowerCase()) ? 'admin' : (user.role || 'user'),
      status: user.status || 'active'
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired access token.' });
  }
}

// Middleware to require admin access
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const isUserAdmin = req.user.role === 'admin' || adminEmails.includes(req.user.email.toLowerCase());
  if (!isUserAdmin) {
    res.status(403).json({ error: 'Access denied: Administrative privileges required.' });
    return;
  }
  next();
}

// --- AUTHENTICATION ROUTES ---

// Signup
apiRouter.post('/auth/signup', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email address format.' });
    return;
  }

  // Validate password strength (at least 8 chars, 1 upper, 1 lower, 1 digit)
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: 'Password does not meet complexity requirements.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const existingUser = await db.collection('userCred').findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(400).json({ error: 'Account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

    const newUser = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: userRole,
      status: 'active',
      photoURL: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('userCred').insertOne(newUser);
    const userId = result.insertedId.toString();

    // Create session token
    const token = jwt.sign({ id: userId, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        uid: userId,
        email: newUser.email,
        displayName: newUser.name,
        photoURL: newUser.photoURL,
        role: newUser.role,
        status: newUser.status
      },
      token
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'An error occurred during account creation.' });
  }
});

// Login
apiRouter.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('userCred').findOne({ email: email.toLowerCase() });

    if (!user) {
      // Secure message: do not identify if email exists or password is wrong
      res.status(401).json({ error: 'Incorrect email or password.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ error: 'Your account has been suspended.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect email or password.' });
      return;
    }

    // Update lastLogin timestamp in user profile
    await db.collection('userCred').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );

    const userId = user._id.toString();
    const userRole = adminEmails.includes(user.email.toLowerCase()) ? 'admin' : (user.role || 'user');

    const token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      user: {
        uid: userId,
        email: user.email,
        displayName: user.name,
        photoURL: user.photoURL || '',
        role: userRole,
        status: user.status || 'active'
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

// Get current user session info
apiRouter.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(200).json({ user: req.user });
});

// Logout (handled client-side by dropping token, but can log on server if needed)
apiRouter.post('/auth/logout', async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Neural connection terminated.' });
});

// Update Profile
apiRouter.post('/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { displayName, photoURL } = req.body;
  if (!req.user) return;

  if (displayName && displayName.length > 100) {
    res.status(400).json({ error: 'Display name is too long.' });
    return;
  }

  if (photoURL && !photoURL.startsWith('https://') && !photoURL.startsWith('data:image/')) {
    res.status(400).json({ error: 'Invalid photo URL.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection('userCred').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { name: displayName, photoURL, updatedAt: new Date() } }
    );
    res.status(200).json({ success: true, displayName, photoURL });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile details.' });
  }
});

// Update Password
apiRouter.post('/auth/password', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!req.user) return;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current and new passwords are required.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('userCred').findOne({ _id: new ObjectId(req.user.id) });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password does not match.' });
      return;
    }

    // Validate new password complexity
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      res.status(400).json({ error: 'New password does not meet complexity requirements.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.collection('userCred').updateOne(
      { _id: user._id },
      { $set: { passwordHash, updatedAt: new Date() } }
    );

    res.status(200).json({ success: true, message: 'Access keyphrase successfully reset.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update access keyphrase.' });
  }
});


// --- PROMPTS ROUTES ---

// Save Prompt
apiRouter.post('/prompts', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { input, masterPrompt, outputs, controls } = req.body;
  if (!req.user) return;

  if (!input || !masterPrompt) {
    res.status(400).json({ error: 'Input and generated master prompt are required.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const newPrompt = {
      userId: new ObjectId(req.user.id), // Ensure it uses an ObjectId reference
      input,
      masterPrompt,
      outputs,
      controls,
      isFavorite: false,
      status: 'approved',
      upvotes: 0,
      featured: false,
      flagged: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('promptHistory').insertOne(newPrompt);
    
    // Increment prompts count for this user in userCred as stats tracking
    await db.collection('userCred').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $inc: { promptsGenerated: 1 } }
    );

    res.status(201).json({ id: result.insertedId.toString(), ...newPrompt });
  } catch (error) {
    console.error('Error saving prompt:', error);
    res.status(500).json({ error: 'Failed to archive generated prompt.' });
  }
});

// Get User's Prompts
apiRouter.get('/prompts', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) return;

  try {
    const { db } = await connectToDatabase();
    const prompts = await db.collection('promptHistory')
      .find({ userId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedPrompts = prompts.map(p => ({
      id: p._id.toString(),
      userId: p.userId.toString(),
      input: p.input,
      masterPrompt: p.masterPrompt,
      outputs: p.outputs,
      controls: p.controls,
      isFavorite: p.isFavorite,
      status: p.status,
      upvotes: p.upvotes,
      featured: p.featured,
      flagged: p.flagged,
      createdAt: p.createdAt
    }));

    res.status(200).json(formattedPrompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to retrieve prompt history.' });
  }
});

// Toggle Favorite status of prompt
apiRouter.put('/prompts/:id/favorite', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  if (!req.user) return;

  try {
    const { db } = await connectToDatabase();
    const prompt = await db.collection('promptHistory').findOne({ _id: new ObjectId(id) });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found.' });
      return;
    }

    // Verify ownership
    if (prompt.userId.toString() !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized operation. This prompt does not belong to you.' });
      return;
    }

    await db.collection('promptHistory').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isFavorite: Boolean(isFavorite), updatedAt: new Date() } }
    );

    res.status(200).json({ success: true, isFavorite: Boolean(isFavorite) });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ error: 'Failed to update prompt status.' });
  }
});

// Delete Prompt
apiRouter.delete('/prompts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!req.user) return;

  try {
    const { db } = await connectToDatabase();
    const prompt = await db.collection('promptHistory').findOne({ _id: new ObjectId(id) });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found.' });
      return;
    }

    // Verify ownership
    if (prompt.userId.toString() !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized operation. This prompt does not belong to you.' });
      return;
    }

    await db.collection('promptHistory').deleteOne({ _id: new ObjectId(id) });

    // Decrement count
    await db.collection('userCred').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $inc: { promptsGenerated: -1 } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Failed to delete prompt.' });
  }
});


// --- PUBLIC TEMPLATES (For Landing Page) ---
apiRouter.get('/templates/public', async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const templates = await db.collection('templates')
      .find({ visibility: 'public' })
      .toArray();

    const formatted = templates.map(t => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      category: t.category,
      visibility: t.visibility
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching public templates:', error);
    res.status(500).json({ error: 'Failed to load templates.' });
  }
});


// --- ADMIN MANAGEMENT ROUTES ---

// Get Users (Admin Only)
apiRouter.get('/admin/users', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('userCred').find().sort({ lastLogin: -1 }).toArray();

    const formatted = users.map(u => ({
      uid: u._id.toString(),
      email: u.email,
      displayName: u.name,
      photoURL: u.photoURL || '',
      lastLogin: u.lastLogin || u.createdAt,
      createdAt: u.createdAt,
      status: u.status || 'active',
      role: adminEmails.includes(u.email.toLowerCase()) ? 'admin' : (u.role || 'user'),
      promptsGenerated: u.promptsGenerated || 0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error loading users for admin:', error);
    res.status(500).json({ error: 'Failed to load users list.' });
  }
});

// Update User Status (Admin Only)
apiRouter.put('/admin/users/:uid/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'suspended') {
    res.status(400).json({ error: 'Invalid status.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection('userCred').updateOne(
      { _id: new ObjectId(uid) },
      { $set: { status, updatedAt: new Date() } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// Update User Role (Admin Only)
apiRouter.put('/admin/users/:uid/role', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  const { role } = req.body;

  if (role !== 'admin' && role !== 'user') {
    res.status(400).json({ error: 'Invalid role.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('userCred').findOne({ _id: new ObjectId(uid) });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Root admin safeguard
    if (adminEmails.includes(user.email.toLowerCase())) {
      res.status(400).json({ error: 'Cannot change role of root administrator.' });
      return;
    }

    await db.collection('userCred').updateOne(
      { _id: new ObjectId(uid) },
      { $set: { role, updatedAt: new Date() } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// Delete User (Admin Only)
apiRouter.delete('/admin/users/:uid', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('userCred').findOne({ _id: new ObjectId(uid) });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Root admin safeguard
    if (adminEmails.includes(user.email.toLowerCase())) {
      res.status(400).json({ error: 'Cannot delete root administrator.' });
      return;
    }

    // Delete user profile
    await db.collection('userCred').deleteOne({ _id: new ObjectId(uid) });
    // Also delete user prompts history
    await db.collection('promptHistory').deleteMany({ userId: new ObjectId(uid) });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// Analytics stats (Admin Only)
apiRouter.get('/admin/analytics', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();

    const users = await db.collection('userCred').find().toArray();
    const prompts = await db.collection('promptHistory').find().toArray();

    // Active users today calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeTodayCount = users.filter(u => u.lastLogin && new Date(u.lastLogin) >= today).length;

    res.status(200).json({
      totalUsers: users.length,
      activeUsersToday: activeTodayCount,
      promptsGenerated: prompts.length,
      apiUsage: prompts.length * 4,
      users,
      prompts
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to load analytics dashboard stats.' });
  }
});

// Templates Management (Admin Only)
apiRouter.get('/admin/templates', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const templates = await db.collection('templates').find().toArray();
    const formatted = templates.map(t => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      category: t.category,
      visibility: t.visibility
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error loading templates:', error);
    res.status(500).json({ error: 'Failed to load templates.' });
  }
});

apiRouter.post('/admin/templates', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { title, description, category, visibility } = req.body;
  try {
    const { db } = await connectToDatabase();
    const newTemplate = { title, description, category, visibility, createdAt: new Date() };
    const result = await db.collection('templates').insertOne(newTemplate);
    res.status(201).json({ id: result.insertedId.toString(), ...newTemplate });
  } catch (error) {
    console.error('Error adding template:', error);
    res.status(500).json({ error: 'Failed to create template.' });
  }
});

apiRouter.put('/admin/templates/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, category, visibility } = req.body;
  try {
    const { db } = await connectToDatabase();
    const updateObj: any = {};
    if (title !== undefined) updateObj.title = title;
    if (description !== undefined) updateObj.description = description;
    if (category !== undefined) updateObj.category = category;
    if (visibility !== undefined) updateObj.visibility = visibility;

    await db.collection('templates').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template.' });
  }
});

apiRouter.delete('/admin/templates/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { db } = await connectToDatabase();
    await db.collection('templates').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template.' });
  }
});

// Feedback Management (Admin Only)
apiRouter.get('/admin/feedback', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const feedbacks = await db.collection('feedback').find().toArray();
    const formatted = feedbacks.map(f => ({
      id: f._id.toString(),
      user: f.user,
      type: f.type,
      message: f.message,
      date: f.date,
      resolved: f.resolved,
      read: f.read || false
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error loading feedback:', error);
    res.status(500).json({ error: 'Failed to load feedback logs.' });
  }
});

apiRouter.put('/admin/feedback/:id/resolve', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { resolved, read } = req.body;
  try {
    const { db } = await connectToDatabase();
    const updateObj: any = {};
    if (resolved !== undefined) updateObj.resolved = Boolean(resolved);
    if (read !== undefined) updateObj.read = Boolean(read);

    await db.collection('feedback').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to resolve feedback.' });
  }
});

// Models Management (Admin Only)
apiRouter.get('/admin/models', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const models = await db.collection('models').find().toArray();
    const formatted = models.map(m => ({
      id: m._id.toString(),
      name: m.name,
      provider: m.provider,
      enabled: m.enabled,
      description: m.description
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error loading models:', error);
    res.status(500).json({ error: 'Failed to load AI models configuration.' });
  }
});

apiRouter.put('/admin/models/:id/toggle', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { enabled } = req.body;
  try {
    const { db } = await connectToDatabase();
    await db.collection('models').updateOne(
      { _id: new ObjectId(id) },
      { $set: { enabled: Boolean(enabled) } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error toggling model:', error);
    res.status(500).json({ error: 'Failed to update AI model configuration.' });
  }
});

// Community Moderation (Admin Only)
apiRouter.get('/admin/community', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const prompts = await db.collection('promptHistory').find().toArray();
    const formatted = prompts.map(p => ({
      id: p._id.toString(),
      title: p.input || 'Untitled Prompt',
      author: p.userId.toString(),
      upvotes: p.upvotes || 0,
      status: p.status || 'pending',
      flagged: p.flagged || false,
      featured: p.featured || false
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error loading community prompts:', error);
    res.status(500).json({ error: 'Failed to load community prompts.' });
  }
});

apiRouter.put('/admin/community/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { db } = await connectToDatabase();
    await db.collection('promptHistory').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating community status:', error);
    res.status(500).json({ error: 'Failed to update prompt status.' });
  }
});

apiRouter.put('/admin/community/:id/feature', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { featured } = req.body;
  try {
    const { db } = await connectToDatabase();
    await db.collection('promptHistory').updateOne(
      { _id: new ObjectId(id) },
      { $set: { featured: Boolean(featured), updatedAt: new Date() } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating community featured:', error);
    res.status(500).json({ error: 'Failed to update prompt featured status.' });
  }
});

apiRouter.delete('/admin/community/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { db } = await connectToDatabase();
    await db.collection('promptHistory').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting community prompt:', error);
    res.status(500).json({ error: 'Failed to delete community prompt.' });
  }
});
