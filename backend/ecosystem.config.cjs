// pm2 config — keeps `node server.js` alive on the EC2 box, restarts on
// crash, restarts on reboot (with `pm2 startup`), captures logs.
//
// Usage on EC2:
//   cd ~/ClickAndCare/backend
//   doppler run -- pm2 start ecosystem.config.cjs
//   pm2 save
//   sudo pm2 startup            (one-time; pm2 prints the exact command)

module.exports = {
  apps: [
    {
      name: 'clickandcare-socket',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        // PORT is read by server.js. Caddy proxies to localhost:3000.
        PORT: '3000',
      },
    },
  ],
};
