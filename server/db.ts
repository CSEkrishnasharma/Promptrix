import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);

  await client.connect();
  const db = client.db('promptrix'); // Use database promptrix as requested

  cachedClient = client;
  cachedDb = db;

  // Perform seeding and index setup
  await seedDatabase(db);

  return { client, db };
}

async function seedDatabase(db: Db) {
  // 1. Seed models
  const modelsCollection = db.collection('models');
  const modelsCount = await modelsCollection.countDocuments();
  if (modelsCount === 0) {
    const initialModels = [
      { name: "Universal Model", provider: "Promptrix", enabled: true, description: "Our proprietary routing model that selects the best underlying AI based on the prompt.", createdAt: new Date() },
      { name: "GPT-4o", provider: "OpenAI", enabled: true, description: "High-intelligence model for complex reasoning and coding tasks.", createdAt: new Date() },
      { name: "Claude 3.5 Sonnet", provider: "Anthropic", enabled: true, description: "Excellent for writing, analysis, and nuanced understanding.", createdAt: new Date() },
      { name: "Gemini 1.5 Pro", provider: "Google", enabled: true, description: "Fast and capable model with a massive context window.", createdAt: new Date() },
    ];
    await modelsCollection.insertMany(initialModels);
    console.log('Seeded initial models.');
  }

  // 2. Seed templates
  const templatesCollection = db.collection('templates');
  const templatesCount = await templatesCollection.countDocuments();
  if (templatesCount === 0) {
    const initialTemplates = [
      { title: "YouTube Script Prompt", description: "Generates a highly engaging YouTube script with hook, intro, body, and CTA.", category: "Content Creation", visibility: "public", createdAt: new Date() },
      { title: "Startup Idea Generator", description: "Brainstorms 5 unique startup ideas based on a given industry and target audience.", category: "Brainstorming", visibility: "public", createdAt: new Date() },
      { title: "Landing Page Copy", description: "Creates high-converting copy for a SaaS landing page.", category: "Marketing", visibility: "private", createdAt: new Date() },
      { title: "Cold Email Sequence", description: "Writes a 3-part cold email sequence for B2B sales.", category: "Sales", visibility: "public", createdAt: new Date() },
    ];
    await templatesCollection.insertMany(initialTemplates);
    console.log('Seeded initial templates.');
  }

  // 3. Seed feedback
  const feedbackCollection = db.collection('feedback');
  const feedbackCount = await feedbackCollection.countDocuments();
  if (feedbackCount === 0) {
    const initialFeedback = [
      { user: "sarah@example.com", type: "Feature Request", message: "It would be great to have a dedicated section for coding prompts.", date: "2026-04-10", resolved: false, read: false, createdAt: new Date() },
      { user: "mike_dev@example.com", type: "Bug Report", message: "The copy button sometimes doesn't work on mobile Safari.", date: "2026-04-09", resolved: false, read: true, createdAt: new Date() },
      { user: "alex_writer@example.com", type: "General Feedback", message: "Love the new UI update! Much cleaner.", date: "2026-04-08", resolved: true, read: true, createdAt: new Date() },
    ];
    await feedbackCollection.insertMany(initialFeedback);
    console.log('Seeded initial feedback.');
  }

  // Set up indexes
  const userCredCollection = db.collection('userCred');
  await userCredCollection.createIndex({ email: 1 }, { unique: true });

  const promptHistoryCollection = db.collection('promptHistory');
  await promptHistoryCollection.createIndex({ userId: 1 });
  await promptHistoryCollection.createIndex({ createdAt: -1 });
  await promptHistoryCollection.createIndex({ userId: 1, createdAt: -1 });
}
