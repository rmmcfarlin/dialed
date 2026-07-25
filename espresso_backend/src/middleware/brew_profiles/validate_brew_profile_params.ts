import { digitStringSchema } from "./validate_new_brew_profile.js"
import { NextFunction, Request, Response } from "express"

export const validateNumericParam = (req: Request, res: Response, next: NextFunction) => {


    if (req.query.id) {
        const parsed = digitStringSchema.safeParse(req.query.id)

        if(!parsed.success) {
            return res.status(400).json({message: "Invalid value for id query param, must be numeric"})
        }
    }

    if (req.query.limit) {
        const parsed = digitStringSchema.safeParse(req.query.limit)

        if(!parsed.success) {
            return res.status(400).json({message: "Invalid value for limit param, must be numeric"})
        }
    }

    next()
}
