import express from "express";
import {
  addCourse,
  getCourse,
  getCourses,
  removeCourse,
  updateCourse,
} from "./db.js";
import passport from 'passport'

const router = express.Router();

router.get("/",
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json(getCourses());
  }
)

router.get("/:id", (req, res) => {
  // TODO: Validar el input
  const course = getCourse(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404).send("Sorry can't find that!");
  }
});

router.post("/", (req, res) => {
  const course = req.body;
  // TODO: Validar el input
  const savedCourse = addCourse(course);

  res.json(savedCourse);
});

router.put("/:id", (req, res) => {
  // TODO: Validar el input
  const course = updateCourse(req.params.id, req.body);
  res.json(course);
});

router.delete("/:id", (req, res) => {
  // TODO: Validar el input
  removeCourse(req.params.id);
  return res.json({ status: "ok" });
});

export default router;
