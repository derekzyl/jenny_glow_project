/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import mongoose, { Schema, model } from 'mongoose';
// Generic function to generate dynamic schema
const generateDynamicSchema = ({ fields, modelName, plugins, schemaOptions, }) => {
    const schemaDefinition = {};
    // Iterate through the fields and define the schema
    // eslint-disable-next-line no-restricted-syntax
    for (const [keys, values] of Object.entries(fields)) {
        const fieldOptions = values;
        if (typeof fieldOptions === 'object') {
            schemaDefinition[keys] = fieldOptions;
        }
        else if (Array.isArray(fieldOptions)) {
            switch (typeof fieldOptions[0]) {
                case 'string':
                    schemaDefinition[keys] = {
                        type: [String],
                    };
                    break;
                case 'number':
                    schemaDefinition[keys] = {
                        type: [Number],
                    };
                    break;
                case 'object':
                    {
                        Object.prototype.hasOwnProperty.call(fieldOptions[0], 'ref') &&
                            Object.prototype.hasOwnProperty.call(fieldOptions[0], 'type') &&
                            fieldOptions[0].type === mongoose.Schema.Types.ObjectId
                            ? (schemaDefinition[keys] = fieldOptions)
                            : (schemaDefinition[keys] = generateDynamicSchema({
                                modelName: '',
                                fields: fieldOptions[0],
                                schemaOptions: schemaOptions !== null && schemaOptions !== void 0 ? schemaOptions : {},
                            }).schema);
                    }
                    break;
                case 'bigint':
                    schemaDefinition[keys] = {
                        type: [BigInt],
                    };
                    break;
                case 'boolean':
                    schemaDefinition[keys] = {
                        type: [Boolean],
                    };
                    break;
                case 'symbol':
                    schemaDefinition[keys] = {
                        type: [String],
                    };
                    break;
                default:
                    break;
            }
        }
        else {
            schemaDefinition[keys] = {
                type: fieldOptions,
            };
        }
    }
    // Create and return the schema
    const schemaDef = new Schema(schemaDefinition, schemaOptions);
    plugins === null || plugins === void 0 ? void 0 : plugins.forEach((plugin) => schemaDef.plugin(plugin));
    return {
        model: model(modelName, schemaDef),
        schema: schemaDef,
    };
};
export default generateDynamicSchema;
//# sourceMappingURL=crud.model.js.map