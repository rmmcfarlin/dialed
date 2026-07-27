import { Router } from 'express'
import { requireAuth } from '../middleware/require_auth.js'
import { getBrewProfile, createBrewProfile, getAllBrewProfiles, updateBrewProfile, deleteBrewProfile } from '../controllers/brew_profile_controller.js'
import { validateNewBrewProfile } from '../middleware/brew_profiles/validate_new_brew_profile.js'
import { validateNumericParam } from '../middleware/brew_profiles/validate_brew_profile_params.js'
import { validateBrewProfileUpdateData } from '../middleware/brew_profiles/validate_brew_profile_update_data.js'

const router = Router()

// GET
router.get('/', requireAuth, validateNumericParam, getBrewProfile)

// GET all
router.get('/all', requireAuth, validateNumericParam, getAllBrewProfiles)

// POST, create new brew profile
router.post('/create', requireAuth, validateNewBrewProfile, createBrewProfile)

// PUT, update existing profile
router.put('/update', requireAuth, validateBrewProfileUpdateData, updateBrewProfile)

// DELETE
router.delete('/delete', requireAuth, deleteBrewProfile)


export default router
