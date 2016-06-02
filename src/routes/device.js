import auth from '../utils/auth';

export default {

    init: (diContext) => {

		diContext.restifyServer.get('/api/devices', auth.isAdministrator, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true
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

        diContext.restifyServer.get('/api/devices/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.deviceShow,
                { filters: { _id: req.params.id }, lean: true }
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/devices', auth.isAdministrator, (req, res) => {

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

        diContext.restifyServer.post('/api/devices/:id/push', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.commandToDevice(req.params.id, req.body);
			/*.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(400, err);

			});*/

			res.send(200);

		});

        diContext.restifyServer.put('/api/devices/:id', auth.isAdministrator, (req, res) => {

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.deviceUpdate,
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
