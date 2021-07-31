const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimeSlot = require('./TimeSlot');
const Course = require('./Course');
const User =  require('./User');

// Course scheduler currently has no extra attributes but will still need to inherit 
// the User schema,and create a discriminator to make sure it has the type attribute 
// and access its own methods.
const courseSchedulerSchema = new Schema({});

courseSchedulerSchema.method.createCourse = (courseData) =>{
    const newCourse = new Course(courseData);
    newCourse.save(function (err) {
        if (err) console.log(err)
      });
}

courseSchedulerSchema.method.createTimeslot = (timeSlotData) =>{
    const newTimeSlot = new TimeSlot(timeSlotData);
    newTimeSlot.save((err)=>{
        if (err) console.log(err)
      });
}

//return all timeslots
courseSchedulerSchema.method.viewTimeTable = () => TimeSlot.find({});

module.exports = User.discriminator('CourseScheduler',courseSchedulerSchema);