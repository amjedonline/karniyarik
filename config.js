var config = {};

config.development = {
  db: {
    host: '192.168.99.100',
    name: 'karniyarik',
    port: '27017'
  }
}

config.test = {
  db: {
    host: '192.168.99.100',
    name: 'test1',
    port: '27017'
  }
}

config.live = {
  db: {
    host: '',
    name: 'karniyarik',
    port: '27017'
  }
}

exports.config = config;
