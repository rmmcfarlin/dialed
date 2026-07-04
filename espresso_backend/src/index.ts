import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { db } from './db/db.js'

import brewProfileRouter from './routes/brew_profiles.js'
import userRouter from './routes/users.js'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

app.use('/brews', brewProfileRouter)
app.use('/users', userRouter)

export const dbIsConnected = () => {
    try {
        db.execute("SELECT 1")
        console.log("Pgsql connected")
        return true
    } catch (error) {
        console.error("Pgsql database connection failed", error)
        process.exit(1)
    }
}


if (dbIsConnected()) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
