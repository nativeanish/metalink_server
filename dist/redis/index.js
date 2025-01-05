"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("@upstash/redis");
const redis = new redis_1.Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});
exports.default = redis;
