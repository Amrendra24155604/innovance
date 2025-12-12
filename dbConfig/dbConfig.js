
// export async function connect(){
//     try {
//         mongoose.connect(process.env.MONGO_URL)
//         const connection = mongoose.connection
//         connection.on('connected',()=>{
//             console.log("MONGO db connected");
//         })
//         connection.on("error",(err)=>{
//             console.log("Mongo db connection error, please make sure db is upto date and running "+err);
//             process.exit()
//         })
//     } catch (error) {
//         console.log("Something went wrong while connecting to database");
//         console.log(error);
        
        
//     }
// }
// import mongoose from "mongoose";
// dbConfig/dbConfig.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

export async function dbConnect() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI (or MONGO_URL) is not defined in env");
    }

    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.error(
        "MongoDB connection error, please make sure DB is running:",
        err
      );
    });
  } catch (error) {
    console.error("Something went wrong while connecting to database");
    console.error(error);
    throw error;
  }
}
