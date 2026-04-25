import React from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineBadgeCheck } from 'react-icons/hi';
import ProfileField from './ProfileField.jsx';
import { isDigitsOnly } from '../../utils/validators';

const sharedInputClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';

const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold rounded-full">
    <HiOutlineBadgeCheck className="w-3.5 h-3.5" />
    Verified
  </span>
);

const ContactInfoSection = ({ userData, setUserData, isEdit }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <HiOutlineMail className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
    </div>

    <ProfileField label="Email Address" icon={HiOutlineMail}>
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-gray-900 dark:text-white font-medium break-all">{userData.email}</p>
        <VerifiedBadge />
      </div>
    </ProfileField>

    <ProfileField label="Phone Number" icon={HiOutlinePhone}>
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

    <ProfileField label="Address" icon={HiOutlineLocationMarker}>
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
          {userData.address.line2 && <p className="text-gray-600 dark:text-gray-400 text-sm">{userData.address.line2}</p>}
        </div>
      )}
    </ProfileField>
  </div>
);

export default ContactInfoSection;
