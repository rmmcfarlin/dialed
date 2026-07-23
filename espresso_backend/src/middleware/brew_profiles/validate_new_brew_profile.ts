import { Request, Response, NextFunction } from "express"
import { targetRatioTypeEnum } from "../../db/schema.js"
import * as z from "zod"
import { ZodError } from "zod"

export const validateNewBrewProfile = async (req: Request, res: Response, next: NextFunction) => {

    // Validate that the ratioType is a valid member of the type union / enum
    const RatioTypeEnum = z.enum(targetRatioTypeEnum.enumValues)
    const targetRatioType: string = req.body.targetRatioType

    try {
        RatioTypeEnum.parse(targetRatioType)
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({error: e.message, message: "Invalid target ratio type"})
        } else {
            return res.status(400).json({message: "Invalid target ratio type"})
        }
    }
    
}   
