import { Router } from 'express';
const router = Router();
/* The `(_req: Request, res: Response) => { ... }` is a callback function that is executed when a GET
request is made to the root route ("/") of the router. */
router.get('/', (_req, res) => {
    res.send({
        message: 'JennyGlow backend [Restful API]',
    });
});
export default router;
//# sourceMappingURL=dev.route.v1.js.map