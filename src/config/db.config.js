import mongoose from "mongoose";

export const connectDB = async () => {

    const connection_string = process.env.MONGO_URI 

    if(!connection_string){
        throw new Error(
            "Connection String is not Set"
        )
    }

    try {
        const conn = await mongoose.connect(connection_string)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}