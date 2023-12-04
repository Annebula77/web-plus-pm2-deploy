require('dotenv').config();

const { MESTO_MONGOD, PORT, JWT_SECRET, SERVER_SSH } = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      // watch: true, // Если нужен режим отслеживания изменений
        env: {
        NODE_ENV: 'production',
        JWT_SECRET,
        MESTO_MONGOD,
        PORT,
      },
    },
  ],
  deploy: {
    production: {
      user: 'gohar',
      host: SERVER_SSH,
      ref: 'origin/master',
      repo: 'https://github.com/Annebula77/web-plus-pm2-deploy/tree/master/backend',
      path: '~/backend',
      'pre-deploy-local': "npm run build",
      'post-deploy': 'npm install && npm run build && pm2 startOrReload ecoconfig.js --env production',

    },
  },
};
