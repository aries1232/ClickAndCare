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
    <div className="pb-16">
      <div className="mb-6 mt-2">
        <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Account
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
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

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <ContactInfoSection userData={userData} setUserData={editor.setUserData} isEdit={editor.isEdit} />
            <PersonalInfoSection userData={userData} setUserData={editor.setUserData} isEdit={editor.isEdit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
