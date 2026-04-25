import React from 'react';
import { toast } from 'sonner';
import {
  HiOutlineCamera,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineLogout,
} from 'react-icons/hi';
import DefaultAvatar from '../DefaultAvatar.jsx';
import ProfileImage from '../ProfileImage.jsx';

const MAX_IMAGE_BYTES = 500 * 1024; // 500 KB — must match backend multer limit

const handlePick = (e, setImage) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file (JPG, PNG, etc.)');
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const kb = Math.round(file.size / 1024);
    toast.error(`Image is too large (${kb} KB). Max size is 500 KB.`);
    return;
  }
  setImage(file);
};

const EditPicker = ({ image, userData, setImage }) => (
  <label className="cursor-pointer group">
    <div className="relative">
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-white/40 shadow-2xl overflow-hidden bg-white">
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
      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
        <HiOutlineCamera className="w-7 h-7" />
        <span className="text-xs font-medium mt-1">Change</span>
      </div>
    </div>
    <input onChange={(e) => handlePick(e, setImage)} type="file" accept="image/*" className="hidden" />
  </label>
);

const ActionButtons = ({ isEdit, isSaving, onSave, onCancel, onStartEdit, onLogout }) => {
  const baseSolid =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200';
  const baseGhost =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200';

  if (isEdit) {
    return (
      <>
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`${baseSolid} bg-white !text-primary dark:!text-primary disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-50`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Saving…
            </>
          ) : (
            <>
              <HiOutlineCheck className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className={`${baseGhost} bg-white/15 !text-white ring-1 ring-white/30 hover:bg-white/25`}
        >
          <HiOutlineX className="w-5 h-5" />
          Cancel
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={onStartEdit}
        className={`${baseSolid} bg-white !text-primary dark:!text-primary hover:bg-gray-50`}
      >
        <HiOutlinePencil className="w-4 h-4" />
        Edit Profile
      </button>
      <button
        onClick={onLogout}
        className={`${baseGhost} bg-white/15 !text-white ring-1 ring-white/30 hover:bg-red-500/30 hover:ring-red-200`}
      >
        <HiOutlineLogout className="w-5 h-5" />
        Logout
      </button>
    </>
  );
};

const ProfileHeader = ({ userData, setUserData, isEdit, image, setImage, isSaving, onSave, onCancel, onStartEdit, onLogout }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-500 to-teal-600 px-6 sm:px-8 py-10 md:py-12 text-white">
    {/* Decorative blobs */}
    <div className="absolute -top-20 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
    <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

    <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
      <div className="relative">
        {isEdit ? (
          <EditPicker image={image} userData={userData} setImage={setImage} />
        ) : (
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-white/40 shadow-2xl overflow-hidden bg-white">
              <ProfileImage user={userData} size="w-28 h-28 md:w-36 md:h-36" />
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 ring-4 ring-white" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left w-full">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/80 mb-2">
          Patient Account
        </p>
        {isEdit ? (
          <input
            className="bg-white/15 backdrop-blur-sm text-2xl md:text-3xl font-bold text-white placeholder-white/70 ring-1 ring-white/30 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-white/60"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
          />
        ) : (
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{userData.name}</h2>
        )}
        <p className="mt-2 text-sm text-white/80">{userData.email}</p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center md:items-start justify-center md:justify-start">
          <ActionButtons
            isEdit={isEdit}
            isSaving={isSaving}
            onSave={onSave}
            onCancel={onCancel}
            onStartEdit={onStartEdit}
            onLogout={onLogout}
          />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
