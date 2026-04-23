import React, { useContext } from 'react';
import { assets } from '../../../assets/assets';
import DefaultAvatar from '../../DefaultAvatar.jsx';
import { AppContext } from '../../../context/AppContext';

const StatusPill = ({ item }) => {
  if (item.cancelled) return <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">Cancelled</span>;
  if (item.isCompleted) return <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">Completed</span>;
  return <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">Scheduled</span>;
};

const AppointmentRow = ({ item, slotDateFormat }) => (
  <div className="flex items-center px-6 py-4 hover:bg-gray-700 transition-colors duration-200">
    <img
      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
      src={item.userData?.image || assets.upload_area}
      alt={item.userData?.name}
      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
    />
    {(!item.userData?.image || item.userData.image === '') && (
      <DefaultAvatar name={item.userData?.name} size="w-12 h-12" className="border-2 border-gray-600" />
    )}
    <div className="flex-1 ml-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-white">{item.userData?.name || 'Patient Name'}</h3>
        <span className="text-sm text-gray-400">with</span>
        <span className="font-medium text-blue-400">{item.docData?.name || 'Doctor Name'}</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{slotDateFormat(item.slotDate)} at {item.slotTime}</p>
    </div>
    <div className="flex items-center gap-2">
      <StatusPill item={item} />
      {item.amount && <span className="text-sm font-medium text-gray-300">₹{item.amount}</span>}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="px-6 py-8 text-center">
    <div className="text-gray-500 mb-3">
      <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" clipRule="evenodd" />
      </svg>
    </div>
    <p className="text-gray-400 font-medium">No appointments found</p>
    <p className="text-gray-500 text-sm">No recent appointments to display</p>
  </div>
);

const RecentAppointments = ({ appointments }) => {
  const { slotDateFormat } = useContext(AppContext);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Recent Appointments</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {appointments && appointments.length > 0
          ? appointments.map((item, i) => <AppointmentRow key={i} item={item} slotDateFormat={slotDateFormat} />)
          : <EmptyState />}
      </div>
    </div>
  );
};

export default RecentAppointments;
