import { toJSON } from '@modules/toJSON';
import { Schema, Types, model } from 'mongoose';
import { IPermissionsDoc, IPermissionsModel } from '../interfaces/interface.permissions';

const permissionsSchema = new Schema<IPermissionsDoc, IPermissionsModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

permissionsSchema.plugin(toJSON);

permissionsSchema.static('isExist', async function (name: string, exclude: Types.ObjectId): Promise<boolean> {
  const permission = await this.findOne({ name, _id: { $ne: exclude } });
  return !!permission;
});

const PERMISSIONS = model<IPermissionsDoc, IPermissionsModel>('PERMISSIONS', permissionsSchema);
export default PERMISSIONS;
