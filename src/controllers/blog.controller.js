import CustomError from "../errors/custom.error.js";
import blogService from "../services/blog.service.js";
import postValidationSchema from "../utils/blog.schema.js";

class BlogController{

    constructor(){
        this.blogService = blogService;

    }

    createBlogPost = async(req, res, next) => {
        try {
            const id = req.user._id; // Assuming user ID is stored in req.user
            const email = req.user.email; // Assuming user email is stored in req.user
            console.log('User email from token:', email);
            console.log(id)
            const {error, value} = postValidationSchema.validate(req.body, {
                abortEarly: false
            })
            if(error){
              const validationDetails = error.details.map(detail =>({
                    message: detail.message,
                    field: detail.path.join('.')
                }))

                throw new CustomError('Validation Error', 400, validationDetails)
            }

            const newPost = await this.blogService.createBlogPost(value.title, value.content, id, email);
            return res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }

    getBlogPost = async(req, res, next) => {
        try {
            const blogPost = await this.blogService.getBlogPost(req.params.id);
            return res.status(200).json(blogPost);
        } catch (error) {
            next(error);
        }
    }

    getBlogPostByAuthor = async(req, res, next)=>{
        try {
            const authorId = req.user._id; // Assuming user ID is stored in req.user
            const authorBlogPosts = await this.blogService.getAuthorBlogPost(authorId);
            const numberOfPosts = authorBlogPosts.length > 1 ? `You have created ${authorBlogPosts.length} blog posts` : `You have created ${authorBlogPosts.length} blog post`;
            return res.status(200).json({
                numberOfPosts,
                status: true,
                posts: authorBlogPosts

            });
        } catch (error) {
            next(error);
        }
    }

    getAllBlogs = async(req, res, next) =>{
        try {
            const blogs = await this.blogService.getAllBlogPosts();
            
            return res.status(200).json({
                numberOfPosts: blogs.length,
                status: true,
                data: blogs
            })
        } catch (error) {
            next(error);
        }
    }

    updateBlogPost = async(req, res, next) => {
        try {
            const blogId = req.params.id;
            const userId = req.user._id;
            const updatedPost = await this.blogService.updateBlogPost(blogId, userId, req.body);
            return res.status(200).json(updatedPost);
        } catch (error) {
            next(error);
        }
    }

    deleteBlogPost = async(req, res, next) =>{
        try {
            const blogId = req.params.id;
            const userId = req.user._id;
            await this.blogService.deleteBlogPost(blogId, userId);
            return res.status(204).json({
                status: true,
                message: 'Blog post deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}


const blogController = new BlogController();
export default blogController;