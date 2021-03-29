const Redis = require("ioredis");
const config = require("./config");
const redis = new Redis();
const { METADATA, TIMESTAMP, INF, MARGIN } = config.constants;

const addUser = async payload => {
  const { requests, user_id, window_time_in_second } = payload || {};
  payload = JSON.stringify({ requests, window_time_in_second });
  const user_uuid = user_id + METADATA;

  let user = await redis.get(user_uuid);
  if (user) throw new Error("user already present");
  else await redis.set(user_uuid, payload);

  return JSON.parse(payload);
};

const removeUser = async payload => {
  const { id } = payload;
  const user = id + METADATA;
  await redis.del(user);
};

const validateUser = async payload => {
  const { id } = payload;
  let { requests, window_time_in_second } = await getRateForUser(id);
  let currentTime = Date.now() / 1000;
  let oldestPossibleEntry = currentTime - window_time_in_second;

  await redis.zremrangebyscore(id + TIMESTAMP, 0, oldestPossibleEntry);
  let currentRequestCount = await returnSize(id);

  if (currentRequestCount > requests + MARGIN) {
    throw new Error(" Not allowed");
  } else {
    await addTimeStampAtomically(id, currentTime);
    return "Allowed";
  }
};

const addTimeStampAtomically = async (userId, currentTime) => {
  await redis
    .multi()
    .zadd(userId + TIMESTAMP, currentTime, currentTime)
    .exec();
};

const returnSize = async userId => {
  let [count] = await redis
    .multi()
    .zcount(userId + TIMESTAMP, 0, INF)
    .exec();

  return count[1];
};

const getRateForUser = async user_id => {
  const user_uuid = user_id + METADATA;
  let user = await redis.get(user_uuid);
  if (user) return JSON.parse(user);
  else throw new Error("User not found");
};

module.exports = {
  addUser,
  removeUser,
  validateUser
};
