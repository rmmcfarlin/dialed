import { Router } from "express"
import { validateNewUser } from "../middleware/new_user_validation.js"
import { createUser, loginUser, refreshUser, logoutUser} from "../controllers/user_controller.js"

const router = Router()

// POST new user registration
router.post("/create-account", validateNewUser, createUser)

// POST user login
router.post("/login", loginUser)

// POST refresh
router.post("/refresh", refreshUser)

// POST logout
router.post("/logout", logoutUser)


export default router
