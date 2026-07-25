import { Request, Response } from "express"
import { type BrewProfile } from "../types/brew_data_types.js"
import { db } from "../db/db.js"
import { brewingProfileTable } from "../db/schema.js"


// GET
export const getBrewProfile = async (_req: Request, res: Response) => {
    try {
        const result = {message: "Success"}
        return res.status(201).json(result)
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        return res.status(500).json({err: "unable to GET"})
    }
}


// POST, create new profile
export const createBrewProfile = async (req: Request, res: Response) => {

    if (!req.brewProfile) {
        return res.status(500).json({message: "Server configuration error - no brewProfile at /new-brew-profile"})
    }

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userID at /new-brew-profile"})
    }

    const data: BrewProfile = req.brewProfile
    const userId = req.user.userId

    
    try {
        await db.insert(brewingProfileTable).values({
            name: data.profileName,
            bean: data.bean,
            machine_id: Number(data.machine),
            grinder_id: Number(data.grinder),
            user_id: userId,
            targetRatioType: data.targetRatioType,
            targetRatioMin: data.targetRatioMin,
            targetRatioMax: data.targetRatioMax,
            targetFlowMin: data.targetFlowMin,
            targetFlowMax: data.targetFlowMax
        })
        
        return res.status(200).json({message: `Successfully created new brew profile ${data.profileName}`})

    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        return res.status(500).json({error: "Server configuration error, unable to create brew profile"})
    }

}
