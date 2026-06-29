module.exports = {
  apps: [
    {
      name: 'restaurante-api',
      script: './backend/src/server.js',
      cwd: '/home/ubuntu/SISTEMAS/RESTAURANTE',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/ubuntu/logs/restaurante-error.log',
      out_file: '/home/ubuntu/logs/restaurante-out.log',
      time: true,
    },
  ],
};
