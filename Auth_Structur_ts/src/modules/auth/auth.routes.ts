import {Router, type Request, type Response} from "express";

const router = Router();

router.post("/test", (req:Request, res:Response) => {
    res.json({ message: "Auth route is working!" });
});

export default router;