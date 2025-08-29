import { Router } from "express";
import blogController from "../controllers/blog.controller.js";
import { verifyToken } from "../middleware/verify-token.middleware.js";


const blogRouter = Router()


blogRouter.post('/create', verifyToken, blogController.createBlogPost)
blogRouter.get('/author', verifyToken, blogController.getBlogPostByAuthor)
blogRouter.get('/', verifyToken, blogController.getAllBlogs)
blogRouter.put('/update-post/:id', verifyToken, blogController.updateBlogPost)
blogRouter.get('/:id', verifyToken, blogController.getBlogPost)
blogRouter.delete('/delete-post/:id', verifyToken, blogController.deleteBlogPost)

export default blogRouter;
