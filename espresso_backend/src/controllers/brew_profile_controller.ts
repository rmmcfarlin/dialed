import { Request, Response } from "express"



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
    const { profileName } = req.body

    try {
        // const {profileName, bean, machine, grinder, targetRatioType } = req.body
        return res.status(200).json({message: `Successfully created new brew profile ${profileName}`})

    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        return res.status(500).json({error: "Server configuration error, unable to create brew profile"})
    }

}
