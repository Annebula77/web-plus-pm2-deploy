require('dotenv').config({path: '.env.deploy'});

const { MESTO_MONGOD, PORT, JWT_SECRET, SERVER_SSH, DEPLOY_USER, DEPLOY_REF, DEPLOY_REPO, DEPLOY_PATH_BACKEND, } = process.env;

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
      path: DEPLOY_PATH_BACKEND,
      "pre-deploy-local": `scp .env ${DEPLOY_USER}@${SERVER_SSH}:${DEPLOY_PATH_BACKEND}/source`,
      "post-deploy": `cd ${DEPLOY_PATH_BACKEND}/source/backend && npm i && npm run build && pm2 startOrRestart ecosystem.config.js && pm2 save`,
    },
  },
};
