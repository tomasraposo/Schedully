const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//creating scehma
const skillSchema = new Schema({
    skillName : {
        type: String,
        required: true,
        unique: true,
    }
}); 
//exporting model
module.exports = mongoose.model('Skill',skillSchema );
