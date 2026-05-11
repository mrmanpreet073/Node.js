import {Router} from 'express'
import * as controller from "../controllers/owner.controller.js"


const router = Router()

router.get("/",controller.getOwners)
router.post("/create",controller.createOwner)
router.put("/:id",controller.updateOwner)
router.get("/:id",controller.getOwnerById)
router.delete("/:id",controller.deleteOwner)

export default router