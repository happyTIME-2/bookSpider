'use strict';

const redisClient = require('../util/redisclient');

const  QUEUE_NAME = "queue:fetchChapter";

export function addTaskToQueue(taskName, callback) {
  redisClient.zscore(QUEUE_NAME, taskName, (error, task) => {
    if (error) {
      console.log(error);
    } else {
      if (task) {
        console.log('任务已存在，不新增相同任务');
        callback(null, task);
      } else {
        redisClient.zadd(QUEUE_NAME, new Date().getTime(), taskName, (error, result) => {
          if (error) {
            callback(error);
          } else {
            callback(null, result);
          }
        })
      }
    }
  })
}