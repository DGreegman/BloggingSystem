import adminService from "../../services/admin/admin.service.js";

class AdminController {
    constructor() {
        this.adminService = adminService;
    }

    deletePost = async (req, res, next) => {
        const { blogId } = req.params;

        try {
            await this.adminService.deletePost(blogId);
            res.status(200).json({
                status: true,
                message: 'Blog post deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    banUser = async (req, res, next) =>{
        const { userId } = req.params;

        try {
            const updatedUser = await this.adminService.banUser(userId);
            console.log(updatedUser.banned, 'Banned User')

            res.status(201).json({
                status: true,
                message: 'User Banned Successfully...',
                data: updatedUser.banned
            })
        } catch (error) {
            next(error);
        }
    }

 

    unBanUser = async(req, res, next) =>{
        const {userId} = req.params;

        try {
            const updatedUser = await this.adminService.unBanUser(userId);
            console.log(updatedUser.banned, 'Unbanned User')

            res.status(201).json({
                status: true,
                message: 'User Unbanned Successfully...',
                data: updatedUser.banned
            })
        } catch (error) {
            next(error);
        }
    }
}

const adminController = new AdminController()
export default adminController;
            