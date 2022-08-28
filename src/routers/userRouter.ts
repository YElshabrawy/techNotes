import express from 'express';
import { UserController } from '../controllers/usersController';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.index);
userRouter.get('/:id', userController.show);
userRouter.post('/', userController.create);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

export default userRouter;
