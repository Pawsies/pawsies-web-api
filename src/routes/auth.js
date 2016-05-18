import jwt from "jsonwebtoken";

export default {

    init: (diContext) => {

        diContext.restifyServer.post('/auth', (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.doAuthentication, req.body
            )
			.then(data => {

                if (data) {

				    res.send(200, { token: jwt.sign({ id: data._id, role: data.role }, process.env.SECRET) });

                } else {

                    res.send(400, "Invalid email or password");

                }

			})
			.catch(err => {

				res.send(400, "Invalid email or password");

			});

		});

        diContext.restifyServer.post('/register', (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.doRegister, req.body
            )
			.then(data => {

                if (data) {

				    res.send(200, { token: jwt.sign({ id: data._id, role: data.role }, process.env.SECRET) });

                } else {

                    res.send(400, "User already registered");

                }

			})
			.catch(err => {

				res.send(400, err);

			});

		});

	}

}
