module.exports = {
  apps: [
    {
      name: 'restaurante-api',
      script: './backend/src/server.js',
      cwd: '/var/www/restaurante',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/log/pm2/restaurante-error.log',
      out_file: '/var/log/pm2/restaurante-out.log',
      time: true,
    },
  ],
};
