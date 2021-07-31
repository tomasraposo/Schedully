const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    skillRequirements:[{ 
        type: Schema.Types.ObjectId, 
        ref:'Skill'
    }],
    deliveryMethod : {
        type: String,
        required: true,
    },
    courseName : {
        type: String,
        required: true,
        unique: true
    },
    timeSlots:[{
        type: Schema.Types.ObjectId, 
        ref:'TimeSlot'
    }]
}); 

module.exports = mongoose.model('Course',courseSchema );
