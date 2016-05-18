import bunyanLog from "./bunyanLog";
import jwt from "jsonwebtoken";

export default {

	isAuthenticated: (req, res, next) => {

		let token = null;

		if (req.headers.authorization && req.headers.authorization.split(' ').shift() === 'Bearer') {

			token = req.headers.authorization.split(' ').pop();

		} else if (req.query && req.query.token) {

			token = req.query.token;

		}

		if (token) {

			jwt.verify(token, process.env.SECRET, (err, data) => {

				if (err) return res.send(403, err);

				req.userId = data.id;

				return next();

			});

		} else {

			return res.send(403, "unauthorized");

		}

	},

	isAdministrator: (req, res, next) => {

		let token = null;

		if (req.headers.authorization && req.headers.authorization.split(' ').shift() === 'Bearer') {

			token = req.headers.authorization.split(' ').pop();

		} else if (req.query && req.query.token) {

			token = req.query.token;

		}

		if (token) {

			jwt.verify(token, process.env.SECRET, (err, data) => {

				if (err) return res.send(403, err);

				if (data.role === "administrator") {

					req.userId = data.id;

					return next();

				} else {

					return res.send(403, "you must be an administrator");

				}

			});

		} else {

			return res.send(403, "unauthorized");

		}

	},

	isDevice: (req, res, next) => {

		let token = null;

		if (req.headers.authorization && req.headers.authorization.split(' ').shift() === 'Device') {

			token = req.headers.authorization.split(' ').pop();

		} else if (req.query && req.query.token) {

			token = req.query.token;

		}

		if (token) {

			req.deviceId = token;

			return next();

		} else {

			return res.send(403, "unauthorized");

		}

	}

};
