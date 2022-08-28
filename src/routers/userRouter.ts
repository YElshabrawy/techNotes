import express, { Request, Response } from 'express';
import { UserController, User } from '../controllers/usersConroller';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', async (req, res) => {
    try {
        const result = await userController.index();
        res.status(200).json(result);
        //@ts-ignore
    } catch (err: Error) {
        res.status(404).json({ message: err.message });
    }
});
userRouter.post('/', async (req, res) => {
    try {
        const u: User = {
            username: req.body.username,
            password: req.body.password,
            roles: req.body.roles,
            active: req.body.active,
        };

        const result = await userController.create(u);

        res.status(200).json(result);
        //@ts-ignore
    } catch (err: Error) {
        res.status(400).json({ message: err.message });
    }
});
// userRouter.patch();
// userRouter.delete();

export default userRouter;
