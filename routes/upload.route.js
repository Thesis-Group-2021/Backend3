const express = require('express');
const uploadController = require('../controllers/upload.controller');
const router = express.Router();


router.route('/:name/upload').post(uploadController.UploadFile);
router.route("/:postname/approve").post(uploadController.ApprovePost);
// approver should fetch this
router.route("/upload-list").get(uploadController.uploadList);
// user should fetch this
router.route("/post-list").get(uploadController.postList);
router.route("/like").put(uploadController.LikePost);
router.route("/unlike").post(uploadController.UnlikePost);

module.exports = router;
