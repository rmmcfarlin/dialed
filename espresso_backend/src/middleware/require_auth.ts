import { NextFunction, Request, Response } from 'express'
import { type jwtPayload } from '../types/auth_types.js'
import jsonwebtoken from 'jsonwebtoken'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {

    try {
        
        let authHeader

        if (req.headers.authorization) {
            authHeader = req.headers.authorization
        } else {
            return res.status(401).json({error: "No authorization header attribute included"})
        }

        const token = authHeader.split(" ")[1]

        if (!token) return res.status(401).json({ error: "No token provided"})
    
        if (process.env.JWT_ACCESS_SECRET) {
            const decoded: jwtPayload = jsonwebtoken.verify(token, process.env.JWT_ACCESS_SECRET) as jwtPayload
            req.user = {userId: decoded.userId}
        } else {
            return res.status(500).json({error: "Internal server error - misconfiguration"})
        }

        next()
   } catch {
        return res.status(403).json({error: "Invalid or expired token"})
   }
}
