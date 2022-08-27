import mongoose from 'mongoose';

export default async () => {
    try {
        await mongoose.connect(String(process.env.DATABASE_URI));
    } catch (err) {
        console.log(err);
    }
};
