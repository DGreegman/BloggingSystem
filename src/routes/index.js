import { Router } from "express";
import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";
import adminRouter from "./admin/admin.route.js";

const router = Router()

router.use('/auth', userRouter)
router.use('/blogs', blogRouter)
router.use('/admin', adminRouter)


export default router;