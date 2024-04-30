import { Router } from "express";
import userHandlers from '../controllers/userHandler';
import accessMiddleware from '../middleware/accessMiddleware'

const userRouter = Router()

userRouter.post('/create', userHandlers.createUser)
userRouter.post('/recover', userHandlers.recoverypass);
userRouter.get('/confirmEmail/:token', userHandlers.mailValidation);
userRouter.post('/change', accessMiddleware.accessValidation, userHandlers.changePass );
userRouter.delete('/delete/:id', accessMiddleware.adminValidation, userHandlers.deleteUser);
userRouter.post('/login', userHandlers.loginUser);
userRouter.put('/update', accessMiddleware.accessValidation, userHandlers.updateUser);
userRouter.post('/createAdmin', accessMiddleware.adminValidation, userHandlers.createAdmin);
userRouter.post('/logout', userHandlers.logout);
userRouter.get('/all', accessMiddleware.adminValidation, userHandlers.getAllUsers)
export default userRouter;