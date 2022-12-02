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

router.get("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  // TODO: Validar el input
  const course = getCourse(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ status: "404", message: "Sorry can't find that!" });
  }
});

router.post("/", passport.authenticate('bearer', { session: false }), (req, res) => {
  const course = req.body;
  // TODO: Validar el input
  const savedCourse = addCourse(course);

  res.json(savedCourse);
});

router.put("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  // TODO: Validar el input
  // TODO: validar no se puede cambiar el id del curso
  const course = updateCourse(req.params.id, req.body);
  res.json(course);
});

router.delete("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  // TODO: Validar el input
  removeCourse(req.params.id);
  return res.json({ status: "ok" });
});

export default router;
