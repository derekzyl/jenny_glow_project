import { Request, Response, Router } from 'express';

const router: Router = Router();

/* The `(_req: Request, res: Response) => { ... }` is a callback function that is executed when a GET
request is made to the root route ("/") of the router. */
router.get('/', (_req: Request, res: Response) => {
  res.send({
    message: 'JennyGlow backend [Restful API]',
  });
});

export default router;
