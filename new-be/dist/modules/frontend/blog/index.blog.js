import { createBlog, deleteBlog, getManyBlog, getOneBlog, updateBlog, } from "./main_blog/controller.blog";
class Blog {
    constructor() {
        this.create_blog = createBlog;
        this.get_one_blog = getOneBlog;
        this.get_all_blog = getManyBlog;
        this.update_blog = updateBlog;
        this.delete_blog = deleteBlog;
    }
}
export const BlogIndex = new Blog();
//# sourceMappingURL=index.blog.js.map