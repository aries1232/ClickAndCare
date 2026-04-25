const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180',
  'https://clickandcare-frontend.onrender.com',
  'https://clickandcare-admin.onrender.com',
  'https://clickandcare.netlify.app',
  'https://clickandcare.netlify.app/',
  'https://chikitsalaya.live',
];

// TEMP: dev-only CORS bypass. Reflects whatever origin the request comes
// from (ngrok tunnels, LAN IPs, etc.) so phones on the same network can
// hit the API while testing. Tighten before going to production —
// reflecting arbitrary origins with credentials:true is unsafe in prod.
const DEV_BYPASS = process.env.NODE_ENV !== 'production';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (DEV_BYPASS) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dToken', 'dtoken', 'DToken'],
};

export const socketCorsOptions = {
  origin: DEV_BYPASS ? true : ALLOWED_ORIGINS,
  credentials: true,
};
