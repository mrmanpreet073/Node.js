import { Router } from "express"
import * as controllerPlayer from '../controllers/player.controller.js'


const router = Router();

router.get("/", controllerPlayer.getPlayers);
router.post("/create", controllerPlayer.createPlayer)
router.post("/:id", controllerPlayer.updatePLayerRole)
router.post("/transfer/:id", controllerPlayer.transferPlayer)
router.delete("/:id", controllerPlayer.deletePlayer)


export default router