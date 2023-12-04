import 'dotenv/config';

const { MESTO_MONGOD, PORT, JWT_SECRET, SERVER_SSH } = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'npm',
      args: 'start',
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
      repo: REPO,
      path: '/backend',
      'post-deploy': 'npm install && pm2 startOrReload ecoconfig.js --env production', // Команды после деплоя
    },
  },
};
