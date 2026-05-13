import { Router } from "express";

const router = Router();

router.post("/register", (_req, res) => {
  res.json({ message: "ok" });
});

router.post("/login", (_req, res) => {
  res.json({ message: "ok" });
});

export default router;
