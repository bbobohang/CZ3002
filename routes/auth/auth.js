const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../utils/verifyToken');
const cookieParser = require('cookie-parser');

// @route POST auth/register
// @descr Register User to DB
// @access Public
router.post('/register', async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });

		if (user) {
			console.log('user exists');
			return res.status(400).json({ errors: { msg: 'User already exists' } });
		}

		//Creating the user object
		if (req.body.doctorType) {
			user = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				role: req.body.role,
				doctorType: req.body.doctorType,
			});
		} else {
			user = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				role: req.body.role,
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(req.body.password, salt);
		user.password = hash;

		//Saving to the db
		await user.save();
		console.log('User registered');

		//Maybe should not store the email in the token
		var token = jwt.sign(
			{ id: user._id, email: user.email, name: user.name, role: user.role },
			process.env.jwtSecret
		);
		//If role == doctor, store the doctorType in JWT as well
		if (user.role === 'doctor') {
			token = jwt.sign(
				{
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
					type: user.doctorType,
				},
				process.env.jwtSecret
			);
		}
		const { password, ...others } = user._doc;
		res
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.status(200)
			.json({ ...others });
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

//Logging in the user
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(400).json({ errors: { msg: 'User does not exists' } });

		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect)
			return res.status(400).json({ errors: { msg: 'Invalid Credentials' } });

		//Maybe should not store the email in the token
		var token = jwt.sign(
			{ id: user._id, email: user.email, name: user.name, role: user.role },
			process.env.jwtSecret
		);
		//If role == doctor, store the doctorType in JWT as well
		if (user.role === 'doctor') {
			token = jwt.sign(
				{
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
					type: user.doctorType,
				},
				process.env.jwtSecret
			);
		}

		const { password, ...others } = user._doc;
		console.log('User Login');

		res
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.status(200)
			.json({ ...others });
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

// @route POST auth/logout
// @descr Logout User
// @access Public
router.post('/logout', (req, res) => {
	try {
		res.clearCookie('access_token');
		res.status(200).send('Cookies cleared. User logged out!');
		res.end();
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

//Checking if the user token is in cookies, return user id
router.get('/check', verifyToken, (req, res) => {
	console.log(req.user);
	return res.status(200).json(req.user);
});

module.exports = router;
