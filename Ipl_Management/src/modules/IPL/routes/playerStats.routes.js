import { Router } from "express"
import * as playerStatsController from '../controllers/playerStats.controller.js'


const router = Router();

router.get("/", playerStatsController.getAllPlayerStats);
router.post("/create", playerStatsController.createPlayerStats)
router.get("/runs", playerStatsController.getHighestRunScorer)
router.get("/wickets", playerStatsController.getHighestWicketTaker)



export default router