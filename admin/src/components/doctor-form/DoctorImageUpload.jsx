import React from 'react';

const DoctorImageUpload = ({ docImg, setDocImg }) => (
  <div className="bg-gray-700/50 rounded-lg p-6">
    <label className="block text-sm font-medium text-gray-300 mb-4">Doctor Profile Image</label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-3 bg-gray-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input type="file" className="hidden" onChange={(e) => setDocImg(e.target.files[0])} accept="image/*" />
      </label>
    </div>
    {docImg && (
      <div className="mt-4 flex items-center gap-2 text-green-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{docImg.name} selected</span>
      </div>
    )}
  </div>
);

export default DoctorImageUpload;
