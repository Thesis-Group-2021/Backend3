const mongoose = require("mongoose")

const Schema = mongoose.Schema

const uploadSchema = new Schema ({
   
 
    postname:{
        type: String
    },
    file:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
 
    department:{
        type: String
    },

    under :{
        type:String
    },
    academiclevel:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: Number
    },
    state: {
        type:String,
        default:"upload"
       
        
    },
  
    uploader: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }


}, {
    timestamps: true
})

const Upload = mongoose.model('Upload', uploadSchema)
module.exports = Upload
