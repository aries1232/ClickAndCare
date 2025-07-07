import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminSettings = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  
  const { aToken, backendUrl } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      loadAdminProfile();
    }
  }, [aToken]);

  const loadAdminProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/profile`, {
        headers: { aToken }
      });
      
      if (data.success) {
        setAdminProfile(data.admin);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error loading admin profile:', error);
      toast.error('Failed to load admin profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecoveryEmail = async (e) => {
    e.preventDefault();
    
    if (!newEmail.trim() || !newName.trim() || !adminPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsAddingEmail(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/recovery-email`, {
        email: newEmail,
        name: newName,
        password: adminPassword
      }, {
        headers: { aToken }
      });
      
      if (data.success) {
        toast.success('Recovery email added successfully');
        setNewEmail('');
        setNewName('');
        setAdminPassword('');
        loadAdminProfile(); // Reload to get updated list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error adding recovery email:', error);
      toast.error(error.response?.data?.message || 'Failed to add recovery email');
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleChangeAdminEmail = async (e) => {
    e.preventDefault();
    
    if (!newAdminEmail.trim() || !emailChangePassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsChangingEmail(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/change-email`, {
        newEmail: newAdminEmail,
        password: emailChangePassword
      }, {
        headers: { aToken }
      });
      
      if (data.success) {
        toast.success('Admin email changed successfully');
        setNewAdminEmail('');
        setEmailChangePassword('');
        loadAdminProfile(); // Reload to get updated profile
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error changing admin email:', error);
      toast.error(error.response?.data?.message || 'Failed to change admin email');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleToggleRecoveryEmail = async (email) => {
    setIsToggling(true);
    try {
      const { data } = await axios.patch(`${backendUrl}/api/admin/recovery-email/${encodeURIComponent(email)}/toggle`, {}, {
        headers: { aToken }
      });
      
      if (data.success) {
        toast.success(data.message);
        loadAdminProfile(); // Reload to get updated list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling recovery email:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle recovery email');
    } finally {
      setIsToggling(false);
    }
  };

  const handleRemoveRecoveryEmail = async (email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from recovery emails?`)) {
      return;
    }

    setIsRemoving(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/recovery-email/${encodeURIComponent(email)}`, {
        headers: { aToken }
      });
      
      if (data.success) {
        toast.success('Recovery email removed successfully');
        loadAdminProfile(); // Reload to get updated list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error removing recovery email:', error);
      toast.error(error.response?.data?.message || 'Failed to remove recovery email');
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-400">Manage your account settings and recovery emails</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Profile */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Admin Profile</h2>
          
          {adminProfile && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <p className="text-white font-medium">{adminProfile.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Login</label>
                <p className="text-gray-400">
                  {adminProfile.lastLogin ? new Date(adminProfile.lastLogin).toLocaleString() : 'Never'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  adminProfile.isActive 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-red-900 text-red-200'
                }`}>
                  {adminProfile.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}

          {/* Change Admin Email Form */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-3">Change Admin Email</h3>
            <p className="text-gray-400 text-sm mb-4">
              For security, please provide your admin password to change the main admin email.
            </p>
            
            <form onSubmit={handleChangeAdminEmail} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Email Address</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new admin email"
                  autoComplete="off"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Admin Password</label>
                <input
                  type="password"
                  value={emailChangePassword}
                  onChange={(e) => setEmailChangePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your admin password"
                  autoComplete="new-password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isChangingEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingEmail ? 'Changing Email...' : 'Change Admin Email'}
              </button>
            </form>
          </div>
        </div>

        {/* Recovery Emails */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recovery Emails</h2>
          <p className="text-gray-400 text-sm mb-6">
            These emails will receive OTP when you request a password reset
          </p>

          {/* Add New Recovery Email */}
          <form onSubmit={handleAddRecoveryEmail} className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">
              Add Recovery Email
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              For security, please provide your admin password to add a recovery email.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter contact name"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter recovery email address"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your admin password"
                autoComplete="new-password"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isAddingEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingEmail ? 'Adding...' : 'Add Recovery Email'}
              </button>
            </div>
          </form>

          {/* Recovery Emails List */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Current Recovery Emails</h3>
            
            {adminProfile?.recoveryEmails && adminProfile.recoveryEmails.length > 0 ? (
              <div className="space-y-3">
                {adminProfile.recoveryEmails.map((recoveryEmail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{recoveryEmail.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          recoveryEmail.isActive 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {recoveryEmail.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{recoveryEmail.email}</p>
                      <p className="text-gray-500 text-xs">
                        Added: {new Date(recoveryEmail.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRecoveryEmail(recoveryEmail.email)}
                        disabled={isToggling}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                          recoveryEmail.isActive
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isToggling ? '...' : recoveryEmail.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveRecoveryEmail(recoveryEmail.email)}
                        disabled={isRemoving}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRemoving ? '...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No recovery emails configured</p>
                <p className="text-gray-500 text-sm">Add recovery emails to enable password reset functionality</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">How Recovery Email Verification Works</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• First, click "Verify Recovery Email" to send an OTP to the email address</li>
              <li>• Check the email inbox and enter the 6-digit OTP received</li>
              <li>• Once verified, the email will be added as a recovery email</li>
              <li>• When you request a password reset, OTP will be sent to all active recovery emails</li>
              <li>• You can check any of these email inboxes to find the OTP</li>
              <li>• Only active recovery emails will receive the OTP</li>
              <li>• Recovery emails are logged for security purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 