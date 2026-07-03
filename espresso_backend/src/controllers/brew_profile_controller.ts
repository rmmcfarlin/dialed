import { Request, Response } from "express"



export const getBrewProfile = async (req: Request, res: Response) => {


    try {
        const result = {message: "Success"}
        return res.status(201).json(result)
    } catch {
        return res.status(500).json({err: "unable to GET"})
    }
}
