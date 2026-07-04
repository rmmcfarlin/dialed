import { Request, Response } from "express"
import { eq } from 'drizzle-orm';
import { type NewUser } from "../types/user_types.js"
import { usersTable } from "../db/schema.js"
import { db } from "../db/db.js"
import bcrypt from "bcrypt"

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

// POST, login 
export const userLogin = async (req: Request, res: Response) => {

    const {email, password} = req.body
    let userDbData

    try {
        userDbData = db
        .select({id: usersTable.userId, firstname: usersTable.firstName, lastName: usersTable.lastName, password: usersTable.password})
        .from(usersTable)
        .where(eq(usersTable.email, email))

    } catch (err) {
        return res.status(404).json({error: "User email not found", err})
    }

    

}

// PUT

// DELETE
