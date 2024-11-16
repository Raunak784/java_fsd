import express from 'express';
const app = express();

// Middleware to parse json request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
import userRouter from './routes/userRoutes.js'

app.use('/users', userRouter);



export {app}