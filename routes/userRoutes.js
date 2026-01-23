const express = require("express");
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getMe,
  sendCode,
  newPassword,
  confirmCode,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");  
const { uploadUserFile } = require("../Utils/Uploader");


router.post("/register", uploadUserFile, registerUser);
router.post("/login", loginUser);
router.post("/sendCode", sendCode);
router.post("/newPassword", newPassword);
router.post("/confirmCode", confirmCode);


router.get("/me", protect, getMe);
router.put("/:id", protect, uploadUserFile, updateUser);


router.get("/", protect, admin, getUsers); 

router.delete("/:id", protect, admin, deleteUser);

module.exports = router;


























// const express = require("express");
// const router = express.Router();
// const {
//   getUsers,
//   registerUser,
//   loginUser,
//   updateUser,
//   deleteUser,
//   getMe,
//   sendCode,
//   newPassword,
//   confirmCode,
// } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");
// const { uploadUserFile } = require("../Utils/Uploader");

// // Public Routes
// router.post("/", uploadUserFile, registerUser);
// router.post("/login", loginUser);
// router.post("/sendCode", sendCode);
// router.post("/newPassword", newPassword);
// router.post("/confirmCode", confirmCode);

// // Protected Routes
// router.get("/", protect, getUsers);
// router.get("/me", protect, getMe);
// router.put("/:id", uploadUserFile, protect, updateUser);
// router.delete("/:id", protect, deleteUser);

// module.exports = router;
