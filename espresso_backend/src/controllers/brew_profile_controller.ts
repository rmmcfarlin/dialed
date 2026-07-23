import { Request, Response } from "express"
import { TargetRatioType, type BrewProfile } from "../types/brew_data_types.js"



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
    try {
        const {profileName, bean, machine, grinder, targetRatioType } = req.body


    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        return res.status(500).json({error: "Server configuration error, unable to create brew profile"})
    }

}
