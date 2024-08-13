import 'dotenv/config';
import Joi from 'joi';
const envVarsSchema = Joi.object()
    .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
        .default(10)
        .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
        .default(10)
        .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    BINANCE_API_KEY: Joi.string().required().description('Binance API Key'),
    BINANCE_API_SECRET: Joi.string().required().description('Binance API Secret'),
    FLW_PUBLIC_KEY: Joi.string().required().description('Flutterwave API Key'),
    FLW_SECRET_KEY: Joi.string().required().description('Flutterwave API Secret'),
    CLOUDINARY_KEY: Joi.string().required().description('cloudinary API Key'),
    CLOUDINARY_SECRET: Joi.string().required().description('cloudinary API Secret'),
    ENCRYPT_PASSWORD: Joi.string().required().description('encrypt key'),
    ENCRYPT_SALT: Joi.string().required().description('encrypt salt'),
    FLW_SECRET_HASH: Joi.string().required().description('flutterwave secret hash'),
    BITPWR_PUBLIC_KEY: Joi.string().required().description('bitpwr public key'),
    BITPWR_SECRET_KEY: Joi.string().required().description('bitpwr secret key'),
    BITPWR_WEBHOOK_SECRET: Joi.string().required().description('bitpwr webhook secret'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        cookieOptions: {
            httpOnly: true,
            secure: envVars.NODE_ENV === 'production',
            signed: true,
        },
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            secure: true,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    clientUrl: envVars.CLIENT_URL,
    binanceAPI: {
        key: envVars.BINANCE_API_KEY,
        secret: envVars.BINANCE_API_SECRET,
    },
    flutterwaveAPI: {
        key: envVars.FLW_PUBLIC_KEY,
        secret: envVars.FLW_SECRET_KEY,
        hash: envVars.FLW_SECRET_HASH,
    },
    cloudinaryAPI: {
        key: envVars.CLOUDINARY_KEY,
        secret: envVars.CLOUDINARY_SECRET,
    },
    encrypt: {
        password: envVars.ENCRYPT_PASSWORD,
        salt: envVars.ENCRYPT_SALT,
    },
    bitpwr: {
        key: envVars.BITPWR_PUBLIC_KEY,
        secret: envVars.BITPWR_SECRET_KEY,
        webhookSecret: envVars.BITPWR_WEBHOOK_SECRET,
    },
};
export default config;
//# sourceMappingURL=config.js.map