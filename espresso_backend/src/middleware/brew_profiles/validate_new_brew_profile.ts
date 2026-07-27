import { Request, Response, NextFunction } from "express"
import { targetRatioTypeEnum } from "../../db/schema.js"
import * as z from "zod"

// schema for string of digits only for IDs
export const digitStringSchema = z.string().regex(/^\d+$/, {
        message: "String must contain only digits",
    });

const RatioTypeEnum = z.enum(targetRatioTypeEnum.enumValues)

const BrewProfileSchema = z.object({
    profileName: z.string().min(1, {message: "Profile name must be at least 1 character"}).max(99, {message: "Profile name must be less than 100 characters"}),
    beanId: z.number(),
    machineId: z.number(),
    grinderId: z.number(),
    targetRatioType: RatioTypeEnum, 
    targetRatioMin: z.number().gt(0, {message: "Target Ratio min must be greater than 0"}).lte(9.9, {message: "Target ratio min must be at most 9.9"}),
    targetRatioMax: z.number().gt(0, {message: "Target Ratio max must be greater than 0"}).lte(10, {message: "Target ratio max must at most 10"}), 
    targetFlowMin: z.number().gt(0, {message: "Target flow min must be greater than 0 g/s"}).lte(4.9, {message: "Target flow min must at most 4.9 g/s"}),
    targetFlowMax: z.number().gt(0, {message: "Target flow max must be greater than 0 g/s"}).lte(5, {message: "Target flow max must at most 5 g/s"})
})
.refine((data) => data.targetRatioMin < data.targetRatioMax, {
    message: "Target ratio min must be less than target ratio max"
})
.refine((data) => data.targetFlowMin < data.targetFlowMax, {
    message: "Target flow min must be less than target flow max"
})

export const validateNewBrewProfile = async (req: Request, res: Response, next: NextFunction) => {


    const parsed =  BrewProfileSchema.safeParse(req.body)

    if (!parsed.success) {
        const flattened = z.flattenError(parsed.error)
        return res.status(400).json({message: flattened})
    } else {
        const validProfile = parsed.data
        req.brewProfile = validProfile
    }
    next()
}   
