const mongoose = require("mongoose")

const Schema = mongoose.Schema;


require('mongoose-type-email');

const approverSchema = new Schema ({

    name: {
        type: String
    },
   
    institute:{
       type: mongoose.Schema.Types.ObjectId,
       ref:'admin.model'

    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'department.model'
    },
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
},
 {
    timestamps: true
});



const Approver = mongoose.model('Approver', approverSchema)
module.exports = Approver
