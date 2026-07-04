import { Router } from "express"
import { validateNewUser } from "../middleware/new_user_validation.js"
import { createUser, getUser } from "../controllers/user_controller.js"

const router = Router()

// GET
router.get("/", getUser)

// POST
router.post("/", validateNewUser, createUser)

export default router
