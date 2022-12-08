import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  initDate: Date,
  enrolled: Number,
});

const Course = mongoose.model("course", courseSchema);
export const getCourses = async () => {
  return Course.find();
};

export const getCourse = async (_id) => {
  return Course.findById(_id).exec();
};

export const addCourse = async (course) => {
  const c = new Course({ ...course, _id: new mongoose.Types.ObjectId() });
  await c.save();
  return c;
};

export const updateCourse = async (id, course) => {
  delete course._id;
  return Course.findByIdAndUpdate(id, course, { new: true });
};

export const removeCourse = async (id) => {
  Course.deleteOne({ _id: id });
};
