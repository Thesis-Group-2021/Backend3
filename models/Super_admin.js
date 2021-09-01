const Mongoose = require("mongoose");
var crypto = require('crypto'); 

const Schema = Mongoose.Schema

const superAdminSchema = new Schema ({
   
    username:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "Super_Admin"
    },
    hash : String,
    salt: String


}, {
    timestamps: true
});

superAdminSchema.methods.setPassword = function(password){

    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

superAdminSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, 
        this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash === hash;
}

const Superadmin = Mongoose.model('Superadmin', superAdminSchema)
module.exports = Superadmin
