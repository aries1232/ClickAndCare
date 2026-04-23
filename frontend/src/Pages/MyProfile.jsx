import React from 'react';
import { useProfileEditor } from '../hooks/useProfileEditor';
import { ProfileLoading, ProfileLoginPrompt, ProfileLoadError } from '../Components/profile/ProfileStateScreens.jsx';
import ProfileHeader from '../Components/profile/ProfileHeader.jsx';
import ContactInfoSection from '../Components/profile/ContactInfoSection.jsx';
import PersonalInfoSection from '../Components/profile/PersonalInfoSection.jsx';

const withDefaults = (userData) => ({
  ...userData,
  address: userData.address || { line1: '', line2: '' },
  gender: userData.gender || 'Not Selected',
  dob: userData.dob || 'Not Selected',
  phone: userData.phone || 'Not Provided',
  image: userData.image || 'https://via.placeholder.com/150',
});

const MyProfile = () => {
  const editor = useProfileEditor();

  if (editor.isLoading) return <ProfileLoading />;
  if (!editor.token) return <ProfileLoginPrompt onGoToLogin={editor.goToLogin} />;
  if (!editor.userData) return <ProfileLoadError onRefresh={editor.reload} />;

  const userData = withDefaults(editor.userData);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your personal information and account settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <ProfileHeader
          userData={userData}
          setUserData={editor.setUserData}
          isEdit={editor.isEdit}
          image={editor.image}
          setImage={editor.setImage}
          isSaving={editor.isSaving}
          onSave={editor.updateUserProfileData}
          onCancel={editor.cancelEdit}
          onStartEdit={() => editor.setIsEdit(true)}
          onLogout={editor.handleLogout}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContactInfoSection userData={userData} setUserData={editor.setUserData} isEdit={editor.isEdit} />
            <PersonalInfoSection userData={userData} setUserData={editor.setUserData} isEdit={editor.isEdit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
