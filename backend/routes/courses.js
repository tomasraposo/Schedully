const express = require("express");
const router = express.Router({mergeParams: true});
const TimeSlot = require("../models/TimeSlot");
const Course = require("../models/Course");
const Skill = require("../models/Skill");

router.post("/db/courses/add", (req, res) => {
	console.log("made it to db/courses/add");
	const {skillRequirements, deliveryMethod, courseName} = req.body;
	Course.findOne({courseName: courseName}, (err, course) => {
		if (err) return err;		
		if (course)
			return res.status(403).json({error: "A course under that name already exists in the database"});
	});
	const names = skillRequirements.map(skill => skill.skillName);
	Skill.find({skillName: {$in:names}})
		 .select("-__v")
		 .then(skillsMatch => {
			 // get course match by id
			 let courseSkills = skillsMatch.map(({_id: id}) => id);
			//  console.log(courseSkills);
			// find inexistent courses
			let newSkills = skillRequirements.filter(({skillName: name1}) => {
				return !skillsMatch.some(({skillName: name2}) => {
					return name1 === name2;
				})
			})
			// console.log(newSkills);
			// update course skill requirements list
			newSkills.forEach(({skillName: name}) => {
				const newSkill = new Skill({skillName: name});
				newSkill.save();
				courseSkills.push(newSkill._id);
				// console.log(courseSkills);
			});
			// create new course  
			const course = new Course({skillRequirements: courseSkills, deliveryMethod: deliveryMethod, courseName: courseName});
			course.save((err) => {
				if (err) return err;
				res.status(200).json({message: `${courseName} added with success`});					
			});
	})
}) 

module.exports = router;