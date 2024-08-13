/* eslint-disable import/prefer-default-export */
import { ApiError } from '../../errors';
import { logger } from '../../logger';
import NOTIFICATIONS from '../../notification/model.notification';
import BVN_DATA from '../../subVirtualAccount/models/model.bvn-data';
import { createVirtualAccount } from '../../subVirtualAccount/service.virtual';
import { getUserById } from '../../user/service.user';
import httpStatus from 'http-status';
export const bvnWebHook = async (data) => {
    try {
        // find bvn user by ref id
        const bvnUser = await BVN_DATA.findOne({ bvnRef: data.reference });
        if (!bvnUser)
            throw new ApiError(httpStatus.BAD_REQUEST, 'BVN user not found');
        // lets get the user by id
        const user = await getUserById(bvnUser.userId);
        if (!user)
            throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
        // next we create the user bank account
        await createVirtualAccount({ bvnRef: data.reference, user, phoneNumber: '', bvn: '' }, true);
        await NOTIFICATIONS.create({
            userId: user.id,
            message: `Your bank account has been created successfully`,
            type: 'BANK ACCOUNT',
            ntype: 'both',
        });
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, `${error}`);
    }
};
//# sourceMappingURL=service.bvn.webhook.js.map