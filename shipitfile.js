module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/pre_deploy',
      deployTo: '/root/deploy',
      repositoryUrl: 'https://github.com/brunogamacatao/laudo.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      shallowClone: true
    },
    staging: {
      servers: 'root@45.79.104.38'
    }
  });
};