import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import WORKER_JOBS from './model.jobs.worker';
/**
 * Add a new worker job
 * @param {NewCreatedWorkerJob} jobBody
 * @returns {Promise<IWorkerJobDoc>}
 */
export const addNewWorkerJob = async (jobBody) => {
    if (await WORKER_JOBS.isExists(jobBody.name)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Job already exists');
    }
    return WORKER_JOBS.create(jobBody);
};
/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryWorkerJobs = async (filter, options) => {
    const jobs = await WORKER_JOBS.paginate(filter, options);
    return jobs;
};
/**
 * Get job by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const getWorkerJobById = async (id) => WORKER_JOBS.findById(id);
/**
 * Get job by name
 * @param {string} name
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const getWorkerJobByName = async (name) => WORKER_JOBS.findOne({ name });
/**
 * Get job by optional attrs
 * @param {Partial<IWorkerJob>} attrs
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const getWorkerJobByOptionalAttrs = async (attrs) => WORKER_JOBS.findOne(attrs);
/**
 * Update worker job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {UpdateWorkerJobBody} updateBody
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const updateWorkerJobById = async (jobId, updateBody) => {
    const job = await getWorkerJobById(jobId);
    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }
    Object.assign(job, updateBody);
    await job.save();
    return job;
};
/**
 * Delete job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const deleteWorkerJobById = async (jobId) => {
    const job = await getWorkerJobById(jobId);
    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }
    await job.deleteOne();
    return job;
};
/**
 * Deactivate job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IWorkerJobDoc | null>}
 */
export const deactivateWorkerJobById = async (jobId) => {
    const updateBody = { isActive: false };
    const job = await updateWorkerJobById(jobId, updateBody);
    return job;
};
//# sourceMappingURL=service.jobs.worker.js.map