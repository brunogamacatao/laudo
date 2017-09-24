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

  shipit.task('install-dependencies', function () {
    return shipit.remote('yarn', {
      cwd: '/root/deploy/current'
    });
  });

  shipit.task('build-assets', function () {
    return shipit.remote('webpack --progress --colors --config webpack.config.js', {
      cwd: '/root/deploy/current'
    });
  });

  shipit.task('stop-server', function () {
    return shipit.remote('pm2 delete main');
  });

  shipit.task('start-server', function () {
    return shipit.remote('pm2 start ecosystem.config.js --env production', {
      cwd: '/root/deploy/current'
    });
  });

  shipit.on('deploy', function() {
    shipit.start('stop-server');
  });

  shipit.on('published', function() {
    shipit.start(['install-dependencies', 'build-assets', 'start-server']);
  });
};