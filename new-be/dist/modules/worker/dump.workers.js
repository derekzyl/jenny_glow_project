"use strict";
// import winston from 'winston';
// import schedule from 'node-schedule';
// import { MessageQueue } from '@modules/queue/queue';
// import updateAllCryptoWalletBalance from './jobs/updateCryptoWalletBalance.jobs.workers';
// import updateAllCurrencyPairRates from './jobs/priceCalculator.currency-pair.jobs.workers';
// import logger from '../logger/logger';
// import { Subscriber } from 'zeromq';
// const messageQueue = new MessageQueue();
// const recurrenceRule = '*/1 * * * *';
// export interface IJobsQueue {
//   [key: string]: (logger: winston.Logger) => void;
//   updateAllCurrencyPairRates: (logger: winston.Logger) => void;
//   updateAllCryptoWalletBalance: (logger: winston.Logger) => void;
// }
// export const jobsQueue: IJobsQueue = {
//   updateAllCurrencyPairRates: (logger: winston.Logger) => updateAllCurrencyPairRates(logger),
//   updateAllCryptoWalletBalance: (logger: winston.Logger) => updateAllCryptoWalletBalance(logger),
// };
// /**
//  * Asynchronous function to publish all background jobs to a message queue.
//  *
//  * @param {winston.Logger} logger - The Winston logger for logging information.
//  * @returns {Promise<void>} A Promise that resolves when all jobs are published.
//  */
// export async function publishBackgroundJobs(logger: winston.Logger): Promise<void> {
//   try {
//     logger.info('Publishing All Jobs');
//     await messageQueue.publish('');
//     // Retrieve the names of all jobs from the jobsQueue
//     const jobNames = Object.keys(jobsQueue);
//     // Iterate over each job and publish it to the message queue
//     for (const jobName of jobNames) {
//       logger.info(`Publishing Job: ${jobName}`);
//       // Schedule job to run every N minutes
//       schedule.scheduleJob(recurrenceRule, async () => {
//         logger.info(`Running Job: ${jobName}`);
//         // job.func(logger);
//         // Publish the job to the message queue
//         await messageQueue.publish(jobName);
//         logger.info(`Published Job: ${jobName}`);
//       });
//     }
//     logger.info('All Background Jobs Published Successfully');
//   } catch (error) {
//     // Handle any errors that occur during the job publishing process
//     logger.error('Error publishing background jobs:', error);
//   }
// }
// /**
//  * Asynchronous function to subscribe to background jobs for each job in the jobsQueue.
//  *
//  * @param {winston.Logger} logger - The Winston logger for logging information.
//  * @returns {Promise<void>} A Promise that resolves when the subscription process is complete.
//  */
// export async function subscribeToBackgroundJobs(logger: winston.Logger): Promise<void> {
//   try {
//     logger.info('Subscribe to Jobs');
//     // Retrieve the names of all jobs from the jobsQueue
//     const jobNames = Object.keys(jobsQueue);
//     // Iterate over each job and subscribe to its corresponding messages
//     for (const jobName of jobNames) {
//       logger.info(`Subscribing to Job: ${jobName}`);
//       // Subscribe to messages for the current jobName
//       messageQueue.subscribe<string>(jobName, (message) => {
//         // Retrieve the function corresponding to the current jobName
//         const jobFunction = jobsQueue[jobName];
//         if (jobFunction) {
//           // Handle the received message as needed
//           console.log(`Received message in subscribeToMessages(): ${message}`);
//           // Call the corresponding job function with the logger
//           jobFunction(logger);
//         } else {
//           logger.error(`Job function not found for ${jobName}`);
//         }
//       });
//     }
//     logger.info('Subscription to Jobs Completed');
//   } catch (error) {
//     // Handle any errors that occur during the subscription process
//     logger.error('Error subscribing to jobs:', error);
//   }
// }
// async function main() {
//   messageQueue.listen(() => {
//     logger.info(`Queue ${messageQueue.method} server started at ${messageQueue.url}`);
//   });
//   messageQueue.useLogger(logger);
//   // run jobs
//   // publishBackgroundJobs(logger);
//   // subscribeToBackgroundJobs(logger);
//   // Retrieve the names of all jobs from the jobsQueue
//   const jobNames = Object.keys(jobsQueue);
//   // Iterate over each job and subscribe to its corresponding messages
//   for (const jobName of jobNames) {
//     logger.info(`Subscribing to Job: ${jobName}`);
//     // Subscribe to messages for the current jobName
//     messageQueue.subscribe<string>(jobName, (message) => {
//       // Retrieve the function corresponding to the current jobName
//       const jobFunction = jobsQueue[jobName];
//       if (jobFunction) {
//         // Handle the received message as needed
//         console.log(`Received message in subscribeToMessages(): ${message}`);
//         // Call the corresponding job function with the logger
//         jobFunction(logger);
//       } else {
//         logger.error(`Job function not found for ${jobName}`);
//       }
//     });
//   }
//   // Use a for-await-of loop to iterate over incoming messages from the Pull socket
//   const subscribeSocket = new Subscriber({ connectTimeout: 10000 });
//   subscribeSocket.connect(messageQueue.url);
//   subscribeSocket.subscribe('updateAllCurrencyPairRates');
//   for await (const [receivedTopic, msg] of subscribeSocket) {
//     logger.info(`Received to ${receivedTopic}`);
//     if (receivedTopic !== undefined && msg !== undefined) {
//       // Simulate a delay in processing each message
//       // await this.sleep(DEFAULT_INTERVAL);
//       // Log the received job/message
//       logger.info(`Received ${receivedTopic.toString()} Job, containing message: ${msg.toJSON()}`);
//     }
//   }
//   // run jobs
//   publishBackgroundJobs(logger);
//   // const exitHandler = () => {
//   //   if (server) {
//   //     messageQueue.dispose();
//   //     server.close(() => {
//   //       logger.info('Server closed');
//   //       process.exit(1);
//   //     });
//   //   } else {
//   //     process.exit(1);
//   //   }
//   // };
//   // const unexpectedErrorHandler = (error: string) => {
//   //   logger.error(error);
//   //   exitHandler();
//   // };
//   // process.on('uncaughtException', unexpectedErrorHandler);
//   // process.on('unhandledRejection', unexpectedErrorHandler);
//   // process.on('SIGTERM', () => {
//   //   logger.info('SIGTERM received');
//   //   if (messageQueue) {
//   //     messageQueue.dispose();
//   //   }
//   // });
// }
// main();
// //
// // For Those things that need schedulers - https://blog.logrocket.com/comparing-best-node-js-schedulers/
// // Currency Pair Rates
// // Wallet Deposit - do crypto first
// // Wallet Withdrawal - do crypto first
// // use mongodb as a queue (to track jobs)
// // deposit - implement a watcher, that watches for the change in state of the mongodb collection
// // https://stackoverflow.com/questions/34857454/nodejs-scheduling-jobs-on-multiple-nodes
// // https://www.npmjs.com/package/node-schedule
// // also don't allow jobs to crash server
// // const jobsQueue = [
// //   {
// //     name: 'updateAllCurrencyPairRates',
// //     // recurrenceRule: '*/2 * * * *',
// //     func: (logger: winston.Logger) => updateAllCurrencyPairRates(logger),
// //   },
// //   {
// //     name: 'updateAllCryptoWalletBalance',
// //     // recurrenceRule: '*/1 * * * *',
// //     func: (logger: winston.Logger) => updateAllCryptoWalletBalance(logger),
// //   },
// // ];
// job: Job
// (job) => {
//   // job processing logic here
//   this.logger.info(`Processing job: ${job.attrs.name}`);
//   this.logger.info(`Job data: ${job.attrs.data}`);
//   // Retrieve the function corresponding to the current job.name
//   const jobFunction = jobsList[job.attrs.name];
//   if (jobFunction) {
//     // Handle the received message as needed
//     this.logger.info(`Received data: ${job.attrs.data}`);
//     // Call the corresponding job function with the logger
//     jobFunction(logger);
//   } else {
//     this.logger.error(`Job function not found for ${job.attrs.name}`, '');
//   }
// }
//# sourceMappingURL=dump.workers.js.map