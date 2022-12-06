import express from "express";
import {
  addCourse,
  getCourse,
  getCourses,
  removeCourse,
  updateCourse,
} from "./db.js";
import passport from 'passport'
import sanitizer from 'sanitize'
import { Course } from './entities/course.js'

const router = express.Router();

router.get("/",
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json(getCourses());
  }
)

router.get("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = sanitizer.value(req.params.id, 'string');
  const data = getCourse(id);
  const course = new Course(data)
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ status: "404", message: "Sorry can't find that!" });
  }
});

router.post("/", passport.authenticate('bearer', { session: false }), (req, res) => {
  const course = new Course(req.body);
  const savedCourse = addCourse(course);

  res.json(savedCourse);
});

router.put("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = sanitizer.value(req.params.id, 'string');
  const course = new Course(req.body);
  const updatedCourse = new Course(updateCourse(id, course));
  res.json(updatedCourse);
});

router.delete("/:id", passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = sanitizer.value(req.params.id, 'string');
  removeCourse(id);
  return res.json({ status: "ok" });
});

export default router;
