import { Router } from "express";
import adminController from "../../controllers/admin/admin.controller.js";
import { verifyToken } from "../../middleware/verify-token.middleware.js";
import adminAccess from "../../middleware/admin-access.middleware.js";

const adminRouter = Router();

adminRouter.delete('/delete-post/:blogId', verifyToken, adminAccess.checkAdmin, adminController.deletePost);
adminRouter.patch('/ban-user/:userId', verifyToken, adminAccess.checkAdmin, adminController.banUser);
adminRouter.patch('/unban-user/:userId', verifyToken, adminAccess.checkAdmin, adminController.unBanUser);

export default adminRouter;