import validator from 'validator';

// Tiny middleware factory: declaratively validate req.body fields.
// Usage: router.post('/login', validate({ email: 'email', password: 'password' }), handler)
//
// Supported rules:
//   'email'        — non-empty + valid email
//   'password'     — non-empty + >= 8 chars
//   'nonEmpty'     — non-empty string
//   'otp'          — exactly 6 digits
//   'objectId'     — looks like a Mongo ObjectId

const VALIDATORS = {
  email: (v) => (typeof v === 'string' && validator.isEmail(v) ? null : 'Invalid email address'),
  password: (v) => (typeof v === 'string' && v.length >= 8 ? null : 'Password must be at least 8 characters'),
  nonEmpty: (v) => (typeof v === 'string' && v.trim().length > 0 ? null : 'Required field missing'),
  otp: (v) => (/^\d{6}$/.test(v || '') ? null : 'OTP must be 6 digits'),
  objectId: (v) => (typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v) ? null : 'Invalid id'),
};

export const validate = (rules) => (req, res, next) => {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const check = VALIDATORS[rule];
    if (!check) continue;
    const msg = check(req.body?.[field]);
    if (msg) errors[field] = msg;
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};
