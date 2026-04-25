import React from 'react';
import { HiOutlineUser, HiOutlineCake, HiOutlineShieldCheck, HiOutlineIdentification } from 'react-icons/hi';
import ProfileField from './ProfileField.jsx';

const sharedInputClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';

const PersonalInfoSection = ({ userData, setUserData, isEdit }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <HiOutlineIdentification className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
    </div>

    <ProfileField label="Gender" icon={HiOutlineUser}>
      {isEdit ? (
        <select
          className={sharedInputClass}
          value={userData.gender}
          onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
        >
          <option value="Not Selected">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      ) : (
        <p className="text-gray-900 dark:text-white font-medium">{userData.gender}</p>
      )}
    </ProfileField>

    <ProfileField label="Date of Birth" icon={HiOutlineCake}>
      {isEdit ? (
        <input
          className={sharedInputClass}
          type="date"
          value={userData.dob}
          onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
        />
      ) : (
        <p className="text-gray-900 dark:text-white font-medium">
          {userData.dob === 'Not Selected' ? 'Not provided' : userData.dob}
        </p>
      )}
    </ProfileField>

    <ProfileField label="Account Status" icon={HiOutlineShieldCheck}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Active</span>
      </div>
    </ProfileField>
  </div>
);

export default PersonalInfoSection;
