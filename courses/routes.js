import express from "express";
import {
  addCourse,
  getCourse,
  getCourses,
  removeCourse,
  updateCourse,
} from "./db.js";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    res.json(await getCourses());
  }
);

router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const course = await getCourse(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res
        .status(404)
        .json({ status: "404", message: "Sorry can't find that!" });
    }
  }
);

router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const course = req.body;
    const savedCourse = await addCourse(course);

    res.json(savedCourse);
  }
);

router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const course = await updateCourse(req.params.id, req.body);
    res.json(course);
  }
);

router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    await removeCourse(req.params.id);
    return res.json({ status: "ok" });
  }
);

export default router;
