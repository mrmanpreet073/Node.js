import { Router } from "express"
import * as controllerTS from '../controllers/teamSponser.controller.js'


const router = Router();

router.post("/attach", controllerTS.attachSponser)
router.post("/", controllerTS.getTs)


export default router