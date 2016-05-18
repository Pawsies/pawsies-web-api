import auth from '../utils/auth';

export default {

    init: (diContext) => {

        diContext.restifyServer.get('/api/users', auth.isAdministrator, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true
			};

			if (req.query.search && req.query.search !== "") {
				query.search = {
					value: req.query.search,
					fields: [ "payload.firstName", "payload.lastName", "payload.email" ]
				};
			};

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userIndex, query
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.get('/api/users/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userShow,
                { filters: { _id: req.params.id }, lean: true }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/users', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userCreate,
                { payload: req.body, password: req.body.password, userId: req.userId }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.put('/api/users/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.userUpdate,
                { filters: { _id: req.params.id }, payload: req.body }
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
