
const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.route('/admin-list').get(userController.getAllAdmins);
router.route('/admin-number').get(userController.countAdmins);
router.route('/user-number').get(userController.countUser);
router.route('/approver-number').get(userController.countApprover);
router.route('/post-number').get(userController.countPost);

// check if the user is super-admin [in middleware]
router.post('/register-admin', userController.createAdmin);
router.route('/External-list').get(userController.Getrequest);

// check if the user is admin [in middleware]
router.get('/:_id', userController.getAdminById);
router.put('/update/:id',userController.updateAdmin);
router.delete('/delete/:id', userController.deleteAdmin);
router.route('/accept/:name').post(userController.AcceptExternal);


module.exports = router;

