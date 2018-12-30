require("@babel/polyfill");
require("@babel/register");
const config = require('./config').default;

const app = require('./server');

app.listen(config.port);

console.log(`listening on port ${config.port}`);
