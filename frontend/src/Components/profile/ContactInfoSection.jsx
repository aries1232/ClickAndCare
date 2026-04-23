import React from 'react';
import ProfileField from './ProfileField.jsx';
import { isDigitsOnly } from '../../utils/validators';

const sharedInputClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    Verified
  </span>
);

const ContactInfoSection = ({ userData, setUserData, isEdit }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

    <ProfileField label="Email Address">
      <div className="flex items-center gap-3">
        <p className="text-gray-900 dark:text-white font-medium">{userData.email}</p>
        <VerifiedBadge />
      </div>
    </ProfileField>

    <ProfileField label="Phone Number">
      {isEdit ? (
        <input
          className={sharedInputClass}
          type="tel"
          value={userData.phone}
          onChange={(e) => { if (isDigitsOnly(e.target.value)) setUserData((prev) => ({ ...prev, phone: e.target.value })); }}
          placeholder="Enter phone number"
        />
      ) : (
        <p className="text-gray-900 dark:text-white font-medium">{userData.phone}</p>
      )}
    </ProfileField>

    <ProfileField label="Address">
      {isEdit ? (
        <div className="space-y-2">
          <input
            className={sharedInputClass}
            type="text"
            value={userData.address.line1}
            onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
            placeholder="Address Line 1"
          />
          <input
            className={sharedInputClass}
            type="text"
            value={userData.address.line2}
            onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
            placeholder="Address Line 2 (Optional)"
          />
        </div>
      ) : (
        <div className="text-gray-900 dark:text-white">
          <p className="font-medium">{userData.address.line1 || 'Not provided'}</p>
          {userData.address.line2 && <p className="text-gray-600 dark:text-gray-300">{userData.address.line2}</p>}
        </div>
      )}
    </ProfileField>
  </div>
);

export default ContactInfoSection;
