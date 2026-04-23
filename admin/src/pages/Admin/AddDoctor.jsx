import React from 'react';
import { useAddDoctor } from '../../hooks/useAddDoctor';
import DoctorImageUpload from '../../components/doctor-form/DoctorImageUpload.jsx';
import { PersonalSection, ProfessionalSection, AboutSection } from '../../components/doctor-form/DoctorFormSections.jsx';

const AddDoctor = () => {
  const { form, setField, docImg, setDocImg, loading, onSubmit, resetForm, goToList } = useAddDoctor();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Add New Doctor</h1>
        </div>
        <p className="text-gray-400">Register a new doctor to the platform</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <DoctorImageUpload docImg={docImg} setDocImg={setDocImg} />
            <PersonalSection form={form} setField={setField} />
            <ProfessionalSection form={form} setField={setField} />
            <AboutSection form={form} setField={setField} />

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Adding Doctor...' : 'Add Doctor'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 focus:outline-none font-medium"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={goToList}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 focus:outline-none font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
