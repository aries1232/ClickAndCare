import React from 'react';
import { SPECIALITIES } from '../../utils/constants';

const INPUT = 'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const EXPERIENCE_OPTIONS = ['No Experience', '1-2 years', '3-5 years', '5-10 years', '10+ years'];

export const PersonalSection = ({ form, setField }) => (
  <div className="bg-gray-700/50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Personal Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Full Name *">
        <input type="text" value={form.name} onChange={setField('name')} className={INPUT} placeholder="Dr. John Doe" required />
      </Field>
      <Field label="Email Address *">
        <input type="email" value={form.email} onChange={setField('email')} className={INPUT} placeholder="doctor@example.com" required />
      </Field>
      <Field label="Password *">
        <input type="password" value={form.password} onChange={setField('password')} className={INPUT} placeholder="Enter secure password" required />
      </Field>
      <Field label="Address *">
        <input type="text" value={form.address} onChange={setField('address')} className={INPUT} placeholder="Hospital/Clinic address" required />
      </Field>
    </div>
  </div>
);

export const ProfessionalSection = ({ form, setField }) => (
  <div className="bg-gray-700/50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
      </svg>
      Professional Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Speciality *">
        <select value={form.speciality} onChange={setField('speciality')} className={INPUT} required>
          {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Experience *">
        <select value={form.experience} onChange={setField('experience')} className={INPUT} required>
          {EXPERIENCE_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </Field>
      <Field label="Degree/Qualifications *">
        <input type="text" value={form.degree} onChange={setField('degree')} className={INPUT} placeholder="MBBS, MD, etc." required />
      </Field>
      <Field label="Consultation Fees (₹) *">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">₹</span>
          <input type="number" value={form.fees} onChange={setField('fees')} className={`${INPUT} pl-8`} placeholder="500" required />
        </div>
      </Field>
    </div>
  </div>
);

export const AboutSection = ({ form, setField }) => (
  <div className="bg-gray-700/50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      About Doctor
    </h3>
    <textarea
      value={form.about}
      onChange={setField('about')}
      rows="4"
      className={`${INPUT} resize-none`}
      placeholder="Brief description about the doctor's expertise, experience, and specializations..."
      required
    />
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    {children}
  </div>
);
