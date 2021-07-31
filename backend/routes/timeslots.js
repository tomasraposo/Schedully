const express = require("express");
const router = express.Router({mergeParams: true});
const TimeSlot = require("../models/TimeSlot");
const Course = require("../models/Course");
const Trainer = require("../models/Trainer");

router.post("/db/timeslots/add", (req, res) => {
    let {trainer, course, startTime, endTime} = req.body;
	_startTime = new Date(startTime);
	_endTime = new Date(endTime);
    if (!course) {
        return res.status(401).json({message: "Course field is not defined"});
    }
    if (!trainer) {
        return res.status(401).json({message: "Trainer field is not defined"});
    }
    if (!startTime) {
        return res.status(401).json({message: "Start Time field is not defined"});
    }
    if (!endTime) {
        return res.status(401).json({message: "End Time field is not defined"});
    }
    if (startTime > endTime) {
        return res.status(401).json({message: "Session Start Time cannot be after End Time"});
    }
	Trainer.findOne({_id: trainer._id}, (err, trainer) => {
		if (err) return err;
		if (!trainer)
			return res.status(401).json({message: `Could not find ${firstName} ${lastName} in the system.`});
        //Check if any timeslot for that trainer exist within the range given, if any does, they are busy
        TimeSlot.findOne({
            trainer: trainer._id,
            endTime: {
                $gt: _startTime
            },
            startTime:
            {
                $lt: _endTime
            }
        }, (err, TimeSlots) => {
            if (TimeSlots) {
                console.log(`TimeSlot: Conflict for ${trainer.firstName} ${trainer.lastName} with TimeSlot: ${TimeSlots.startTime} -> ${TimeSlots.endTime} for Course: ${TimeSlots.course}`);
                return res.status(401).json({message: `Conflict for ${trainer.firstName} ${trainer.lastName} with TimeSlot: ${TimeSlots.startTime} -> ${TimeSlots.endTime}.`});
            } else {
                Course.findOne({_id: course._id}, (err, foundCourse) => {
                    if (err) return err;
                    if (!foundCourse) 
                        return res.status(401).json({message: `Could not find ${course.courseName} course in the system.`}); 
                    else {
                        const timeSlot = new TimeSlot({trainer: trainer._id, course: foundCourse._id,
                                                       startTime: _startTime, endTime: _endTime});
                        timeSlot.save();
                        console.log("TimeSlot:", timeSlot);
                        res.status(200).json({message: `Time slot added to ${trainer.firstName} ${trainer.lastName}.`});
                    }
                });
            }
        });
	}); 
});

module.exports = router;