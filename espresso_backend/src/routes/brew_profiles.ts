import { Router } from 'express'
import { getBrewProfile, createBrewProfile } from '../controllers/brew_profile_controller.js'
import { validateNewBrewProfile } from '../middleware/brew_profiles/validate_new_brew_profile.js'

const router = Router()

// GET
router.get('/', getBrewProfile)

// POST, create new brew profile
router.post('/new-brew-profile', validateNewBrewProfile, createBrewProfile)

export default router
