import { readFileSync, writeFileSync } from "fs";
import crypto from "crypto";

const data = JSON.parse(readFileSync("data/courses.json", "utf8"));

export const getCourses = () => {
  return data;
};

export const getCourse = (id) => {
  return data.find((course) => course.id === id);
};

export const updateCourses = (courses) => {
  writeFileSync("data/courses.json", JSON.stringify(courses, null, "\t"));
};

export const addCourse = (course) => {
  course = {
    id: crypto.randomUUID(),
    ...course,
  };
  data.push(course);
  updateCourses(data);
  return course;
};

export const updateCourse = (id, course) => {
  const courseIndex = data.findIndex((c) => c.id === id);
  data[courseIndex] = course;
  updateCourses(data);
  return data[courseIndex];
};

export const removeCourse = (id) => {
  const courseIndex = data.findIndex((c) => c.id === id);
  if (courseIndex > -1) {
    // only splice array when item is found
    data.splice(courseIndex, 1); // 2nd parameter means remove one item only
  }
  updateCourses(data);
};
