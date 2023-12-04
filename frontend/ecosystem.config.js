require('dotenv').config({path: '.env.deploy'});

const { DEPLOY_USER, DEPLOY_REF, DEPLOY_REPO, DEPLOY_PATH_FRONTEND, SERVER_SSH } = process.env;


module.exports = {
  apps: [],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: SERVER_SSH,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_FRONTEND,
      "post-setup": `export PATH=$PATH:/home/gohar/.nvm/versions/node/v16.20.2/bin && cd ${DEPLOY_PATH_FRONTEND}/source/frontend && npm i && npm run build `,

    },
  },
};