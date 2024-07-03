import express from "express";
import { scrapeAlmanea, scrapeExtra, scrapeXcite, scrapeAbdulwahed } from "../controllers/scraperController.js";

const router = express.Router();

router.post('/almanea', scrapeAlmanea);
router.post('/extra', scrapeExtra);
router.post('/xcite', scrapeXcite);
router.post('/abdulwahed', scrapeAbdulwahed);

export default router;