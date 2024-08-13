import { Agenda } from '@hokify/agenda';
import mongoose from 'mongoose';
import config from '../../config/config';
import { JobTypes } from '../../config/jobs';
import logger from '../logger/logger';
import { addNewWorkerJob, getWorkerJobByOptionalAttrs } from './service.jobs.worker';
/**
 * Represents a manager for handling jobs using Agenda library.
 * we can use worker threads to re-implement this
 */
export default class QueueManager {
    /**
     * Creates an instance of QueueManager.
     * @param {string} [mongoURI] - The MongoDB connection URI.
     * @param {winston.Logger} [qLogger] - An optional custom logger.
     */
    constructor(mongoURI, qLogger) {
        this.agenda =
            mongoURI !== undefined
                ? new Agenda({ db: { address: mongoURI }, maxConcurrency: 20 })
                : new Agenda({ maxConcurrency: 20 });
        this.logger = qLogger !== undefined ? qLogger : logger;
        this.recurrenceRule = 'one minute'; // '*/1 * * * *';
        this.interval = 15000; // Adjust the polling interval as needed
    }
    /**
     * Defines a job in the agenda.
     * @template T - The type of data associated with the job.
     * @param {string} jobName - The name of the job.
     * @param {(logger: winston.Logger, data: T) => void} jobHandler - The function to handle the job.
     * @returns {Promise<void>} A Promise that resolves when the job is defined.
     */
    async defineJob(jobName, jobHandler) {
        const savedJob = await getWorkerJobByOptionalAttrs({ name: jobName, isActive: true, isProcessed: false });
        if (!savedJob) {
            return;
        }
        this.agenda.define(jobName, async (job) => {
            this.logger.info(`Queue manager: Defining job: ${job.attrs.name}`);
            const logger = this.logger;
            jobHandler(logger, job.attrs.data);
        });
    }
    /**
     * Polls for new jobs at regular intervals.
     * @returns {Promise<void>} A Promise that resolves when the polling starts.
     */
    async pollForNewJobs() {
        setInterval(async () => {
            this.logger.info(`Queue manager: Processing New Jobs`);
        }, this.interval);
    }
    /**
     * Starts the agenda instance and begins polling for new jobs.
     * @returns {Promise<void>} A Promise that resolves when the agenda is started.
     */
    async start() {
        await this.agenda.start();
        this.pollForNewJobs();
    }
    /**
     * Stops the agenda instance.
     * @returns {Promise<void>} A Promise that resolves when the agenda is stopped.
     */
    async stop() {
        await this.agenda.stop();
        process.exit(0);
    }
}
// Create a separate instance or use the same instance as the main application?
mongoose.connect(config.mongoose.url).then(() => {
    logger.info('Queue manager => Connected to MongoDB');
    (async () => {
        const mongoURI = config.mongoose.url; //'mongodb://127.0.0.1:27017/agendaJobs'; // config.mongoose.url;
        const queueManager = new QueueManager(mongoURI, logger);
        try {
            const jobBody = {
                name: 'updateAllCurrencyPairRates-1234',
                type: JobTypes.GET_CURRENCY_PRICE,
                when: 'one minute',
                data: JSON.parse('{"data": 1234}'),
                isActive: true,
            };
            const newJob = await addNewWorkerJob(jobBody);
            logger.info(`Queue manager: Added new job ${newJob.name}`);
        }
        catch (error) {
            logger.error(`Queue manager: Error Adding new job =>`, error);
        }
        // Start the agenda instance and begin polling for new jobs
        logger.info(`Queue manager: Starting Queue manager at ${queueManager}`);
        await queueManager.start();
        // can stop the agenda instance when needed
        // await queueManager.stop();
    })();
});
//# sourceMappingURL=manager.jobs.worker.js.map