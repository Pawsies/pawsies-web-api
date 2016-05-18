import auth from '../utils/auth';

export default {

    init: (diContext) => {

		diContext.restifyServer.get('/api/pets', auth.isAdministrator, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true
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

        diContext.restifyServer.get('/api/pets/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.petShow,
                { filters: { _id: req.params.id }, lean: true }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/pets', auth.isAdministrator, (req, res) => {

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

        diContext.restifyServer.put('/api/pets/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.petUpdate,
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
