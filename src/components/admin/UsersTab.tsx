import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, Search, MoreVertical, Eye, Ban, CheckCircle, Trash2, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useAuth } from "../AuthContext";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastLogin: any;
  createdAt?: any;
  status?: 'active' | 'suspended';
  role?: 'admin' | 'moderator' | 'user';
  promptsGenerated?: number;
}

export function UsersTab() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: UserData) => {
    if (!token) return;
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const response = await fetch(`/api/admin/users/${user.uid}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error();
      setUsers(users.map(u => u.uid === user.uid ? { ...u, status: newStatus } : u));
      if (selectedUser?.uid === user.uid) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleToggleRole = async (user: UserData) => {
    if (!token) return;
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS
      ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((e: string) => e.trim().toLowerCase())
      : [];
    if (adminEmails.includes(user.email?.toLowerCase())) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const response = await fetch(`/api/admin/users/${user.uid}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) throw new Error();
      setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      if (selectedUser?.uid === user.uid) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error updating user role:", error);
    }
  };

  const confirmDeleteUser = (user: UserData) => {
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS
      ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((e: string) => e.trim().toLowerCase())
      : [];
    if (adminEmails.includes(user.email?.toLowerCase())) return;
    setUserToDelete(user);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !token) return;
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.uid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      setUsers(users.filter(u => u.uid !== userToDelete.uid));
      if (selectedUser?.uid === userToDelete.uid) {
        setIsModalOpen(false);
      }
      setUserToDelete(null);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <CardTitle>Registered Users</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 w-full sm:w-[250px] bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-zinc-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-black/5 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Login</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <div className="text-zinc-900 dark:text-white">{user.displayName || 'Anonymous'}</div>
                          <div className="text-xs text-zinc-500 font-normal">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                          user.role === 'moderator' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-500" onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-amber-500" onClick={() => handleToggleStatus(user)}>
                            {user.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => confirmDeleteUser(user)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information and management options for this user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
                    {selectedUser.displayName?.charAt(0) || selectedUser.email?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedUser.displayName || 'Anonymous'}</h3>
                  <p className="text-sm text-zinc-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">User ID</p>
                  <p className="text-sm font-mono text-zinc-900 dark:text-zinc-300 truncate">{selectedUser.uid}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-300">{selectedUser.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-300">{selectedUser.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Prompts Generated</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedUser.promptsGenerated}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Last Login</p>
                  <p className="text-sm text-zinc-900 dark:text-zinc-300">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Join Date</p>
                  <p className="text-sm text-zinc-900 dark:text-zinc-300">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
                <Button variant="outline" className="border-black/10 dark:border-white/10" onClick={() => handleToggleRole(selectedUser)}>Change Role</Button>
                <Button variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:text-red-400 border-none" onClick={() => handleToggleStatus(selectedUser)}>
                  {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)} className="border-black/10 dark:border-white/10">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
