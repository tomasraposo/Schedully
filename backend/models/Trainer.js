const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User =  require('./User');

const trainerSchema = new Schema({
    logRate:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    skills:[{ 
        level: {
            type: Number,
            required: true,
            default: 1
        },
        skill: {
            type: Schema.Types.ObjectId, 
            ref:'Skill'
        }
    }],
    timeSlots:[{
        type: Schema.Types.ObjectId, 
        ref:'TimeSlot'
    }]
});

// getting timeslots populate will use the ids in the timeslots attribute and populate them with the actual timeslot values
trainerSchema.method.getTimeSlots = () => {
    this.populate('timeSlots');
    return this.timeSlots;
}

module.exports = User.discriminator('Trainer',trainerSchema);