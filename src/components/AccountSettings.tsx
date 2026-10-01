import React, { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogOut, Save, Image as ImageIcon, Key, User as UserIcon, Upload } from 'lucide-react';

export function AccountSettings({ onLogout }: { onLogout: () => void }) {
  const { user, token, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setProfileMessage({ type: 'error', text: 'Please upload an image file.' });
        return;
      }
      if (file.size > 1024 * 1024) {
        setProfileMessage({ type: 'error', text: 'Image must be under 1MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    if (displayName.length > 100) {
      setProfileMessage({ type: 'error', text: 'Display name must be under 100 characters.' });
      return;
    }
    if (photoURL && !photoURL.startsWith('https://') && !photoURL.startsWith('data:image/')) {
      setProfileMessage({ type: 'error', text: 'Invalid photo URL. Must be HTTPS or a valid image.' });
      return;
    }
    setIsUpdatingProfile(true);
    setProfileMessage({ type: '', text: '' });
    try {
      await updateUserProfile(displayName, photoURL);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error updating profile:', error);
      setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !user.email || !token) return;
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update access keyphrase.');
      }
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error updating password:', error);
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password. Check your current password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Profile Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
          <UserIcon className="w-4 h-4" /> Profile Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
              {photoURL ? (
                <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3 h-3 mr-2" /> Upload New Avatar
              </Button>
              <p className="text-[10px] text-zinc-500 mt-1">Recommended: Square image, max 1MB.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Display Name</Label>
            <Input 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              placeholder="Your name"
              className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
            />
          </div>
          
          <Button 
            onClick={handleUpdateProfile} 
            disabled={isUpdatingProfile}
            size="sm"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
          </Button>
          {profileMessage.text && (
            <p className={`text-xs ${profileMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {profileMessage.text}
            </p>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-black/10 dark:bg-white/10" />

      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
          <Key className="w-4 h-4" /> Change Password
        </h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Current Password</Label>
            <Input 
              type="password"
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              placeholder="••••••••"
              className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">New Password</Label>
            <Input 
              type="password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••"
              className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
            />
          </div>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={isUpdatingPassword || !currentPassword || !newPassword}
            size="sm"
            variant="secondary"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </Button>
          {passwordMessage.text && (
            <p className={`text-xs ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {passwordMessage.text}
            </p>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-black/10 dark:bg-white/10" />

      {/* Logout Section */}
      <div className="pt-2">
        <Button 
          variant="destructive" 
          className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
