import express from "express";
import data from "../data/courses.json";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json(data);
});

export default router;
