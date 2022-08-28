import mongoose from 'mongoose';

export interface IUser {
    username: String;
    password: String;
    roles: Array<String>;
    active: Boolean;
}

export interface IUserModel extends IUser, mongoose.Document {} // to get id and version

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: String,
            default: 'Employee',
        },
    ],
    active: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model<IUserModel>('User', userSchema);
