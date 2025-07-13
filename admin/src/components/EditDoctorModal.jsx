import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';

const EditDoctorModal = ({ doctor, isOpen, onClose }) => {
  const { updateDoctorInfo, updateDoctorProfilePicture } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    speciality: doctor?.speciality || '',
    degree: doctor?.degree || '',
    experience: doctor?.experience || doctor?.experience === 0 ? doctor?.experience : '',
    about: doctor?.about || '',
    fees: doctor?.fees || doctor?.fees === 0 ? doctor?.fees : '',
    address: formatAddress(doctor?.address) || ''
  });

  // Helper function to format address object to string for display
  function formatAddress(address) {
    if (!address) return '';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      const parts = [];
      if (address.line1) parts.push(address.line1);
      if (address.line2) parts.push(address.line2);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.pincode) parts.push(address.pincode);
      return parts.join(', ');
    }
    return '';
  }

  // Helper function to parse address string back to object format
  function parseAddress(addressString) {
    if (!addressString || typeof addressString !== 'string') return {};
    
    // Try to parse as JSON first (in case it's already an object string)
    try {
      return JSON.parse(addressString);
    } catch (e) {
      // If not JSON, treat as simple string and create a basic object
      return {
        line1: addressString.trim(),
        line2: '',
        city: '',
        state: '',
        pincode: ''
      };
    }
  }

  // Helper function to convert address object to JSON string for backend
  function stringifyAddress(addressObj) {
    if (!addressObj) return '';
    if (typeof addressObj === 'string') return addressObj;
    if (typeof addressObj === 'object') {
      return JSON.stringify(addressObj);
    }
    return '';
  }

  // Update form data when doctor changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        speciality: doctor.speciality || '',
        degree: doctor.degree || '',
        experience: doctor.experience || doctor.experience === 0 ? doctor.experience : '',
        about: doctor.about || '',
        fees: doctor.fees || doctor.fees === 0 ? doctor.fees : '',
        address: formatAddress(doctor.address) || ''
      });
      // Reset image selection when doctor changes
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [doctor]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'picture'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'info') {
        // Prepare data for submission
        const submitData = { ...formData };
        
        // Convert address string to JSON string format for backend
        if (formData.address) {
          // Create a simple address object and convert to JSON string
          const addressObj = {
            line1: formData.address.trim(),
            line2: '',
            city: '',
            state: '',
            pincode: ''
          };
          submitData.address = JSON.stringify(addressObj);
        }
        
        // Update doctor information
        await updateDoctorInfo(doctor._id, submitData);
      } else if (activeTab === 'picture' && selectedImage) {
        // Update profile picture
        await updateDoctorProfilePicture(doctor._id, selectedImage);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating doctor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const specialities = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Gynecologist',
    'Gastroenterologist',
    'Orthopedic',
    'Psychiatrist',
    'Dentist',
    'Ophthalmologist',
    'ENT Specialist',
    'Pulmonologist',
    'Endocrinologist',
    'Oncologist'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Doctor: {doctor?.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab('picture')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'picture'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile Picture
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter doctor name"
                />
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Speciality *
                </label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="">Select speciality</option>
                  {specialities.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="e.g., MBBS, MD, etc."
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience (years) *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter years of experience"
                />
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Consultation Fees (₹) *
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter consultation fees"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter doctor's description"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter doctor's address"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor?.image || assets.upload_area}
                    alt={doctor?.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="text-sm text-gray-400">
                    <p>Current image</p>
                    <p className="text-xs">Click below to upload a new one</p>
                  </div>
                </div>
              </div>

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload New Profile Picture
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-600"
                        />
                        <p className="text-sm text-green-400">Image selected</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-400">Click to upload image</p>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (activeTab === 'picture' && !selectedImage)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Updating...</span>
                </div>
              ) : (
                `Update ${activeTab === 'info' ? 'Information' : 'Picture'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal; 