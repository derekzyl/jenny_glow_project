import mongoose from 'mongoose';
import { JobTypes } from '../../config/jobs';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
const workerJobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        enum: JobTypes,
        default: JobTypes.GET_CURRENCY_PRICE,
    },
    when: {
        type: String,
        required: false,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
    isProcessed: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
workerJobSchema.plugin(toJSON);
workerJobSchema.plugin(paginate);
/**
 * Check if job exists - to avoid duplicate jobs
 * @param {string} name - The job name
 * @param {ObjectId} [excludeJobId] - The id of the job to be excluded
 * @returns {Promise<boolean>}
 */
workerJobSchema.static('isExists', async function (name, excludeJobId) {
    const workerJobSchema = await this.findOne({ name, _id: { $ne: excludeJobId } });
    return !!workerJobSchema;
});
const WORKER_JOBS = mongoose.model('WORKER_JOBS', workerJobSchema);
export default WORKER_JOBS;
//# sourceMappingURL=model.jobs.worker.js.map