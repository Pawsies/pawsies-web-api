import _ from 'lodash';
import uid from 'uid';
import hermes from 'runnable-hermes';
import bunyanLog from './bunyanLog';

export default class RabbitMQClient {

    queryTypes = {

        doAuthentication: 'DO_AUTHENTICATION',
        doRegister: 'DO_REGISTER',

        activityIndex: 'INDEX_ACTIVITY',
        activityCreate: 'CREATE_ACTIVITY',

        petIndex: 'INDEX_PET',
        petShow: 'SHOW_PET',
        petCreate: 'CREATE_PET',
        petUpdate: 'UPDATE_PET',

        deviceIndex: 'INDEX_DEVICE',
        deviceShow: 'SHOW_DEVICE',
        deviceCreate: 'CREATE_DEVICE',
        deviceUpdate: 'UPDATE_DEVICE',
        devicePush: 'SERVER_PUSH',

        userIndex: 'INDEX_USER',
        userShow: 'SHOW_USER',
        userCreate: 'CREATE_USER',
        userUpdate: 'UPDATE_USER',

    }

    constructor() {

        this._listeners = {};

        this._service = hermes.hermesSingletonFactory({
            name: 'pawsies',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: process.env.RABBITMQ_PORT || '5672',
            username: process.env.RABBITMQ_USERNAME || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
            queues: [ 'pawsies-vault-request', 'pawsies-vault-response', 'pawsies-rtm-gateway-request' ]
        });

        this._service.connect().on('ready', () => {

            bunyanLog.info('connected to RabbitMQ');

            this._service.on('subscribe', (queueName, handlerFn) => bunyanLog.info('subscribed to', queueName));

            this._service.on('publish', (queueName, data) => bunyanLog.info('request emmited', queueName, data));

            this._service.subscribe('pawsies-vault-response', (request, done) => {

                bunyanLog.info('response received', 'pawsies-vault-response', request);

                if (this._listeners[String(request.id)]) {

                    if (request.error) {

                        this._listeners[String(request.id)].reject(request.error);

                    } else {

                        this._listeners[String(request.id)].resolve(request.payload);

                    }

                    delete this._listeners[String(request.id)];

                } else {

                    bunyanLog.info('silently ignoring', request.id, request);

                }

                done();

            });

        });

    }

    query(type, payload) {

        return new Promise((resolve, reject) => {

            let requestUid = uid();

            this._service.publish('pawsies-vault-request', {
                id: requestUid,
                channel: 'pawsies-vault-response',
                type: type,
                payload: payload
            });

            this._listeners[String(requestUid)] = { resolve: resolve, reject: reject };

            setTimeout(() => {

                delete this._listeners[String(requestUid)];

                reject(new Error('Response timeout'));

            }, 30*1000);

        });

    }

    commandToDevice(deviceId, payload) {

        this._service.publish('pawsies-rtm-gateway-request', {
            id: uid(),
            type: "SERVER_PUSH",
            deviceId: deviceId,
            payload: payload
        });

    }

}
