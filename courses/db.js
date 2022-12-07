import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: String,
  initDate: Date,
  enrolled: Number,
});

const Course = mongoose.model("course", courseSchema);
export const getCourses = async () => {
  return Course.find();
};

export const getCourse = async (id) => {
  return Course.findById(id);
};

export const addCourse = async (course) => {
  const c = new Course(course);
  await c.save();
  return course;
};

export const updateCourse = async (id, course) => {
  delete course._id;
  return Course.findByIdAndUpdate(id, course);
};

export const removeCourse = async (id) => {
  Course.deleteOne({ _id: id });
};
