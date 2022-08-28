import { Response, Request } from 'express';
import User from '../models/User';
import Note from '../models/Note';
import bcrypt from 'bcrypt';

// Bcrypt
const pepper: string = String(process.env.BCRYPT_PW);
const saltRounds = parseInt(String(process.env.BCRYPT_ROUNDS));

// Helper functions
const isValidID = (id: String) => {
    return id.match(/^[0-9a-fA-F]{24}$/);
};

export class UserController {
    async index(req: Request, res: Response) {
        try {
            const users = await User.find().select('-password').lean();
            return users?.length
                ? res.status(200).json(users)
                : res.status(400).json({ message: 'No users found' });
        } catch (err) {
            res.status(400).json({
                message: 'Cannot return users',
                error: err,
            });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select('-password').lean();
            return user
                ? res.status(200).json(user)
                : res.status(400).json({ message: 'No users found' });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                message: 'Cannot return user',
                error: err?.message,
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { username, password, roles } = req.body;

            // Validate
            if (
                !username ||
                !password ||
                !Array.isArray(roles) ||
                !roles.length
            ) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required' });
            }

            // Duplicates
            const duplicate = await User.findOne({ username }).lean().exec();
            if (duplicate) {
                return res.status(409).json({ message: 'Duplicate User' });
            }

            const hashedPassword = bcrypt.hashSync(
                password + pepper,
                saltRounds
            );

            const user = new User({
                username,
                password: hashedPassword,
                roles,
            });
            const result = await User.create(user);

            return result
                ? res.status(201).json({
                      message: `Created user ${username} successfully`,
                      data: result,
                  })
                : res.status(400).json({ message: 'Invalid user data' });
        } catch (err) {
            res.status(400).json({
                message: 'Cannot create user',
                error: err,
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { username, password, roles, active } = req.body;

            // Validate id
            if (!isValidID(id))
                return res.status(400).json({ message: 'Invalid ID' });

            // Does user exist?
            const userExist = await User.exists({ _id: id }).lean().exec();
            if (!userExist)
                return res.status(404).json({ message: 'User not found' });

            // Check duplicates
            const duplicate = await User.findOne({ username }).lean().exec();
            if (duplicate && duplicate?._id.toString() !== id) {
                return res.status(409).json({ message: 'Duplicate User' });
            }

            // Validate array
            if (!Array.isArray(roles) || !roles.length) {
                return res
                    .status(400)
                    .json({ message: 'roles should be an array of strings' });
            }

            // Validate active
            if (typeof active !== 'boolean')
                return res
                    .status(400)
                    .json({ message: 'active should be a boolean value' });

            // Check if the password is the same
            const oldPassword = await User.findById(id)
                .select('password')
                .lean()
                .exec();

            const duplicatePassword = bcrypt.compareSync(
                password + pepper,
                String(oldPassword?.password)
            );

            let hashedPassword;
            if (duplicatePassword) hashedPassword = oldPassword?.password;
            else
                hashedPassword = bcrypt.hashSync(password + pepper, saltRounds);

            const updates = {
                username,
                password: hashedPassword,
                roles,
                active,
            };

            const result = await User.findByIdAndUpdate(id, updates, {
                new: true,
            });
            res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Validate id
            if (!isValidID(id))
                return res.status(400).json({ message: 'Invalid ID' });

            // Does user exist?
            const userExist = await User.exists({ _id: id }).lean().exec();
            if (!userExist)
                return res.status(404).json({ message: 'User not found' });

            const notes = await Note.findOne({ user: id }).lean().exec();
            //@ts-ignore
            if (notes?.length)
                return res
                    .status(400)
                    .json({ message: 'User has notes, delete notes first' });

            const user = await User.findById(id).exec();
            const result = await user?.deleteOne();

            return res.status(200).json({
                message: `Username ${result.username} with ID ${result._id} is deleted`,
            });
        } catch (error) {
            const err = error as Error;
        }
    }
}
