require('dotenv').config({ path: '.env.deploy' });

const { MESTO_MONGOD, PORT, JWT_SECRET, SERVER_SSH, DEPLOY_USER, DEPLOY_REF, DEPLOY_REPO, PATH} = process.env;

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
      user: DEPLOY_USER,
      host: SERVER_SSH,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: PATH,
      'post-deploy': 'npm install && cp ../.env.deploy .env && pm2 startOrReload ecosystem.config.js --env production',

    },
  },
};
