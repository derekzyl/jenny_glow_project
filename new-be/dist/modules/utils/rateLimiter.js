import { logger } from '../logger';
import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    handler: (_req, res) => {
        res.status(429).json({
            message: 'Too many requests from this IP, please try again after 15 minutes',
        });
    },
    onLimitReached: (req) => {
        // Log the rate limit exceeded event
        logger.info(`Rate limit exceeded for ${req.ip}`);
    },
    // Return rate limit info in the `RateLimit-*` headers
});
export default authLimiter;
//# sourceMappingURL=rateLimiter.js.map