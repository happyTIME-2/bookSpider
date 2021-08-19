'use strict';

const redisClient = require('../util/redisclient');

const schedule = require('node-schedule');

const QUEUE_NAME = 'queue:expmple';
const PARALLEL_TASK_NUMBER = 2;

const getTaskFromQueue = (callback) => {
  redisClient.zrangebyscore([QUEUE_NAME, 1, new Date().getTime(), 'LIMIT', 0, PARALLEL_TASK_NUMBER], (err, tasks) => {
    if (err) {
      callback(err)
    } else {
      if (tasks.length > 0) {
        let tmp = [];
        tasks.forEach(task => {
          tmp.push(0);
          tmp.push(task);
        });

        redisClient.zadd([QUEUE_NAME].concat(tmp), (err, result) => {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        })
      }
    }
  })
}

const addFaildTaskToQueue = (taskName, callback) => {
  redisClient.zadd(QUEUE_NAME, new Date().getTime(), taskName, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  })
}

const removeSucceedTaskFromQueue = (taskName, callback) => {
  redisClient.zrem(QUEUE_NAME, taskName, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  })
}

const execTask = (taskName) => {
  return new Promise((resolve, reject) => {
    
  })
}