const { cpus } = require('node:os');

const cpuLen = cpus().length;

module.exports = {
  apps: [
    {
      name: 'nest-admin-api',
      script: './dist/apps/admin/main.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: cpuLen,
      max_memory_restart: '1G',
      args: '',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nest-web-api',
      script: './dist/apps/web/main.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: cpuLen,
      max_memory_restart: '1G',
      args: '',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
