import React from 'react';
import ProfileField from './ProfileField.jsx';

const sharedInputClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const PersonalInfoSection = ({ userData, setUserData, isEdit }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>

    <ProfileField label="Gender">
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

    <ProfileField label="Date of Birth">
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

    <ProfileField label="Account Status">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-700 dark:text-green-400 font-medium">Active</span>
      </div>
    </ProfileField>
  </div>
);

export default PersonalInfoSection;
