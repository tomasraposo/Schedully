const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/User');
const Trainer = require("../models/Trainer");
const Course = require("../models/Course");
const Skill = require("../models/Skill");
const TimeSlot = require("../models/TimeSlot");
const {ObjectID, ResumeToken} = require("mongodb");

router.get("/api/courses", (req, res) => {
    Course.find({},{_id: 0})
    .select("courseName")
    .then((courses) => {
        res.send(courses);
    }).catch(err => console.log(err));
})

router.get("/api/skills", (req, res) => {
    Skill.find({}, {_id: 0})
    .select("skillName")
    .then((skills) => {
        res.send(skills);
    }).catch(err => console.log(err));
})

// Get all users in the system
router.get("/api/users", (req, res) => {
	User.find({}).then((users) => {
		res.send(users);
	})
	.catch(err => console.log(err));
});

const getValidIDStr = (str) => {
	return String(new ObjectID(str));
};

// Get all timeslots in the system
router.get("/api/timeslots", (req, res) => {
    TimeSlot.find({}, {_id: 0, __v: 0})
    .populate("trainer course", "firstName lastName courseName _id")
    .exec((err, results) => {
        if (err) return res.status(500).json({err: "Internal server error."});
        return res.status(200).json({results});
    })
});
//timeslot by trainer id
router.post("/api/timeslots/byId/:trainerid", (req, res) => {
    const trainerid = req.params.trainerid;
    let {month, year} = req.body;
    let startDate = new Date(year, month);
    let endDate = new Date(year, month+1);
    TimeSlot.find({ 
        'trainer':trainerid, 
        $or: [
            {
                startTime: {
                    $gte: startDate,
                    $lt: endDate
                }
            },
            {
                endTime: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        ]
    }, {__v: 0})
    .populate("trainer course", "firstName lastName courseName _id")
    .sort({ startTime: "asc"}).then((timeslots) => {
        res.send(timeslots);
    })
    .catch(err => console.log(err));
});

router.post("/api/timeslots", (req, res) => {
    let {month, year} = req.body;
    let startDate = new Date(year, month);
    let endDate = new Date(year, month+1);
    TimeSlot.find({
        $or: [
            {
                startTime: {
                    $gte: startDate,
                    $lt: endDate
                }
            },
            {
                endTime: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        ]
    }, {__v: 0})
    .populate("trainer course", "firstName lastName courseName _id")
    .sort({ startTime: "asc"}).then((timeslots) => {
        res.send(timeslots);
    })
    .catch(err => console.log(err));
});

router.delete("/api/timeslots/delete/:timeslot_id", (req, res) => {
    const id = req.params.timeslot_id;
    TimeSlot.findByIdAndDelete({_id: id })
    .then(() => {
        res.send({message: "Time slot cancelled"})
    })
    .catch(err => res.send(err))
});

router.put("/api/timeslots/update/:timeslot_id", (req, res) => {
    const id = req.params.timeslot_id;
    TimeSlot.findByIdAndUpdate(id, req.body, (err, timeslot) => {
        if (err) return res
        res.send({message: "time slot updated with success"});
    });

});

router.get("/api/trainers", (req, res) => {
        Trainer.find({})
        .then((trainers) => {
            res.send(trainers);
        }).catch(err => console.log(err));
});

router.post("/api/trainers", (req, res) => {
    const {skillRequirements} = req.body;
    let query = {type: "Trainer"};
    if (skillRequirements) {
        query.skills = {$elemMatch: {skill: {$in: skillRequirements}}}
        //Get trainers with appropriate skills (not sorted)
    }
    User.find(query)
    .then((trainers) => {
        res.send(trainers);
    }).catch(err => console.log(err));
})

//nested populate query to get trainers with timeslots and skills
router.get("/api/trainers/populate", (req, res) => {
    Trainer.find({}).sort('lastName').populate(
        [
            {path:"skills", populate:{path:"skill",select:"skillName",model:"Skill"}},
            {path:"timeSlots", populate:{path:"course",select:"courseName"} }
        ]
    )
    .then((trainers) => {
        res.send(trainers);
    }).catch(err => console.log(err));
});

router.post("/api/trainers/avaliable", (req, res) => {
    const {skillRequirements, startTime, endTime} = req.body;
    _startTime = new Date(startTime);
	_endTime = new Date(endTime);
    let results = [];
    Trainer.find({
        skills: {$elemMatch: {skill: {$in: skillRequirements}}}
    }).populate(
        [
            {
                path:"skills", 
                populate:{path:"skill",select:"skillName",model:"Skill"}
            },
            {
                path:"timeSlots", 
                populate:{path:"course",select:"courseName"}
            }, 
        ]
    )
    .then((trainers) => {
        trainers.forEach(trainer => {
            add = true;
            trainer.timeSlots.forEach(timeslot => {
                let startTime = new Date(timeslot.startTime);
                let endTime = new Date(timeslot.endTime);
                if (_startTime <= endTime && _endTime >= startTime) {
                    add = false;
                }
            });
            if (add) {
                results.push({_id: trainer.id, firstName: trainer.firstName, lastName: trainer.lastName, skills: trainer.skills});
            }
        });
        res.send(results);
    });
})

// nested query to retrieve all courses registered in the system
router.get("/api/courses/populate", (req, res) => {
    const query = [
        {
            path: "skillRequirements",
            model: "Skill",
            select: "_id skillName"        
        },{
            path: "timeSlots",
            model: "TimeSlot",
            select: ["startTime", "endTime"], 
            populate: {
                path: "trainer",
                model: "Trainer",
                select: "_id -type firstName lastName",
            }
        }
    ]
    Course.find({}, {__v: 0}).sort("courseName")
    .populate(query)
    .then((courses) => {
        res.send(courses);
    }).catch(err => console.log(err));
});

router.post("/api/courses/byId", (req, res) => {
    const {id} = req.body;
    Course.findById(id)
    .then((course) => {
        res.send(course);
    }).catch(err => console.log(err));
});

router.post("/api/trainers/byId", (req, res) => {
    const {id} = req.body;
    Trainer.findById(id)
    .then((course) => {
        res.send(course);
    }).catch(err => console.log(err));
});
//get timeslot by timeslot id
router.get("/api/timeslot/:id", (req, res) => {
    console.log("req recieved");
    const id = req.params.id;
    console.log(id);
    TimeSlot.find({"_id":id}, {_id: 0, __v: 0})
    .then((timeslot) => {
        console.log(timeslot)
        res.send(timeslot);
    }).catch(err => console.log(err));
});
//update trainers verified status
router.put("/api/trainer/setIsVerified",(req,res)=>{
    console.log("req received");
    console.log(req.body);
    const id = req.body.id;
    const isVerified = req.body.isVerified;
    Trainer.findByIdAndUpdate(id,{"isVerified":isVerified},(err, trainer) => {
        if (err) {
            console.log(err);
            return res}
        res.send({message: "trainer updated with success"});
    });
});
module.exports = router;    