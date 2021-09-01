const User = require('../models/user.model');
const Student = require('../models/student.model');
const Admin= require('../models/admin.model');
const Upload = require('../models/upload.model');



exports.createClientProfile = async (req,res) => {

   const name = req.params.name;
   const { email, gender, profilepicture, academiclevel, year,institute} = req.body;
   

   if(!email){
      return res.status(401).json({
         status:'fail',
         message:'please provide email'
      })
   }

   if(!gender){
      return res.status(401).json({
         status:'fail',
         message:'please provide your gender'
      })
   }


   const user = await User.findOne({name});

   if(user.Student)
      return res.status(400).json({
         status:'fail',
         message:'user exists'
      })
      Student.findOne({institute :institute }).populate('institute');
   let newStudent = new Student({ name, email, gender, profilepicture, academiclevel, year,institute});
   
   

   newStudent.user = user._id;
   user.Student = newStudent._id;

  

   await user.save();

 
   
   await newStudent.save();
  
   res.status(200).json({
      status: 'success',
      message: 'Profile successfully created'  
   })
}


exports.getUserProfile = async (req, res) => {
  
   const students = await Student.find({}).populate('institute','uploads');
   res.json({students})
}
exports.countPost = async(req, res) => {
  const student = await Student.findOne({user: req.userId});
  Upload.countDocuments({'uploader' :student._id})
  .then(uploader => res.json(uploader))
  .catch(err => res.status(400).json('Error:' + err));
  console.log(req.userId);
}


// exports.list = async (req, res)=>{
//   try {
//     let users = await Student.find().select('name email updated created')
//     res.json(users)
//   } catch(err){
//   return res.status(400).json({
//     error: errorHandler.getErrorMessage(err)
//   })
// }
// }
exports.showUserProfile = async (req, res) => {
  
   const _id = req.params._id;
   Student.findById(_id).populate('uploads')
     .then(data => {
       if (!data)
         res.status(404).send({ message: "id not found" + _id });
       else res.send(data);
     })
     .catch(err => {
       res
         .status(500)
         .send({
           message: "error retriving with id" +
             _id
         });
     });
 }

exports.updateProfile = (req, res) => {
   
   const {firstname,lastname,gender,profilePicture,phone,email,academiclevel,year} = req.body;
   const id = req.params.id;
   const newData = {firstname,lastname,gender,profilePicture,phone,email,academiclevel,year, changeProfile:false}

   Student.updateOne({_id:id }, newData).then(
     () => {
       res.status(201).json({
         message: 'updated successfully!'
       });
     }
   ).catch(
     (error) => {
       res.status(400).json({
         error: error
       });
     }
   );
 }
 
//follow user
exports.addFollowing = async (req, res, next) => {
  try{
    await Student.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}) 
    next()
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req, res) => {
  try{
    let result = await Student.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec()
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    }catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }  
}

const removeFollowing = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}) 
    next()
  }catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const removeFollower = async (req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec() 
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}