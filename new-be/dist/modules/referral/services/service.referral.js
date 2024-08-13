/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-use-before-define */
// generate referral for user
import { ApiError } from '../../errors';
import { userService } from '../../user';
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '../../utils/referenceGenerator';
import httpStatus from 'http-status';
import { userRefsService } from '..';
import REFERRAL from '../model/model.referral';
/**
 * The function `generateRefId` generates a reference ID with specific configurations like prefix,
 * type, and size.
 *
 * @return The function `generateRefId` is returning the result of calling the `easyReferenceGenerator`
 * function with specific configuration options for generating a reference ID.
 */
export function generateRefId() {
    let refId = easyReferenceGenerator({
        addDash: false,
        prefix: GeneratePrefixType.REFERRAL,
        type: GeneratekeyE.alphanumUpper,
        size: 6,
    });
    if (refId.length !== 8)
        refId = easyReferenceGenerator({
            addDash: false,
            prefix: GeneratePrefixType.REFERRAL,
            type: GeneratekeyE.alphanumUpper,
            size: 6,
        });
    return refId;
}
/**
 * The function `getUserByRefId` retrieves a user by their referral ID asynchronously.
 *
 * @param refId Referral ID used to find a user in the database.
 *
 * @return The function `getUserByRefId` is returning a user object that is retrieved from the database
 * using the `refId` provided as a parameter.
 */
export async function getUserByRefId(refId) {
    const user = await REFERRAL.findOne({ refId });
    return user;
}
/**
 * This TypeScript function retrieves a user's referral information based on their user ID
 * asynchronously.
 *
 * @param userId The `userId` parameter in the `getUserReferral` function is of type `Types.ObjectId`,
 * which is likely a unique identifier for a user in a MongoDB database.
 *
 * @return The function `getUserReferral` is returning the referral information for the user with the
 * specified `userId`.
 */
export async function getUserReferral(userId) {
    const user = await REFERRAL.findOne({ userId });
    return user;
}
// export function
/**
 * The function `createReferral` creates a referral record for a user with a specified referrer.
 *
 * @param userId The `userId` parameter is of type `Types.ObjectId` and represents the unique
 * identifier of the user for whom the referral is being created.
 * @param refBy The `refBy` parameter in the `createReferral` function is a string that represents the
 * reference ID of the user who referred the new user.
 *
 * @return The `createReferral` function is returning the result of the `CrudService.create` function
 * call, which is creating a new referral record in the database with the provided data.
 */
export async function createReferral(userId, refBy) {
    // lets check if the referral has been created first
    const getRef = await REFERRAL.findOne({ userId });
    const refId = generateRefId();
    if (getRef)
        return;
    let create;
    if (refBy) {
        const addRef = await getUserByRef(refBy);
        if (addRef) {
            await userRefsService.addToUserRefs(addRef.userId, userId);
        }
        const created = await REFERRAL.create({ refBalance: 0, refId, userId, refBy: addRef === null || addRef === void 0 ? void 0 : addRef.userId, totalRef: 0 });
        create = created;
    }
    else {
        const created = await REFERRAL.create({ refBalance: 0, refId, userId, totalRef: 0 });
        create = created;
    }
    await userService.updateUserById(userId, { refId });
    return create;
}
/**
 * The function `addToReferralBalance` updates the referral balance of a user by a specified amount.
 *
 * @param userId The `userId` parameter is of type `Types.ObjectId`, which is typically used to
 * represent a unique identifier for a document in a MongoDB database. It is used to identify the user
 * whose referral balance needs to be updated.
 * @param amount The `amount` parameter in the `addToReferralBalance` function represents the value
 * that will be added to the referral balance of a user with the specified `userId`. This amount will
 * be added to the existing referral balance of the user in the database.
 */
export async function addToReferralBalance(userId, amount) {
    const user = await REFERRAL.findOne({ userId });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    user.refBalance += amount;
    await user.save();
}
/**
 * This TypeScript function removes a specified amount from a user's referral balance stored in a
 * MongoDB collection.
 *
 * @param userId The `userId` parameter is of type `Types.ObjectId` and represents the unique
 * identifier of the user whose referral balance needs to be updated.
 * @param amount The `amount` parameter in the `removeFromReferralbalance` function represents the
 * value that will be subtracted from the referral balance of a user with the specified `userId`.
 */
export async function removeFromReferralBalance(userId, amount) {
    const user = await REFERRAL.findOne({ userId });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    if (user.refBalance < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'insufficient balance');
    }
    user.refBalance -= amount;
    await user.save();
}
export async function addToRefCount(userId) {
    const user = await REFERRAL.findOne({ userId });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    user.totalRef += 1;
    await user.save();
}
export async function getReferralByUserId(userId) {
    const user = await REFERRAL.findOne({ userId });
    if (!user) {
        const used = await createReferral(userId);
        return used;
    }
    return user;
}
// admin functions
/**
 * The function getAllReferrals retrieves all referral records asynchronously.
 *
 * @return The function `getAllReferrals` is returning a Promise that resolves to an array of referral
 * objects fetched from the database using the `REFERRAL.find()` method.
 */
export async function getAllReferrals() {
    const referrals = await REFERRAL.find();
    return referrals;
}
/**
 * This TypeScript function retrieves a referral by its ID asynchronously.
 *
 * @param referralId The `referralId` parameter is of type `Types.ObjectId`, which is likely a unique
 * identifier for a referral in a MongoDB database. The function `getReferralById` is an asynchronous
 * function that retrieves a referral document from the `REFERRAL` collection in the database based on
 * the provided
 *
 * @return The function `getReferralById` is returning the referral object that is found by querying
 * the REFERRAL model using the provided `referralId`.
 */
export async function getReferralById(referralId) {
    const referral = await REFERRAL.findById(referralId);
    return referral;
}
/**
 * The function `updateReferral` updates a referral document in a MongoDB database based on the
 * provided referral ID and update data.
 *
 * @param referralId The `referralId` parameter is the unique identifier of the referral that you want
 * to update. It is of type `Types.ObjectId`, which is typically used in MongoDB to represent unique
 * identifiers for documents in a collection.
 * @param updateData The `updateData` parameter in the `updateReferral` function is of type
 * `Partial<ReferralI>`, which means it is an object containing partial data of a `ReferralI` type.
 * This allows you to update only specific properties of a `ReferralI` object without
 *
 * @return The function `updateReferral` is returning the updated referral object after saving the
 * changes.
 */
export async function updateReferral(referralId, updateData) {
    const referral = await REFERRAL.findById(referralId);
    if (!referral) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
    }
    Object.assign(referral, updateData);
    await referral.save();
    return referral;
}
/**
 * The function `deleteReferral` deletes a referral document from the database based on the provided
 * referralId.
 *
 * @param referralId The `referralId` parameter is of type `Types.ObjectId`, which is likely an
 * ObjectId from a MongoDB database. It is used to uniquely identify a referral document in the
 * database.
 */
export async function deleteReferral(referralId) {
    const referral = await REFERRAL.findById(referralId);
    if (!referral) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
    }
    await REFERRAL.findByIdAndDelete(referralId);
}
export async function getUserByRef(referralId) {
    const user = await REFERRAL.findOne({ refId: referralId });
    return user;
}
//# sourceMappingURL=service.referral.js.map