const mongoose = require("mongoose")

const Schema = mongoose.Schema;


require('mongoose-type-email');

const StudentSchema = new Schema ({

    name:{
        type: String
    },
    gender:{
        type: String

    },
   
    institute:{
       type: mongoose.Schema.Types.ObjectId,
       ref:'Admin'

    },
    uploads:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload'
    }],
    profilepicture:{
        type: String
    },
    email:
         mongoose.SchemaTypes.Email,
    academiclevel :{
        type:String
    },
    phone:{
        type:String
    },
    year :{
        type:Date
    },
    date:{
        type: Date,
        default: Date.now()
    },
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    changeProfile: {
        type:Boolean,
        default: true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
        }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }]
  
},
 {
    timestamps: true
});



const Student = mongoose.model('Student', StudentSchema)
module.exports = Student
