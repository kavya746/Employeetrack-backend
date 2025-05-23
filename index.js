import express from 'express'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js';

import userRoutes from './routes/auth_pass.js' //password

import connectToDatabase from './db/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectToDatabase()
const app=express()
app.use(cors({
    origin : "https://employeetrack-frontend-ten.vercel.app",
    credentials: true
}))
app.use(express.json())
app.use('/api/auth', authRouter)

app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); 

app.use('/api/user', userRoutes) //password

app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(process.env.PORT, () =>{
    console.log(`server is running on port ${process.env.PORT}`)
})
