import activityRoute from './activity';
import petRoute from './pet';
import deviceRoute from './device';
import userRoute from './user';
import authRoute from './auth';
import meRoute from './me';
import restify from 'restify';

export default {

    init: (diContext) => {

        activityRoute.init(diContext);
        petRoute.init(diContext);
        deviceRoute.init(diContext);
        userRoute.init(diContext);
        authRoute.init(diContext);
        meRoute.init(diContext);

        diContext.restifyServer.get(/\/docs\/?.*/, restify.serveStatic({
    		directory: "./public",
    		default: "index.html"
		}));

    }

};
