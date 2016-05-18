import dotenv from 'dotenv';
import _ from 'lodash';
import restify from 'restify';
import bunyanLog from './utils/bunyanLog';
import RabbitMQClient from './utils/setupRabbitMQClient';
import routes from './routes';

function start() {

    let diContext = {};

    diContext.rabbitMQClient = new RabbitMQClient();

    diContext.restifyServer = restify.createServer({
    	name: 'pawsies-gateway',
    	log: bunyanLog
    });

    diContext.restifyServer.use(restify.acceptParser(diContext.restifyServer.acceptable));
    diContext.restifyServer.use(restify.queryParser());
    diContext.restifyServer.use(restify.bodyParser());
    diContext.restifyServer.pre(restify.CORS({
    	origins: ['*'],
    	credentials: true,
    	headers: ['X-Requested-With', 'Authorization']
    }));

    diContext.restifyServer.pre(restify.fullResponse());
    diContext.restifyServer.on('MethodNotAllowed', (req, res) => {
    	if (req.method.toLowerCase() === 'options') {
    		var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization'];

    		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        	res.header('Access-Control-Allow-Credentials', true);
        	res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        	res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        	res.header('Access-Control-Allow-Origin', req.headers.origin);

    		return res.send(200);
    	} else {
    		return res.send(new restify.MethodNotAllowedError());
    	}
    });

    diContext.restifyServer.on('after', restify.auditLogger({ log: bunyanLog }));

    routes.init(diContext);

    diContext.restifyServer.listen(process.env.PORT||8080, () => {
    	bunyanLog.info('restify server listening on %d', (process.env.PORT||8080));
    });

}

dotenv.load();
start();
