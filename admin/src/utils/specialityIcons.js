const ICONS = {
  'General Physician': '🩺',
  Gynecologist: '👶',
  Dermatologist: '🧴',
  Pediatrician: '🧒',
  Neurologist: '🧠',
  Gastroenterologist: '🍽️',
  Cardiologist: '❤️',
  Orthopedic: '🦴',
  Psychiatrist: '🧘',
  Dentist: '🦷',
  Ophthalmologist: '👁️',
  'ENT Specialist': '👂',
  Pulmonologist: '🫁',
  Endocrinologist: '⚖️',
  Oncologist: '🎗️',
};

export const getSpecialityIcon = (speciality) => ICONS[speciality] || '🏥';
