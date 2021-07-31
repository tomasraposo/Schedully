const express = require("express");
const router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const CourseScheduler = require("../models/CourseScheduler");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Skill = require("../models/Skill");
var bcrypt = require("bcrypt");

const sendToken = (user, req, res) => {
	const token = jwt.sign({ username: req.body.username,  password: req.body.password }, process.env.TOKEN_SECRET);
	res.status(200).json({ token: token, user: user});
}

router.post("/admin/users/add", async (req, res, next)=> {
	var {username, unHashedpassword, firstName, lastName, type} = req.body;
	const salt = await bcrpyt.genSalt();
	password = await bcrpyt.hash(password, salt)
	User.findOne ({ "username" : req.body.username }, (err, user) => {
		if (err) return err;
		if (user) return res.status(403).json({error: "Username is already in use"});
	});
	if (type === "Trainer") {
		let {skills} = req.body;
		const names = skills.map(skill => skill.skillName);
		Skill.find({skillName: {$in:names}})
			 .select("-__v").then(skillsMatch => {
				 // find unmatched skills
				 let results = skills.filter(({skillName: name1}) => {
					return !skillsMatch.some(({skillName: name2}) => {
						return name1 === name2;
					})
				 })
				 // Update array with new skills and format it -> {level, skill}
				 results.forEach(({skillName}, i) => {
					const newSkill = new Skill({skillName});
					newSkill.save();
					results[i].skill = newSkill._id;
					results[i].level = results[i].skillLevel
					delete results[i].skillLevel;
					delete results[i].skillName;
				 });
				 // Update array with matching skills and format it -> {level, skill}
				 let trainerSkills = skills.map(({skillName: name1}, i) => {
					let isMatch = skillsMatch.some(({skillName: name2}, i) => name1 === name2)
					if (isMatch) {
						return {level: skills[i].skillLevel, skill: skillsMatch[i]._id}
					}
				 })
				 // filter undefined values
				 const t = trainerSkills.filter(e => e != undefined || e != null);
				 // merge the matched and unmatched skills and pass it to Trainer
				 trainerSkills = [...t, ...results]

				let user = new Trainer({username, password, firstName, lastName});
				user.skills = trainerSkills;
				user.save((err) => {
					if(err) return next(err);
					sendToken(user, req, res);
				});			
			});
	} else if (type === "CourseScheduler") {
		let user = new CourseScheduler({username, password, firstName, lastName});
		user.save((err) => {
			if(err) return next(err);
			sendToken(user, req, res);
		});
	}
});

module.exports = router;