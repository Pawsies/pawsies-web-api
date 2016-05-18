import auth from '../utils/auth';

export default {

    init: (diContext) => {

        diContext.restifyServer.get('/api/activities', auth.isAuthenticated, (req, res) => {

			let query = {
				limit: req.query.limit,
				page: req.query.page,
				lean: true,
                populate: "createdBy"
			};

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.activityIndex, query
            )
			.then(data => {

				res.send(200, data);

			})
			.catch(err => {

				res.send(500);

			});

		});

        diContext.restifyServer.post('/api/events', auth.isDevice, (req, res) => {

            req.body.targetType = "Device";
            req.body.targetId = req.deviceId;

			diContext.rabbitMQClient
			.query(
                diContext.rabbitMQClient.queryTypes.activityCreate, {
                    payload: req.body.payload,
                    createdBy: req.userId,
                    targetId: req.body.targetId,
                	targetType: req.body.targetType,
                    type: req.body.type
                }
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
