import logger from '../../logger/logger';
import multer from 'multer';
import { generateAlphanumericReference, generateIdWithDate } from '../referenceGenerator';
import { FileHandler } from './files_handler';
const storage = multer.memoryStorage();
export const MULTER_UPLOAD = multer({ storage });
/**
 * The function takes in a string file, folder name, key, useEmailAndKey flag, and an optional user
 * object, and returns an image string.
 * @param {string} file - A string representing the file data. It should be in the format
 * "applicationType,base64String", where applicationType is the MIME type of the file and base64String
 * is the file data encoded in base64 format.
 * @param {string} folderName - The `folderName` parameter is a string that represents the name of the
 * folder where the file will be stored.
 * @param {string} key - The `key` parameter is a string that represents the field name of the file
 * being handled. It is used to identify the file in the file data object.
 * @param {boolean} useEmailAndKey - A boolean value indicating whether to use the email and key for
 * file storage.
 * @param {IUserDoc} [user] - The `user` parameter is an optional parameter of type `IUserDoc`. It
 * represents a user document and is used when `useEmailAndKey` is set to `true`.
 * @returns the result of the `fileName.imageHandler()` function, which is a promise that resolves to a
 * string.
 */
export async function stringFileHandler(file, folderName, key, useEmailAndKey, user) {
    const splitIncomingString = file.split(',');
    const stringToBuffer = splitIncomingString[1];
    const getApplicationType = splitIncomingString[0];
    const getExtensionName = getApplicationType.split('/')[1];
    const buffer = Buffer.from(stringToBuffer, 'base64');
    let d = '';
    if (useEmailAndKey && user)
        d = `${user.email.split('.')[0]}/${key}/`;
    const files = {
        fieldName: key,
        buffer,
        originalName: `${generateIdWithDate()}${generateAlphanumericReference(5)}.${getExtensionName}`,
        size: buffer.length,
        encoding: '7bit',
        mimetype: getApplicationType,
    };
    const fileData = {
        fileFolder: `${folderName}/${useEmailAndKey ? d : ''}`,
        fileData: files,
    };
    const fileName = new FileHandler(fileData);
    const getImageString = await fileName.imageHandler();
    return getImageString;
}
function keyz(field) {
    return field.map((x) => x.name);
}
/**
 * The `formFileHandler` function is a middleware function in TypeScript that handles file uploads in a
 * form, storing the files in a specified folder and updating the request body with the file
 * information.
 * @param {{ name: string }[]} field - An array of objects that contain the name of the fields in the
 * form that will be used to upload files.
 * @param {string} [folderName=paypaddy] - The `folderName` parameter is a string that specifies the
 * name of the folder where the uploaded files will be stored. If no folder name is provided, it
 * defaults to 'paypaddy'.
 * @param {boolean} [useEmailAndKey=false] - The `useEmailAndKey` parameter is a boolean flag that
 * determines whether to include the email and key in the file folder path. If `useEmailAndKey` is set
 * to `true`, the file folder path will include the email and key. If it is set to `false` or
 * @returns The function `formFileHandler` returns an async middleware function that takes in a
 * request, response, and next function as parameters.
 */
export const formFileHandler = (field, folderName = 'paypaddy', useEmailAndKey = false) => 
/* The code block is defining an async middleware function that handles file uploads in a form. It
takes in a request, response, and next function as parameters. */
async (request, _, next) => {
    const allKeys = keyz(field);
    if (!request.files)
        return next();
    if (request.files) {
        logger.info('formFileHandler');
        try {
            // 1) loop through the key values coming fom the fields
            const { body } = request;
            /* The code block you provided is an async function that handles file uploads for each key in
    
            the `field` array. */
            const fieldValues = field.map((x) => x.name);
            await Promise.all(allKeys.map(async (key) => {
                body[key] = '';
                const d = request.user && request.user.email ? `${request.user.email.split('@')[0]}/${key}/` : '';
                if (fieldValues.includes(key)) {
                    logger.info(`${key} is a file `);
                    if (Array.isArray(request.files)) {
                        await Promise.all(request.files.map(async (file) => {
                            const fileDat = {
                                fileData: {
                                    buffer: file.buffer,
                                    encoding: file.encoding,
                                    fieldName: file.fieldname,
                                    mimetype: file.mimetype,
                                    originalName: `${generateIdWithDate()}_${file.originalname}`,
                                    size: file.size,
                                },
                                fileFolder: `${folderName}/${useEmailAndKey ? d : ''}`,
                            };
                            const fileName = new FileHandler(fileDat);
                            const j = await fileName.imageHandler();
                            logger.info(j);
                            body[key] = j;
                        }));
                    }
                    else if (!Array.isArray(request.files) && Object.prototype.hasOwnProperty.call(request.files, key)) {
                        await Promise.all(request.files[key].map(async (file) => {
                            const fileDat = {
                                fileData: {
                                    buffer: file.buffer,
                                    encoding: file.encoding,
                                    fieldName: file.fieldname,
                                    mimetype: file.mimetype,
                                    originalName: `${generateIdWithDate()}_${file.originalname}`,
                                    size: file.size,
                                },
                                fileFolder: `${folderName}/${useEmailAndKey ? d : ''}`,
                            };
                            const fileName = new FileHandler(fileDat);
                            const j = await fileName.imageHandler();
                            logger.info(`j is ${j}`);
                            body[key] = j;
                        }));
                    }
                }
            }));
            next();
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=middleware.file.js.map