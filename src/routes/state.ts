import express from "express";
import { getState } from "../controllers/state";

const router = express.Router();

router.get("/state", getState);

export default router;
