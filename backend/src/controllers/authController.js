const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createUser, findUserByEmail } = require('../models/userModel');
const ApiError = require('../utils/ApiError');

const signToken = (user) =>
	jwt.sign(
		{
			id: user.id,
			email: user.email
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
	);

const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			throw new ApiError(409, 'Email already registered');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await createUser({ email, password: hashedPassword });
		const token = signToken(newUser);

		return res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: {
				user: newUser,
				token
			}
		});
	} catch (error) {
		return next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await findUserByEmail(email);

		if (!user) {
			throw new ApiError(401, 'Invalid email or password');
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			throw new ApiError(401, 'Invalid email or password');
		}

		const token = signToken(user);

		return res.status(200).json({
			success: true,
			message: 'Login successful',
			data: {
				user: {
					id: user.id,
					email: user.email,
					created_at: user.created_at
				},
				token
			}
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	register,
	login
};

