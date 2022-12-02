import { readFileSync, writeFileSync } from 'fs'
import { uuid } from '../cryptoUtil.js'

const COURSES_FILE = 'data/courses.json'
const data = JSON.parse(readFileSync(COURSES_FILE, "utf8"));

export const getCourses = () => {
  return data;
};

export const getCourse = (id) => {
  return data.find((course) => course.id === id);
};

export const updateCourses = (courses) => {
  writeFileSync(COURSES_FILE, JSON.stringify(courses, null, "\t"));
};

export const addCourse = (course) => {
  course = {
    id: uuid(),
    ...course,
  };
  data.push(course);
  updateCourses(data);
  return course;
};

export const updateCourse = (id, course) => {
  delete course.id
  const courseIndex = data.findIndex((c) => c.id === id)
  data[courseIndex] = { ...data[courseIndex], ...course }
  updateCourses(data)
  return data[courseIndex]
};

export const removeCourse = (id) => {
  const courseIndex = data.findIndex((c) => c.id === id);
  if (courseIndex > -1) {
    // only splice array when item is found
    data.splice(courseIndex, 1); // 2nd parameter means remove one item only
  }
  updateCourses(data);
};
