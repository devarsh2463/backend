import mongoose from "mongoose";

const connectDb = async () => {
    try {

        const conn = await mongoose.connect(
            process.env.MONGODB_URI || ""
        );

        console.log(
            `MongoDB Connected: ${conn.connection.host}`
        );

    } catch (error) {

        console.log(
            "MongoDB Connection Error:",
            error.message
        );

        throw error;
    }
};

export default connectDb;