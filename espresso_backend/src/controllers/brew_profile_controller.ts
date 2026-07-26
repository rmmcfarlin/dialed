import { Request, Response } from "express"
import { type BrewProfile } from "../types/brew_data_types.js"
import { db } from "../db/db.js"
import { brewingProfileTable } from "../db/schema.js"
import { eq, lt, and, DrizzleQueryError, desc} from "drizzle-orm"


// GET single profile
export const getBrewProfile = async (req: Request, res: Response) => {

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userID at /brew-profile get single profile"}) 
    }

    if (!req.query.id) {
        return res.status(400).json({message: "No brew profile ID incldued with request"})
    }

    const userId = Number(req.user.userId)
    const brewProfileId = Number(req.query.id)

    try {

        const result = await db.select().from(brewingProfileTable)
            .where(
                and(
                    eq(brewingProfileTable.brewProfileId, brewProfileId), eq(brewingProfileTable.user_id, userId)
                )
            )

        if (result.length == 0) {
            return res.status(404).json({message: `Brew profile: ${brewProfileId}  not found`})
        } else {
            return res.status(200).json({data: result})
        }

    } catch (e) {
        if (e instanceof Error) console.error(e)
        return res.status(500).json({err: "unable to GET"})
    }
}

// GET all profiles for a user
export const getAllBrewProfiles = async (req: Request, res: Response) => {

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userID at /all-brew-profiles get all profiles"}) 
    }

    if (!req.query.limit) {
        return res.status(400).json({message: "Pagination limit param missing"}) 
    }
    
    const userId = req.user.userId
    const cursor = req.query.cursor as string | undefined
    const limit = Number(req.query.limit) 

    const conditions = [eq(brewingProfileTable.user_id, userId)]

    if (cursor) {
        conditions.push(lt(brewingProfileTable.created_at, new Date(cursor)))
    }

    try {

        const result = await db.select().from(brewingProfileTable)
        .where(and(...conditions))
        .limit(limit)
        .orderBy(desc(brewingProfileTable.created_at))

        if (result.length == 0) {
            return res.status(404).json({message: `No brew profiles found for user`})
        } else {
            return res.status(200).json({data: result, cursor: result[limit - 1].created_at})
        }

    } catch (e) {
        if (e instanceof Error) console.error(e)
        return res.status(500).json({message: "Server configuration error, unable to get brew profiles"})
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
        
        return res.status(201).json({message: `Successfully created new brew profile ${data.profileName}`})

    } catch (e) {
       
        if (e instanceof DrizzleQueryError) {
            console.error(e)

            const error = e.cause as any

            if (error?.code == "23505") {
                return res.status(400).json({message: "Cannot insert duplicate value against unique constraint"})
            } else if (error?.code == "23503") {
                return res.status(400).json({message: "Resource not found, check machine id / grinder id"})
            } else if (error?.code == "23502") {
                return res.status(400).json({message: "One or more required values missing"})
            } 
        }
        return res.status(500).json({error: "Unable to create brew profile"})
    }

}

// PUT, update brew profile

export const updateBrewProfile = async (req: Request, res: Response) => {

    if (!req.brewProfileUpdate) {
        return res.status(500).json({message: "Server configuration error at update brew profile"})
    }

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userID at /new-brew-profile"})
    }

    try {
        await db.update(brewingProfileTable).set({
            targetRatioMin: req.brewProfileUpdate.targetRatioMin,
            targetRatioMax: req.brewProfileUpdate.targetRatioMax,
            targetFlowMin: req.brewProfileUpdate.targetFlowMin,
            targetFlowMax: req.brewProfileUpdate.targetFlowMax
        })
        .where(eq(brewingProfileTable.brewProfileId, Number(req.brewProfileUpdate.profileId)))

        return res.status(200).json({message: `Brew profile ${req.brewProfileUpdate.profileId} updated successfully`})
        
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            console.error(e)

            const error = e.cause as any

            if (error?.code == "23505") {
                return res.status(400).json({message: "Cannot insert duplicate value against unique constraint"})
            } else if (error?.code == "23503") {
                return res.status(400).json({message: "Resource not found, check brew profile id"})
            } else if (error?.code == "23502") {
                return res.status(400).json({message: "One or more required values missing"})
            } 
        }
        return res.status(500).json({error: "Unable to create brew profile"})
    }
}

// 23505: Unique Constraint Violation (e.g., trying to insert an existing email address).
// 23503: Foreign Key Violation (e.g., referencing a user ID that does not exist).
// 23502: Not-Null Violation (e.g., omitting a required field missing a default value).
// 23514: Check Constraint Violation (e.g., a value fails a custom database-level validation rule).
