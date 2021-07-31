var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//setting a discriminator key for the user to identify different "subclasses"(submodels) of the User Model
options = {discriminatorKey:'type'};
var bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {
        type: String,
        unique: true, 
        required: true,
        lowercase: true, 
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        lowercase: true,
        required: true
    },
    lastName: {
        type: String,
        lowercase: true,
        required: true
    }
},options);

//after a user is saved, log that users name and pass to console
userSchema.post("save", function(doc) {
     console.log(`user created/updated : \nusername: ${this.username}\npass: ${this.password}`);
});

//Methods That are done on the Users.
//Check if password is matching using bcyrpt compare
userSchema.methods.hasPasswordMatch  = async function (password, next) {
    return await bcrypt.compare(password, this.password, function (err, match) {
        if (err) 
            return next(err);
        next(null, match);
    });
}

//exporting model
module.exports = mongoose.model('User', userSchema);
//https://mongoosejs.com/docs/populate.html