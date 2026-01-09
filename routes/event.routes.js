const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const router = express.Router();
const eventController = require("../controller/event.controller");
const parser = require("../middleware/upload.middleware");

router.post(
  "/organizer/create",
  authMiddleware,
  roleMiddleware("ORGANIZER"),
  (req, res, next) => {
    parser.single("image")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).send("File upload error");
      }
      next();
    });
  },
  eventController.eventCreate
);
// ,parser.single("image")

module.exports = router;
