const express = require("express");
const router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const User = require(process.cwd()+'/models/User');

router.post("/auth/login", (req, res) => {
	const {username, password} = req.body;
	if(username && password){
		const user = User.findOne({username: username}, (err, user) => {
			if (err) return done(err);
			if(!user){
				console.log("system could not find user - login.js");
				return res.status(401).json({message:`Could not find ${username} in the system`});
			}
				user.hasPasswordMatch(password, function(err, match) {
				if (err) return done(err);
				if (!match){
					console.log("user entered incorrect password - login.js");
					return res.status(401).json({message:"Password mismatch."});
				}
				var token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
				// return res.json({token: token, message: "You've successfully logged in. "});
				return res.json({token: token, type: user.type, id: user.id});
			});
		});
	}
});

module.exports = router;