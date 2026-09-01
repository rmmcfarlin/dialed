import { Router } from "express";
import { getRoaster, getAllRoasters, createRoaster, updateRoaster, deleteRoaster } from "../controllers/roaster_controller.js";
import { validateNumericParam } from '../middleware/brew_profiles/validate_brew_profile_params.js'
import { requireAuth } from "../middleware/require_auth.js";

const router = Router()

// GET single roaster
router.get('/', requireAuth, validateNumericParam, getRoaster)

// GET all roasters
router.get('/all', requireAuth, getAllRoasters)

// POST new roaster
router.post('/create', requireAuth, createRoaster)

// PUT update roaster
router.put('/update', requireAuth, updateRoaster)

// DELETE
router.delete('/delete', requireAuth, deleteRoaster)

export default router

