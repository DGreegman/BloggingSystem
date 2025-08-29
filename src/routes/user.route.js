import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post('/register', userController.createUser)
userRouter.post('/login', userController.loginUser)
userRouter.delete('/delete-account', userController.deleteAccount)
userRouter.post('/activate-account', userController.activateAccount)
userRouter.post('/resend-otp', userController.resendOtp)



export default userRouter;