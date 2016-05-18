import auth from '../utils/auth';

export default {

    init: (diContext) => {

        diContext.restifyServer.get('/api/me', auth.isAuthenticated, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userShow,
                { filters: { _id: req.userId }, lean: true }
            )
			.then(data => {

                delete data.salt;
                delete data.hashedPassword;

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.put('/api/me', auth.isAuthenticated, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userUpdate,
                { filters: { _id: req.userId }, payload: req.body }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.get('/api/me/pets', auth.isAuthenticated, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true,
                filters: { "payload.owner": req.userId }
			};

			if (req.query.search && req.query.search !== "") {
				query.search = {
					value: req.query.search,
					fields: [ "payload.name" ]
				};
			};

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.petIndex, query
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/me/pets', auth.isAuthenticated, (req, res) => {

            req.body.owner = req.userId;

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.petCreate,
                { payload: req.body, userId: req.userId }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.get('/api/me/devices', auth.isAuthenticated, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true,
                filters: { "payload.owner": req.userId }
			};

			if (req.query.search && req.query.search !== "") {
				query.search = {
					value: req.query.search,
					fields: [ "payload.model" ]
				};
			};

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.deviceIndex, query
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/me/devices', auth.isAuthenticated, (req, res) => {

            req.body.owner = req.userId;

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.deviceCreate,
                { payload: req.body, userId: req.userId }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

	}

}
