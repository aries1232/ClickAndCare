import React from 'react';
import DefaultAvatar from '../DefaultAvatar.jsx';
import ProfileImage from '../ProfileImage.jsx';

const EditPicker = ({ image, userData, setImage }) => (
  <label className="cursor-pointer">
    <div className="relative">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
        {image ? (
          <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Profile" />
        ) : userData?.image ? (
          <img
            className="w-full h-full object-cover"
            src={userData.image}
            alt="Profile"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : (
          <DefaultAvatar name={userData?.name} size="w-full h-full" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
    </div>
    <input onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*" className="hidden" />
  </label>
);

const ActionButtons = ({ isEdit, isSaving, onSave, onCancel, onStartEdit, onLogout }) => {
  if (isEdit) {
    return (
      <>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Save Changes
            </>
          )}
        </button>
        <button onClick={onCancel} className="bg-white/20 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors duration-200">
          Cancel
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button onClick={onStartEdit} className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Edit Profile
      </button>
      <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-medium hover:bg-red-100 transition-colors duration-200 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Logout
      </button>
    </div>
  );
};

const ProfileHeader = ({ userData, setUserData, isEdit, image, setImage, isSaving, onSave, onCancel, onStartEdit, onLogout }) => (
  <div className="bg-primary px-6 py-8 text-white">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative">
        {isEdit ? (
          <EditPicker image={image} userData={userData} setImage={setImage} />
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
            <ProfileImage user={userData} size="w-24 h-24 md:w-32 md:h-32" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        {isEdit ? (
          <input
            className="bg-white/20 text-2xl md:text-3xl font-bold text-white placeholder-white/80 border-0 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-white/50"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
          />
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{userData.name}</h2>
        )}
        <p className="text-white/90 text-lg mb-4">Patient Account</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButtons isEdit={isEdit} isSaving={isSaving} onSave={onSave} onCancel={onCancel} onStartEdit={onStartEdit} onLogout={onLogout} />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
