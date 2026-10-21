import express from "express";

import uploadMiddleware from "../utils/uploadMiddleware.js";
import { uploadImage } from "../controller/userDataController.js";

import {
  sendTestEmail
} from "../controller/userDataController.js";

import {
    addUser,
    getUser,
    getSingleUser,
    deleteUser,
    updateUser,
    loginuser,
    getMyProfile,
   
} from "../controller/userDataController.js";

import authMiddleware from "../utils/authMiddleware.js";


const router = express.Router();



router.post(
  "/uploadImage",
  uploadMiddleware.single("image"),
  uploadImage
);


router.post("/login", loginuser);

router.post("/adduser", addUser);

router.get("/users", getUser);

router.get("/users/:uid", getSingleUser);

router.put("/users/:uid", updateUser);

router.delete("/users/:uid", deleteUser);

router.post("/send-test-email", sendTestEmail);


// JWT protected profile
router.get(
    "/me",
    authMiddleware,
    getMyProfile
);


export default router;