const express = require('express');
const authJwt = require('../middlewares/authJwt')
const studentConroller = require('../controllers/student.controller');
const router = express.Router();


router.get("/profiles", studentConroller.getUserProfile)
router.post("/:name/add-profile", studentConroller.createClientProfile);
router.put('/updateProfile/:id', studentConroller.updateProfile);
//router.get('/student-list', studentConroller.getUserProfile);
router.get('/student/:_id', studentConroller.showUserProfile);
router.get('/post', [authJwt.verifyToken], studentConroller.countPost);
router.route('/follow').put(studentConroller.addFollowing);
module.exports = router;