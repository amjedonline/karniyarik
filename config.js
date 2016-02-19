var config = {};

config.development = {
  db: {
    host: 'localhost',
    name: 'karniyarik',
    port: '27017'
  }
}

config.test = {
  db: {
    host: 'localhost',
    name: 'test14',
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
