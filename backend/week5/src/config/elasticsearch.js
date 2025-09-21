const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTIC_NODE || 'http://127.0.0.1:9200',
  auth: {
    username: process.env.ELASTIC_USERNAME || 'elastic',
    password: process.env.ELASTIC_PASSWORD || 'changeme'
  }
});

module.exports = client;


