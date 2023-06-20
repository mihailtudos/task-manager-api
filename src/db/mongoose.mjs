import mongoose from 'mongoose';
await mongoose.connect(process.env.DATABASE_URL); 

export default mongoose;
