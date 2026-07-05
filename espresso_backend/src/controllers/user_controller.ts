import { Request, Response } from "express"
import { eq } from 'drizzle-orm';
import { usersTable } from "../db/schema.js"
import { db } from "../db/db.js"
import { type User } from "../types/user_types.js";
import bcrypt from "bcrypt"
import jsonwebtoken from 'jsonwebtoken'
import { type NewUser } from "../types/user_types.js"



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

    let userData

    try {
        const response = await db.insert(usersTable).values(newUser).returning()
        userData = response[0]
    } catch (err) {
        return res.status(500).json({error: "Unable to create new user in pgsql database"})
    }

    let accessToken
    let refreshToken

    if (process.env.JWT_ACCESS_SECRET) {

        accessToken = jsonwebtoken.sign(
            { userId: userData.userId}, 
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15min" }
        )

        } else {
            throw new Error ("no JWT access secret")
        }
        if (process.env.JWT_REFRESH_SECRET) {

            refreshToken = jsonwebtoken.sign(
                { userId: userData.userId}, 
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" }
            )

        } else {
            throw new Error ("No JWT refresh secret")
        }

    return res
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: "/users/refresh",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        .status(200)
        .json({ 
            accessToken, 
            firstName: userData.firstName,
            lastName: userData.lastName,
            message: "User registered successfully"
    })
}


// POST, login 
export const loginUser = async (req: Request, res: Response) => {

    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email / password"})
    }

    let userData: User


    const queryRes = await db
    .select({userId: usersTable.userId, firstName: usersTable.firstName, lastName: usersTable.lastName, password: usersTable.password})
    .from(usersTable)
    .where(eq(usersTable.email, email))

    if (queryRes.length == 0) {
        return res.status(404).json({error: "User email not found"})
    }

    userData = queryRes[0]
    
    let refreshToken
    let accessToken

    if (await bcrypt.compare(password, userData.password)) {

        if (process.env.JWT_ACCESS_SECRET) {

            accessToken = jsonwebtoken.sign(
                { userId: userData.userId}, 
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: "15min" }
            )

        } else {
            throw new Error ("no JWT access secret")
        }
        if (process.env.JWT_REFRESH_SECRET) {

            refreshToken = jsonwebtoken.sign(
                { userId: userData.userId}, 
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" }
            )

        } else {
            throw new Error ("No JWT refresh secret")
        }
    } else {
        return res.status(400).json({message: "Incorrect Password"})
    }

    return res
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: "/users/refresh",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        .status(200)
        .json({ 
            accessToken, 
            firstName: userData.firstName,
            lastName: userData.lastName,
            message: "Login successful"
    })
}

// POST, refresh 
// DELETE
