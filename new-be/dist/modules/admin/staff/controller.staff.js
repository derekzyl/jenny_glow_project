import { CrudService } from '../../genCrud';
import { emailService } from '../../notification';
import { tokenService } from '../../token';
import { userService } from '../../user';
import { authService } from '../../auth';
import { ApiError } from '../../errors';
import { generateAlphanumericReference } from '../../utils';
import catchAsync from '../../utils/catchAsync';
import { easyPick } from '../../utils/pick';
import { GeneratekeyE } from '../../utils/referenceGenerator';
import httpStatus from 'http-status';
import { assignRolesService } from '../Roles/services/service.roles';
import STAFFS from './model.staff';
export const createStaffController = catchAsync(async (req, res) => {
    const staffBody = req.body;
    if (!staffBody.password)
        staffBody.password = generateAlphanumericReference(10, GeneratekeyE.password);
    const user = await userService.registerUser({
        email: staffBody.email,
        firstName: staffBody.firstName,
        lastName: staffBody.lastName,
        password: staffBody.password,
    });
    if (!user)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user, kindly check your details');
    const token = await tokenService.generateVerifyEmailToken(user);
    if (staffBody.role) {
        assignRolesService({ userEmail: user.email, role: staffBody.role });
    }
    await emailService.sendVerificationEmail(user.email, `${token} \n and your login password is ${staffBody.password}`, user.firstName);
    const response = await CrudService.create({ exempt: '-userId', Model: STAFFS }, Object.assign({ userId: user._id }, staffBody), { userId: user._id, email: user.email });
    if (response)
        res.status(httpStatus.CREATED).json(response);
});
export const makeExistingUserStaff = catchAsync(async (req, res) => {
    const staffBody = req.body;
    const user = await userService.getUserByEmail(staffBody.email);
    if (!user)
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    const findStaff = await STAFFS.findOne({ userId: user._id });
    if (findStaff)
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is already staff');
    if (staffBody.role) {
        assignRolesService({ userEmail: user.email, role: staffBody.role });
    }
    const response = await CrudService.create({ exempt: '-userId', Model: STAFFS }, Object.assign({ userId: user._id }, staffBody), { userId: user._id, email: user.email });
    if (response)
        res.status(httpStatus.CREATED).json(response);
});
/* The `deleteStaffController` function is a controller function that handles the deletion of a staff
member. */
export const deleteStaffByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await CrudService.delete({ exempt: '-userId', Model: STAFFS }, { _id: id });
    res.json(response);
});
export const getManyStaffsController = catchAsync(async (req, res) => {
    const response = await CrudService.getMany({ exempt: '-__V', Model: STAFFS }, req.query, { model: 'userId', fields: '-__V -password ' }, {});
    res.json(response);
});
export const getOneStaffByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await CrudService.getOne({ exempt: '-__V', Model: STAFFS }, { _id: id }, { model: 'userId', fields: 'email firstName lastName role id' });
    res.json(response);
});
export const getOneStaffByUserId = catchAsync(async (req, res) => {
    const { user } = req;
    const response = await CrudService.getOne({ exempt: '', Model: STAFFS }, { userId: user._id }, { model: 'userId', fields: 'email firstName lastName role id' });
    res.json(response);
});
export const updateOneStaffByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const findStaff = await CrudService.getOne({ exempt: '', Model: STAFFS }, { _id: id }, {});
    if (!findStaff || findStaff.success === false)
        throw new ApiError(httpStatus.NOT_FOUND, 'staff not found');
    const getUserId = findStaff.data.userId;
    const { body } = req;
    const v = Object.assign({}, body);
    const p = easyPick(v, [
        'firstName',
        'lastName',
        'password',
        'role',
        'email',
    ]);
    await userService.updateUserById(getUserId, p);
    const response = await CrudService.update({ exempt: '-userId', Model: STAFFS }, data, { _id: id });
    res.json(response);
});
export const updateOneStaffByUserIdController = catchAsync(async (req, res) => {
    const { user } = req;
    const data = req.body;
    const v = Object.assign({}, data);
    const p = easyPick(v, ['firstName', 'lastName', 'password', 'email']);
    await userService.updateUserById(user._id, p);
    const response = await CrudService.update({ exempt: '-userId', Model: STAFFS }, data, {
        userId: user._id,
    });
    res.json(response);
});
/**
 * Deactivate staff by user id
 * @param {Request} req
 * @param {Response} res
 * @returns {Response<number, Record<string, any>>}
 */
export const deactivateStaffByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = { isAuthenticated: false };
    const response = await CrudService.update({ exempt: '-userId', Model: STAFFS }, data, {
        _id: id,
    });
    res.status(httpStatus.OK).json(response);
});
export const staffLogin = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const findStaff = await CrudService.getOne({ exempt: '', Model: STAFFS }, { userId: user.id }, {});
    if (findStaff && !findStaff.data) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'not authorized');
    }
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
});
export const staffLogout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});
export const getStaffByBranchId = catchAsync(async (req, res) => {
    const { id } = req.params;
    const staff = await STAFFS.find({ branchId: id });
    return res.status(httpStatus.OK).json(staff);
});
//# sourceMappingURL=controller.staff.js.map