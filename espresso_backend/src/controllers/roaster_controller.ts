import { Request, response, Response } from "express"
import { db } from "../db/db.js"
import { roasterTable } from "../db/schema.js"
import { eq, gt, lt, and, DrizzleQueryError, desc} from "drizzle-orm"

// GET single roaster
export const getRoaster = async (req: Request, res: Response) => {

    if (!req.user?.userId) {
       return res.status(500).json({message: "Server configuration error - no userId at get roaster"})
    }
    
    if (!req.query.roasterId) {
       return res.status(400).json({message: "Error - bad request, no roaster id provided"})
    }

    const userId = Number(req.user?.userId)
    const roasterId = Number(req.query.roasterId)

    try {

        const result = await db.select().from(roasterTable)
            .where(
                and(
                    eq(roasterTable.roasterId, roasterId), eq(roasterTable.userId, userId)
                )
            )

        if (result.length == 0) {
            return res.status(404).json({message: `Roaster ${roasterId}  not found`})
        } else {
            return res.status(200).json({data: result})
        }

    } catch (e) {
        if (e instanceof Error) console.error(e)
        return res.status(500).json({err: "unable to GET roaster ${roasterId}"})
    }
}


// GET all roasters
export const getAllRoasters = async (req: Request, res: Response) => {

    if (!req.user?.userId) {
       return res.status(500).json({message: "Server configuration error - no userId at get all roasters"})
    }

    const userId = req.user?.userId

    const cursor = req.query.cursor as string | undefined
    const limit = Number(req.query.limit)

    const conditions = [eq(roasterTable.userId, userId)]

    if (cursor) {
        conditions.push(lt(roasterTable.created_at, new Date(cursor)))
    }

    try {

        const result = await db.select().from(roasterTable)
            .where(
                and(
                    ...conditions
                )
            )
            .limit(limit)
            .orderBy(desc(roasterTable.created_at))

        if (result.length == 0) {
            return res.status(404).json({ message: `No roasters found for user ${userId}` })
        } else {
            return res.status(200).json({ data: result, cursor: result[result.length -1].created_at})
        }

    } catch (e) {
        if (e instanceof Error) console.error(e)
        return res.status(500).json({err: "unable to GET all roasters"})
    }
}

// POST, create new profile
export const createRoaster = async (req: Request, res: Response) => {

    if (!req.body.roasterName) {
        return res.status(400).json({message: "Bad Request - no roaster name provided"})
    }

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userId at POST -> new roaster"})
    }

    const roasterName = String(req.body.roasterName)
    const userId = Number(req.user.userId)
    
    try {
        const result = await db.insert(roasterTable)
            .values({
                userId: userId,
                roasterName: roasterName
            })
            .returning()
        
            return res.status(201).json({message: `Successfully created new roaster ${roasterName}`, data: result})
            
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
        return res.status(500).json({error: "Unable to create new roaster"})
    }
}

// PUT update roaster
export const updateRoaster = async (req: Request, res: Response) => {

    if (!req.body.roasterName) {
        return res.status(400).json({message: "Bad Request - no roaster name provided"})
    }

    if (!req.body.roasterId) {
        return res.status(400).json({message: "Bad Request - no roasterId provided"})
    }

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userId at POST -> new roaster"})
    }

    const roasterName = String(req.body.roasterName)
    const roasterId = Number(req.body.roasterId)
    const userId = Number(req.user.userId)

    try {
        const result = await db.update(roasterTable).set({
            roasterName: roasterName
        })
        .where(
            and(
                eq(roasterTable.roasterId, roasterId), 
                eq(roasterTable.userId, userId)
            )
        )
        .returning()

        return res.status(200).json({message: `Brew profile ${roasterId} updated successfully`, data: result})

    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            console.error(e)

            const error = e.cause as any

            if (error?.code == "23505") {
                return res.status(400).json({message: "Cannot insert duplicate value against unique constraint"})
            } else if (error?.code == "23503") {
                return res.status(400).json({message: "Resource not found, check roaster id"})
            } else if (error?.code == "23502") {
                return res.status(400).json({message: "One or more required values missing"})
            } 
        }
        return res.status(500).json({error: `Unable to update roaster ${roasterId}`})
    }
}

// DELETE
export const deleteRoaster = async (req: Request, res: Response) => {


    if (!req.query.roasterId) {
        return res.status(400).json({message: "Bad Request - no roasterId provided"})
    }

    if (!req.user?.userId) {
        return res.status(500).json({message: "Server configuration error - no userId at POST -> new roaster"})
    }

    const roasterId = Number(req.query.roasterId)
    const userId = Number(req.user.userId)

    try {
        await db.delete(roasterTable)
            .where(
                and(
                    eq(roasterTable.roasterId, roasterId),
                    eq(roasterTable.userId, userId)
                )
            )
        return res.status(200).json({message: `Roaster id ${roasterId} successfully deleted` })
    } catch (e) {
        if (e instanceof DrizzleQueryError) {
            console.error(e)

            const error = e.cause as any

            if (error?.code == "23503") {
                return res.status(400).json({message: 'Foreign key violation - unable to delete resource: roaster: id ${roasterId}' })
            }
        }
        return res.status(500).json({error: "Unable to delete roaster"})
    }
} 
