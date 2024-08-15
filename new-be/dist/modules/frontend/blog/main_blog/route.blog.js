import { auth } from "../../../auth";
import { Router } from "express";
import { allPermissions } from "../../../setting/roles";
import { formFileHandler, MULTER_UPLOAD } from "../../../utils/file_handler/middleware.file";
import { BlogIndex } from "../index.blog";
const blogRouter = Router();
blogRouter
    .route('/')
    .post(auth(allPermissions.Subscription.Create), MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]), formFileHandler([{ name: 'image' }]), BlogIndex.create_blog)
    .get(BlogIndex.get_all_blog);
blogRouter
    .route("/:id")
    .get(BlogIndex.get_one_blog)
    .patch(auth(), BlogIndex.update_blog)
    .delete(auth(), BlogIndex.delete_blog);
export default blogRouter;
//# sourceMappingURL=route.blog.js.map