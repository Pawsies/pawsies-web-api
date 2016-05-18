import bunyan from 'bunyan';

var log = bunyan.createLogger({
  name        : 'pawsies-gateway',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : process.stdout,
  serializers : bunyan.stdSerializers
});

export default log
