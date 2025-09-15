const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD || "123",
  }
});

module.exports = esClient;
