import { paginate } from '../../paginate';
import { toJSON } from '../../toJSON';
// import { ENCRYPT } from '../../utils/encrypt';
// import { decryptMe, encryptMe } from '../../utils/encrypt';
import { Schema, model } from 'mongoose';
// const encrypt = new ENCRYPT();
/* The code is defining a Mongoose schema for a document in the "BVN_DATA" collection. The schema
specifies the structure and data types of the fields in the document. */
const BvnDataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'USERS', unique: true, required: true },
    bvnId: { type: Number },
    nin: {
        type: String,
        /*   set: (nin: string): string => {
          return encryptMe(nin);
        },
        get: (nin: string): string => {
          return decryptMe(nin);
        }, */
    },
    email: { type: String },
    gender: { type: String },
    surname: { type: String },
    serialNo: { type: String },
    faceImage: { type: String },
    firstName: { type: String },
    landmarks: { type: String },
    branchName: { type: String },
    middleName: { type: String },
    nameOnCard: { type: String },
    dateOfBirth: { type: String },
    lgaOfOrigin: { type: String },
    watchlisted: { type: String },
    lgaOfCapture: { type: String },
    phoneNumber1: { type: String },
    phoneNumber2: { type: String },
    maritalStatus: { type: String },
    stateOfOrigin: { type: String },
    enrollBankCode: { type: String },
    enrollUserName: { type: String },
    enrollmentDate: { type: String },
    lgaOfResidence: { type: String },
    stateOfCapture: { type: String },
    additionalInfo1: { type: String },
    productReference: { type: String },
    stateOfResidence: { type: String },
    bvn: { type: String, required: true /*  set: encryptMe, get: decryptMe */ },
    lastName: { type: String },
    status: { type: String },
    bvnRef: { type: String, required: true },
    callbackUrl: { type: String },
    AccountId: { type: Number },
}, {
    timestamps: true,
});
/* The line `BvnDataSchema.plugin(toJSON);` is adding a plugin called `toJSON` to the
`BvnDataSchema`. This plugin modifies the schema's `toJSON` method to customize the JSON
representation of the schema's documents. It allows you to specify which fields should be included
or excluded in the JSON output, as well as apply transformations to the data before it is serialized
to JSON. */
BvnDataSchema.plugin(toJSON);
/* The line `BvnDataSchema.plugin(paginate);` is adding a plugin called `paginate` to the
`BvnDataSchema`. This plugin adds pagination functionality to the schema, allowing you to
easily paginate through the documents in the collection. It provides methods like `paginate`,
`paginateAggregate`, and `paginateAggregateStream` to perform pagination queries. */
BvnDataSchema.plugin(paginate);
BvnDataSchema.static('isBvnExists', async function (bvn, excludeUserId) {
    const VirtualAccount = await this.findOne({ bvn, userId: { $ne: excludeUserId } });
    return !!VirtualAccount;
});
BvnDataSchema.pre('save', async function (next) {
    /* The line `const account = await BVN_DATA.findOne({ userId: this.userId, bvn: this.bvn });` is querying the
    `BVN_DATA` collection in the database to find a document that matches the given criteria. The
    criteria are `{ userId: this.userId, bvn: this.bvn }`, which means it is searching for a document where the
    `userId` and `bvn` fields match the `userId` and `bvn` values of the current document being saved. */
    const account = await BVN_DATA.findOne({ userId: this.userId, bvn: this.bvn });
    if (account) {
        // Update the existing document using updateOne
        await BVN_DATA.updateOne({ userId: this.userId, id: account.id }, { $set: { bvn: this.bvn, bvnRef: this.bvnRef } });
    }
    next(); // Continue with the save operation
});
/* The line `const BVN = model<IBvnDataDoc,
IBvnDataModel>('BVN', BvnDataSchema);` is creating a Mongoose model named
`BVN` based on the `BvnDataSchema` schema. */
const BVN_DATA = model('BVN_DATA', BvnDataSchema);
export default BVN_DATA;
//# sourceMappingURL=model.bvn-data.js.map