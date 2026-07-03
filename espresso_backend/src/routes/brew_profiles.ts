import { Router } from 'express'
import { getBrewProfile } from '../controllers/brew_profile_controller.js'

const router = Router()

// GET
router.get('/', getBrewProfile)


export default router
