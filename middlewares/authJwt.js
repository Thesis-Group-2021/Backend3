const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const { SECRET } = require("../config");


exports.verifyToken = async (req, res, next) => {
   let token = req.headers['x-access-token'];
   if (!token) {
      return res.status(404).json({
         status: "fail",
         message: "No token provided"
      })  
   }
   await jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
         res.json({
            message: "Invalid Signature"
         })
      }
      req.userId = decoded.user_id;
      console.log(req.userId);
      next();
   })
}

exports.checkIfUserIsAdmin = async (req, res, next) => {
   const user = await User.findOne({_id: req.userId})
   if (!user) {
      return res.status(404).json({
         status: 'fail',
         message: "User Not Found"
      })
   }

   if (user.role === 'admin') {
      next();
      return;
   }

   return res.status(403).json({
      status: 'fail',
      message: 'Require Admin Permission'
   })
}

// super-admin
exports.checkIfUserIsSuperAdmin = async (req, res, next) => {
   const user = await User.findOne({_id: req.userId})
   if (!user) {
      return res.status(404).json({
         status: 'fail',
         message: "User Not Found"
      })
   }

   if (user.role === 'superadmin') {
      next();
      return;
   }

   return res.status(403).json({
      status: 'fail',
      message: 'Require Admin Permission'
   })
}
// approver
exports.checkIfUserIsApprover = async (req, res, next) => {
   const user = await User.findOne({_id: req.userId})
   if (!user) {
      return res.status(404).json({
         status: 'fail',
         message: "User Not Found"
      })
   }

   if (user.role === 'approver') {
      next();
      return;
   }

   return res.status(403).json({
      status: 'fail',
      message: 'Require Admin Permission'
   })
}

// user

exports.checkIfUserIsUser = async (req, res, next) => {
   const user = await User.findOne({_id: req.userId})
   if (!user) {
      return res.status(404).json({
         status: 'fail',
         message: "User Not Found"
      })
   }

   if (user.role === 'user') {
      next();
      return;
   }

   return res.status(403).json({
      status: 'fail',
      message: 'Require Admin Permission'
   })
}