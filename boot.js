const System = require('./sys/core/System');
global.sys = new System(require('./config.json'), __dirname);

global.use = sys.use.bind(sys);
global.use._root = __dirname;

module.exports = sys.init();
