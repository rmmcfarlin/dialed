import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { drizzle } from 'drizzle-orm/node-postgres'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
