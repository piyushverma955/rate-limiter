const express = require("express");
const Redis = require("ioredis");
const bodyParser = require("body-parser");
const controller = require("./controller");
const config = require("./config");
const app = express(config.redis);

const redis = new Redis();
const port = 3000;

app.use(bodyParser.json());

redis.on("connect", function() {
  console.log("Redis is connected");
});

redis.on("error", function(error) {
  console.error(error);
  process.exit(0);
});

app.get("/validate-user/:id", async (req, res) => {
  return await controller.validateUser(req, res);
});

app.post("/user", async (req, res) => {
  return await controller.addUser(req, res);
});

app.delete("/user/:id", async (req, res) => {
  return await controller.removeUser(req, res);
});

app.listen(port, () => {
  console.log(`PORT is listening at ${port}`);
});
