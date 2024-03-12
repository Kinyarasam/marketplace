#!/usr/bin/env node
import redis from 'redis';
import util from 'util';


class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log(err);
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected');
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const redisGet = util.promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    console.log(value)
    return value;
  }

  set(key, value, time) {
    const redisSet = util.promisify(this.client.setex).bind(this.client);
    return redisSet(key, time, value);
  }

  async del(key) {
    const redisDel = util.promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
