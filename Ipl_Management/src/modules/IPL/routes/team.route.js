import { Router } from "express"
import * as controllerTeam from '../controllers/team.controller.js'


const router = Router();

router.post("/create", controllerTeam.createTeam)


export default router