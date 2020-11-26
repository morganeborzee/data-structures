module.exports = {
  apps : [{
    script: 'wa09.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker'],
    env: {
          "PHOTON_ID":"24002f001847393035313137",
          "PHOTON_TOKEN":"b736310e80e3edb3654fc95b5e7d580874b32ea7",
          "AWSRDS_PW":"atila2078"
    }
  }],
  

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
