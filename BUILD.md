# ClickAndCare - Build Instructions

## Quick Build Commands

### Windows
```bash
# Run the batch file
build.bat

# Or use npm directly
npm run install:all
npm run build:all
```

### Linux/Mac
```bash
# Make the script executable (first time only)
chmod +x build.sh

# Run the shell script
./build.sh

# Or use npm directly
npm run install:all
npm run build:all
```

## Available Scripts

### Installation
- `npm run install:all` - Install dependencies for all components (root, frontend, backend, admin)

### Building
- `npm run build:frontend` - Build the frontend React app
- `npm run build:admin` - Build the admin React app
- `npm run build:all` - Build both frontend and admin apps

### Development
- `npm run dev:frontend` - Start frontend development server
- `npm run dev:admin` - Start admin development server
- `npm run start:backend` - Start backend server

### Linting
- `npm run lint:frontend` - Lint frontend code
- `npm run lint:admin` - Lint admin code
- `npm run lint:all` - Lint both frontend and admin code

## Build Outputs

After successful build:
- **Frontend**: `frontend/dist/` - Static files for the main application
- **Admin**: `admin/dist/` - Static files for the admin panel
- **Backend**: Ready to run with `npm run start:backend`

## Project Structure

```
ClickAndCare/
├── frontend/          # Main React application
├── admin/            # Admin panel React application
├── backend/          # Node.js/Express server
├── package.json      # Root package.json with build scripts
├── build.bat         # Windows build script
├── build.sh          # Linux/Mac build script
└── BUILD.md          # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Troubleshooting

1. **Permission denied on build.sh**: Run `chmod +x build.sh`
2. **Build fails**: Check that all dependencies are installed with `npm run install:all`
3. **Port conflicts**: Ensure ports 3000, 5173, and 5174 are available for development servers 