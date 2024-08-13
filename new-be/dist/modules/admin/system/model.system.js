import generateDynamicSchema from '../../genCrud/crud.model';
import { paginate } from '../../paginate';
const dynamicModel = generateDynamicSchema({
    modelName: 'SYSTEMS',
    fields: {
        canRegisterOnAdminPanel: { type: String },
        frontendLogo: {
            type: String,
        },
        frontendUrl: { type: String },
        sendSms: { type: Boolean },
    },
    schemaOptions: { timestamps: true },
    plugins: [paginate],
});
dynamicModel.schema.pre('save', async function (next) {
    const existingDocument = await SYSTEMS.findOne();
    if (existingDocument) {
        const error = new Error('Only one document of SYSTEMS model is allowed.');
        return next(error);
    }
    next();
});
export const SYSTEMS = dynamicModel.model;
//# sourceMappingURL=model.system.js.map