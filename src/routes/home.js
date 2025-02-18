import express from "express";
import homeController from "../app/controllers/SiteController.js";
import route from "./index.js";

const router = express.Router();

router.get("/", siteController.create);

export default router;
