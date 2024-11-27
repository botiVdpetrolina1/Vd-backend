


import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import NFeRoute from './routes/NFeRoutes'
import SupervisorRoute from './routes/SupervisorRoutes'
import TransferRoute from './routes/TransferRoute'
import UserRoute from './routes/UserRoute'

import { PrismaClient } from '@prisma/client';

dotenv.config()


const URI_MONGO_DB = process.env.URI_MONGO_DB

const app = express()

export const prisma = new PrismaClient()

const corsOptions = {
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Range"],
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())



app.use('/nfe', NFeRoute)
app.use('/user', UserRoute)
app.use('/supervisor', SupervisorRoute)
app.use('/transfer', TransferRoute)

app.get('/', (req, res) => {
    res.send("It's Work")
})

mongoose.connect(URI_MONGO_DB as string)
.then(() => {
    console.log("connected database")
})
.catch((err) => {
    console.log(err)
})


app.listen(3000, () => console.log('Server started'))

