import express, { Request, Response } from "express";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

router.get("/", checkAdmin, (req: Request, res: Response) => {
    (req.sessionStore as any).all((err: any, sessions: any) => {
        if (err) {
            console.log(err);
            return res.redirect("/dashboard");
        }
        res.render("admin", {
            user: req.user,
            sessions: sessions,
        });
    });
});

router.get("/revoke/:sessionId", checkAdmin, (req: Request, res: Response) => {
    const sessionId = req.params.sessionId;

    req.sessionStore.destroy(sessionId, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/admin");
    })
})

export default router;