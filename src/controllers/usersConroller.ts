import User from '../models/User';
import Note from '../models/Note';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

export type User = {
    username: String;
    password: String;
    roles: Array<String>;
    active: Boolean;
};

export class UserController {
    async index() {
        try {
            const users = await User.find().select('-password').lean();
            return users;
        } catch (err) {
            throw new Error(`Could not find users. Error: ${err}`);
        }
    }

    async create(u: User) {
        try {
            const { username, password, roles, active } = u;
            // confirm data
            if (
                !username ||
                !password ||
                !Array.isArray(roles) ||
                !roles.length
            ) {
                throw new Error('All fields are required');
            }

            // Duplicates
            const duplicate = await User.findOne({ username }).lean().exec();
            if (duplicate) {
                throw new Error('Duplicate Username');
            }

            // Hash pw
            //@ts-ignore
            const hashedPw = await bcrypt.hash(password, 10);

            // Create
            const userObject = { username, password: hashedPw, roles };
            const user = await User.create(userObject);
            if (user) {
                return user;
            } else {
                return;
            }
        } catch (err) {
            throw new Error(`Could not create user. ${err}`);
        }
    }

    async update() {}

    async delete() {}
}
