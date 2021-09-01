const Upload = require('../models/upload.model');
const Student = require('../models/student.model');


exports.UploadFile= async(req, res) => {

   const name = req.params.name;
   const{postname, file,title,description,department,under,academiclevel,status,state} = req.body;
    
  
  if(!postname){
     return res.status(400).json({
        status:'fail',
        message:'name is empty'
     })
      }
  
   if(!file){
     return res.status(400).json({
        status:'fail',
        message:'please insert the file'
     })
  }
  if(!title){
     return res.status(400).json({
        status:'fail',
        message:'please insert the title'
     })
  }


  if(!status){
     return res.status(400).json({
        status:'fail',
        message:'please insert the status level'
     })
  }
const uploader = await Student.findOne({name});
console.log(uploader);


let newUpload = new Upload({name,postname, file, title, description,department,under,academiclevel,status,state, uploader})

// newUpload.postedBy = postedBy._id;
uploader.uploads = newUpload._id;
// uploader.Update()
await Student.findByIdAndUpdate(uploader._id, {$push: {uploads: newUpload._id}}, {useFindAndModify: true})

await uploader.save();
await newUpload.save();
res.status(200).json({
   status: 'success',
   message: 'post successfully uploaded'  
})
}


exports.uploadList = async(req, res) => {
   const upload = await Upload.find({state: "upload"});
   res.json({upload})

}
exports.postList = async(req, res) => {
   const post = await Upload.find({state: "post"});
   res.json({post})
}


exports.findPostBYId = (req, res) => {
   const _id = req.params._id;
   Post.findById(_id)
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
 
 exports.ApprovePost = async (req,res) => {

   const postname = req.params.postname; 
   const {file,title,description,department,under,academiclevel,status,state }= req.body;

   
   await Upload.updateOne({postname: postname}, {state: 'post'})
 
   const upload = await Upload.findOne({postname});
  
  
   let newPost = new Upload({postname, file, title, description,department,under,academiclevel,status,state});
 
newPost.upload = upload._id;
upload.Upload = newPost._id;


await upload.save();
await newPost.save();




console.log(upload);
res.status(200).json({
  status:'succes',
  message: 'successfuly uploaded'
})
};
exports.LikePost = async(req, res)=>{
   try{
      let result = await Upload.findByIdAndUpdate(req.body._id,{$push: {likes: req.body.userId}},{new: true})
      res.json(result)
    }catch(err){
       return res.status(400).json({
         error: errorHandler.getErrorMessage(err)
       })
   }
}
 exports.UnlikePost =  async (req, res) => {
   try{
     let result = await Post.findByIdAndUpdate(req.body._id, {$pull: {likes: req.body.userId}}, {new: true})
     res.json(result)
   }catch(err){
     return res.status(400).json({
       error: errorHandler.getErrorMessage(err)
     })
   }
 }
  
