import { Request, Response } from "express"
import { type NewUser } from "../types/user_types.js"
import { usersTable } from "../db/schema.js"
import { db } from "../db/db.js"
import bcrypt from "bcrypt"

// GET
export const getUser = async (req: Request, res: Response) => {

    try {
        const result = {message: "Success: /users"}
        return res.status(201).json(result)
    } catch {
        return res.status(500).json({err: "unable to GET"})
    }
}


// POST, create user
export const createUser = async (req: Request, res: Response) => {

    const data = req.body

    const hashedPw = await bcrypt.hash(data.password, 10)

    const newUser: NewUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPw
    }

    try {
        await db.insert(usersTable).values(newUser)
    } catch (err) {
        return res.status(500).json({error: "Unable to create new user in pgsql database"})
    }

    return res.status(200).json({message: "User registered successfuly"})
}

// PUT

// DELETE
