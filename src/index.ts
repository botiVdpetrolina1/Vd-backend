


import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import NFeRoute from './routes/NFeRoutes'

dotenv.config()


const URI_MONGO_DB = process.env.URI_MONGO_DB

const app = express()

const corsOptions = {
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Range"],
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())



app.use('/nfe', NFeRoute)

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

