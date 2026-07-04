import * as z from 'zod'
import { NextFunction, Request, Response } from 'express'

export const validateNewUser = (req: Request, res: Response, next: NextFunction) => {
        
    const passwordRegex: RegExp = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/

    const RegisterSchema = z.object({
        email: z.email(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string().min(8)
    })

    const data = req.body

    const result = RegisterSchema.safeParse(data)
    if (!result.success) {
        if (result.error instanceof z.ZodError) {
            return res.status(400).json({error: result.error.issues})
        } else {
            return res.status(400).json({error: "Invalid registration data"})
        }
    }
    if (!passwordRegex.test(result.data.password)) {
        return res.status(400).json({error: "Invalid password, must contain at least 8 characters, 1 number, and 1 special character."})
    }

    if (data.password !== data.passwordConfirmation) {
        return res.status(400).json({error: "Password and confirmation do not match."})
    }

    next()
}
