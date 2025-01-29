import express from "express"

// middlewares
import { verifyJWT } from "../../../middlewares/index.js"

import {
    getAllCourse,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLecture
} from "../controllers/course.js"

const router = express.Router()

router.get("/all-courses", verifyJWT, getAllCourse);
router.get("/lectures/:id", verifyJWT, getLecturesByCourseId);

router.post("/create-course", verifyJWT, createCourse);
router.post("/update-course/:id", verifyJWT, updateCourse);
router.post("/delete-course/:id", verifyJWT, removeCourse);

router.post("/add-lecture/:id", verifyJWT, addLectureToCourseById);
router.post("/remove-lecture/:courseId/:lectureId", verifyJWT, removeLecture);

export default router