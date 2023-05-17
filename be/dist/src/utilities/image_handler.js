"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpdateHandler = exports.imageUploadHandler = void 0;
/* eslint-disable no-case-declarations */
const sharp_1 = __importDefault(require("sharp"));
const dotenv = __importStar(require("dotenv"));
const node_buffer_1 = require("node:buffer");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const cloudinary_1 = require("cloudinary");
const image_handler_1 = require("./interface_utilities/image.handler");
const custom_error_1 = require("./custom_error");
const http_response_1 = require("./http_response");
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
class Image {
}
function imageUploadHandler(image_file) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const file_name = Math.random().toString(36).substring(2, 10) + "-" + Date.now();
        const file_to_convert = (_a = image_file.data) === null || _a === void 0 ? void 0 : _a.split(",")[1];
        const get_mime_type = image_file.data.split(",")[0];
        const file_extension = get_mime_type.split("/")[1];
        const buffer = node_buffer_1.Buffer.from(file_to_convert, "base64");
        const buffer_image = (0, sharp_1.default)(buffer)
            .resize((_b = image_file.width) !== null && _b !== void 0 ? _b : 500, (_c = image_file.height) !== null && _c !== void 0 ? _c : 500)
            .toBuffer();
        switch (image_file.storage_type) {
            case image_handler_1.StorageTypeE.CLOUDINARY:
                const result = yield cloudinary_1.v2.uploader
                    .upload_stream({ folder: image_file.image_folder }, (error, result) => {
                    if (error) {
                        throw (0, custom_error_1.APP_ERROR)(error, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
                    }
                    else
                        return { url: result.secure_url };
                })
                    .end(buffer_image);
                break;
            case image_handler_1.StorageTypeE.SIMPLE_STORAGE_BUCKET:
                aws_sdk_1.default.config.update({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                });
                const s3 = new aws_sdk_1.default.S3();
                const params = {
                    Bucket: "your-bucket-name",
                    Key: `${image_file.image_folder}/${file_name}`,
                    Body: buffer_image,
                    ACL: "public-read",
                };
                s3.upload(params, (err, data) => {
                    if (err) {
                        throw (0, custom_error_1.APP_ERROR)(err, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
                    }
                    return { url: data.location };
                    // res.json({ url: data.Location });
                });
                break;
            default:
                break;
        }
    });
}
exports.imageUploadHandler = imageUploadHandler;
function imageUpdateHandler(image_file) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.imageUpdateHandler = imageUpdateHandler;
const imageDeletehandler;
(id) => { };
