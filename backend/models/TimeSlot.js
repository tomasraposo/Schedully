const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Trainer = require('./Trainer');
const Course = require('./Course');

const TimeSlotSchema = new Schema({
    trainer :{
        type: Schema.Types.ObjectId, 
        ref:'Trainer'
    },
    course:{
        type: Schema.Types.ObjectId, 
        ref:'Course'
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    feedback: {
        type: String
    },
    attending: {
        type: Boolean,
        required: true,
        default: true
    }
});

// Add timeslot to the course and trainer
TimeSlotSchema.post("save", function(doc) {
    Trainer.findOne({_id: this.trainer}, (err, trainer) => {
        if (err) return err;
        if (trainer) {
            trainer.timeSlots.push(this._id);
            trainer.save();
        }
        Course.findOne({_id: this.course}, (err, course) => {
            if (err) return err;
            if (course) {
                course.timeSlots.push(this._id);
                course.save();
            }
        });
    }); 
});

//exporting the model
module.exports = mongoose.model('TimeSlot',TimeSlotSchema);