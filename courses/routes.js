import express from "express";
import mongoose from "mongoose";
import {
  addCourse,
  getCourse,
  getCourses,
  removeCourse,
  updateCourse,
} from "./db.js";
import passport from "passport";
import { Course } from "./entities/course.js";

// import Debug from '../debugUtil.js'
// const debug = Debug('courses:*')

const router = express.Router();

router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const courses = (await getCourses()).map(c => new Course(c))
    res.json(courses);
  }
);

router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    const courseModel = await getCourse(id);
    // debug(`GET/:id -> id is ${req.params.id} - found is ${JSON.stringify(courseModel, null, 2)}`)
    const course = new Course(courseModel);

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
    const course = new Course(req.body);
    const savedCourse = await addCourse(course);
    const courseResponse = new Course(savedCourse);
    // debug(`POST response is ${JSON.stringify(courseResponse, null, 2)}`)
    res.json(courseResponse);
  }
);

router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const course = new Course(req.body);
    const courseModel = await updateCourse(req.params.id, course);
    res.json(new Course(courseModel));
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
