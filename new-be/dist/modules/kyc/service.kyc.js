/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { sendNotificationToStaffs } from '../notification/service.notification';
import { userService } from '../user';
import { getUserById } from '../user/service.user';
import { imageDeleteHandler } from '../utils/file_handler/files_handler';
import httpStatus from 'http-status';
import _ from 'lodash';
import ApiError from '../errors/ApiError';
import { KycFieldStates, kycTierPermissions } from '../setting/roles';
import KYC_FIELD_STATUS from './models/model.field-status.kyc';
import KYC from './models/model.kyc';
/**
 * Get kyc user by id
 * change
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IKycDoc | null>}
 */
export const getKycUserById = async (id) => KYC.findById(id);
/**
 * Get kyc user by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IKycDoc | null>}
 */
export const getKycUserByUserId = async (userId) => {
    const kyc = await KYC.findOne({ userId });
    return kyc;
};
/**
 * Get kyc user status by kyc id
 * @param {mongoose.Types.ObjectId} kycId
 * @returns {Promise<IKycFieldStatusDoc | null>}
 */
export const getKycUserStatusByKycId = async (kycId) => {
    const kyc = await KYC_FIELD_STATUS.findOne({ kycId });
    return kyc;
};
/**
 * Get kyc user by phone number
 * @param {string} phoneNumber
 * @returns {Promise<IKycDoc | null>}
 */
export const getKycUserByPhoneNumber = async (phoneNumber) => {
    const kyc = await KYC.findOne({ phoneNumber });
    return kyc;
};
/**
 * Get kyc user by document number
 * @param {string} documentNumber
 * @returns {Promise<IKycDoc | null>}
 */
export const getKycUserByDocumentNumber = async (documentNumber) => {
    const kyc = await KYC.findOne({ documentNumber });
    return kyc;
};
/**
 * Get kyc users by tier
 * @param {number} tier
 * @returns {Promise<IKycDoc | null>}
 */
export const getKycUsersByTier = async (tier) => {
    const users = await KYC.find({ tier });
    return users;
};
/**
 * Get the total number of kyc users by tier
 * @param {number} tier
 * @returns {Promise<IKycDoc | null>}
 */
export const countKycUsersByTier = async (tier) => {
    const count = await KYC.countDocuments({ tier });
    return count;
};
/**
 * Get a list of users who have not started or not completed their KYC
 * @returns {Promise<IKycDoc[]>}
 */
export const getIncompleteKycUsers = async () => {
    const incompleteKycUsers = await KYC.find({ $or: [{ tier: 0 }, { isComplete: false }] });
    return incompleteKycUsers;
};
/**
 * Get a list of users who have not started or not completed their KYC
 * @returns {Promise<IKycDoc[]>}
 */
export const getVerifiedKycUsers = async () => {
    const verifiedKycUsers = await KYC.find({ isVerified: true });
    return verifiedKycUsers;
};
/**
 * Create/Register a user's kyc profile status
 * @param {NewCreatedKyc} kycBody
 * @returns {Promise<IKycFieldStatusDoc>}
 */
export const createKycUserStatus = async (kycBody) => {
    const kycUser = await getKycUserByUserId(kycBody.userId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile not found');
    }
    // Add kycId to kycStatusBody
    const kycStatusBody = {
        kycId: kycUser.id,
        phoneNumber: KycFieldStates.UNINITIATED,
        address: KycFieldStates.UNINITIATED,
        country: KycFieldStates.UNINITIATED,
        documentNumber: KycFieldStates.UNINITIATED,
        documentImage: KycFieldStates.UNINITIATED,
        userPhoto: KycFieldStates.UNINITIATED,
        dateOfBirth: KycFieldStates.UNINITIATED,
        bvn: KycFieldStates.UNINITIATED,
    };
    // Pick only the needed properties from kycStatusBody and convert them to KycFieldStates
    const pickedKycStatusBody = _.mapValues(_.pick(kycBody, [
        'phoneNumber',
        'country',
        'dateOfBirth',
        'address',
        'documentNumber',
        'documentImage',
        'userPhoto',
        'bvn',
    ]), (value) => (value ? KycFieldStates.PENDING : KycFieldStates.UNINITIATED));
    // Merge the two objects
    _.merge(kycStatusBody, pickedKycStatusBody);
    const kycAssign = await KYC_FIELD_STATUS.create(kycStatusBody);
    return kycAssign;
};
/**
 * Create/Register a user's kyc profile
 * @param {NewCreatedKyc} kycBody
 * @returns {Promise<IKycDoc>}
 */
export const createKycUser = async (kycBody) => {
    const user = await getUserById(kycBody.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (kycBody.phoneNumber && (await KYC.isPhoneNumberTaken(kycBody.phoneNumber))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
    }
    if (kycBody.documentNumber && (await KYC.isDocumentNumberTaken(kycBody.documentNumber))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document Number already taken');
    }
    if (kycBody.bvn && (await KYC.isBvnTaken(kycBody.bvn))) {
        sendNotificationToStaffs({
            body: `kindly check this user with name ${user.firstName} ${user.lastName} with email ${user.email} \n trying to use a bvn already registered to someone ${kycBody.bvn}`,
            permissions: [],
            title: 'possible fraud',
            type: 'fraud alert',
            nType: 'both',
        });
        throw new ApiError(httpStatus.BAD_REQUEST, 'bvn Number already taken');
    }
    const createKyc = await KYC.create(kycBody);
    if (!createKyc) {
        throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'User KYC profile not created');
    }
    const kycStatus = await createKycUserStatus(kycBody);
    if (!kycStatus) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User KYC profile status not created');
    }
    return createKyc;
};
/**
 * Query for kyc users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryKycUsers = async (filter, options) => {
    const kycUsers = await KYC.paginate(filter, options);
    return kycUsers;
};
/**
 * Update kyc user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateKycBody} updateBody
 * @returns {Promise<IKycDoc | null>}
 */
export const updateKycProfileById = async (userId, updateBody, updatedByUserId) => {
    const kycUser = await getKycUserByUserId(userId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile not found');
    }
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const kycUserStatus = await updateKycUserStatusByKycId(kycUser.id, updateBody);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User KYC profile status not updated');
    }
    if (!kycUser.isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User KYC profile not deactivated');
    }
    if (kycUser.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User KYC profile already verified');
    }
    // Check if phone number is taken
    if (updateBody.phoneNumber && (await KYC.isPhoneNumberTaken(updateBody.phoneNumber, kycUser.id))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
    }
    if (updateBody.documentNumber && (await KYC.isDocumentNumberTaken(updateBody.documentNumber, kycUser.id))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document Number already taken');
    }
    if (updateBody.bvn && (await KYC.isBvnTaken(updateBody.bvn, kycUser.id))) {
        sendNotificationToStaffs({
            body: `kindly check this user with name ${user.firstName} ${user.lastName} with email ${user.email} \n trying to use a bvn already registered to someone ${updateBody.bvn}`,
            permissions: [],
            title: 'possible fraud',
            type: 'fraud alert',
            nType: 'both',
        });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document Number already taken');
    }
    // Update KYC user fields
    const newObj = await getKycFieldsThatCanBeUpdated(updateBody, userId);
    Object.assign(kycUser, newObj);
    /* The above code is checking if the property `documentImage` exists in the `newObj` object. If it
    does, the code inside the `if` block will be executed. */
    if (newObj.documentImage) {
        if (kycUser.documentImage) {
            await imageDeleteHandler(kycUser.documentImage);
        }
    }
    if (newObj.userPhoto) {
        if (kycUser.userPhoto) {
            await imageDeleteHandler(kycUser.userPhoto);
        }
    }
    await kycUser.save();
    // Check if all the main KYC fields have PENDING, UNINITIATED, or FAILED status
    const hasPendingFields = Object.values(kycUserStatus).every((fieldStatus) => ![KycFieldStates.PENDING, KycFieldStates.UNINITIATED, KycFieldStates.FAILED].includes(fieldStatus));
    // If any field is not pending, uninitiated or failed, set isComplete to true
    if (!hasPendingFields) {
        kycUser.isComplete = true;
    }
    kycUser.updatedByUserId = updatedByUserId;
    await kycUser.save();
    return kycUser;
};
/**
 * Update a user's kyc profile status by id
 * @param {mongoose.Types.ObjectId} kycId
 * @param {UpdateKycBody} kycUpdateBody
 * @returns {Promise<IKycFieldStatusDoc | null>}
 */
export const updateKycUserStatusByKycId = async (kycId, kycUpdateBody) => {
    const kycUserStatus = await getKycUserStatusByKycId(kycId);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile status not found');
    }
    // Determine non-verified fields
    const nonVerifiedFields = Object.keys(kycUpdateBody).filter((field) => kycUserStatus[field] !== KycFieldStates.VERIFIED);
    // Update only the non-verified fields
    const kycStatusBody = {};
    for (const field of nonVerifiedFields) {
        kycStatusBody[field] = kycUpdateBody[field]
            ? KycFieldStates.PENDING
            : KycFieldStates.UNINITIATED;
    }
    // Update KYC status with new values
    Object.assign(kycUserStatus, kycStatusBody);
    await kycUserStatus.save();
    return kycUserStatus;
};
/**
 * Delete kyc by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IKycDoc | null>}
 */
export const deleteKycProfileByUserId = async (userId) => {
    const kycUser = await getKycUserByUserId(userId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile not found');
    }
    const kycUserStatus = await getKycUserStatusByKycId(kycUser.id);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile status not found');
    }
    if (kycUser.userPhoto)
        await imageDeleteHandler(kycUser.userPhoto);
    if (kycUser.documentImage)
        await imageDeleteHandler(kycUser.documentImage);
    await KYC.deleteOne({ id: kycUser.id });
    await KYC_FIELD_STATUS.deleteOne({ id: kycUser.id });
    return kycUser;
};
/**
 * Activate/Deactivate kyc user profile by id - admin access
 * @param {mongoose.Types.ObjectId} kycId
 * @param {mongoose.Types.ObjectId} updatedByUserId
 * @param {boolean} isActive
 * @returns {Promise<IKycDoc | null>}
 */
export const activateKycUserById = async (kycId, updatedByUserId, isActive = true) => {
    const kycUser = await getKycUserById(kycId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile not found');
    }
    kycUser.isActive = isActive;
    kycUser.updatedByUserId = updatedByUserId;
    await kycUser.save();
    return kycUser;
};
/**
 * verify kyc user profile - admin access
 * @param {mongoose.Types.ObjectId} kycId
 * @param {UpdateKycFieldStatusBody} kycStatusBody
 * @returns {Promise<IKycDoc | null>}
 */
export const VerifyKycProfileById = async (kycId, kycStatusBody, updatedByUserId) => {
    const kycUser = await getKycUserById(kycId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile not found');
    }
    const kycUserStatus = await getKycUserStatusByKycId(kycUser.id);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile status not found');
    }
    // Calculate the tier based on filtered fields
    let tier = 0;
    for (const [field, state] of Object.entries(kycStatusBody)) {
        if (state === KycFieldStates.VERIFIED) {
            // Check if the field is associated with a higher tier
            for (const [key, value] of kycTierPermissions) {
                if (value.includes(field) && key > tier) {
                    tier = key;
                }
            }
        }
    }
    kycUser.tier = tier;
    if (kycUser.tier === 3 && !kycUser.isVerified) {
        kycUser.isVerified = true;
    }
    kycUser.updatedByUserId = updatedByUserId;
    await kycUser.save();
    return kycUser;
};
export const getKycFieldsThatCanBeUpdated = async (updateBody, userId) => {
    const kycUser = await getKycUserByUserId(userId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile not found');
    }
    const kycUserStatus = await getKycUserStatusByKycId(kycUser.id);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User KYC profile status not updated');
    }
    // const fieldsThatCanBeUpdated = Object.keys(updateBody).filter()
    const fieldsThatCanBeUpdated = Object.keys(updateBody).filter((field) => kycUserStatus[field] !== 'VERIFIED');
    const newFields = _.pick(updateBody, fieldsThatCanBeUpdated);
    return newFields;
};
export const getKycStatus = async (userId) => {
    const kycUser = await getKycUserByUserId(userId);
    if (!kycUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile not found');
    }
    const kycUserStatus = await getKycUserStatusByKycId(kycUser.id);
    if (!kycUserStatus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile status not initialized');
    }
};
export const checkIfKycExist = async (userId) => {
    const kycUser = await getKycUserByUserId(userId);
    return !!kycUser;
};
//# sourceMappingURL=service.kyc.js.map