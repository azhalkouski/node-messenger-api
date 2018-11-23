// * Polyfill not included
// * include the polyfill separately when using features that require it, like generators
require("@babel/register");

const app = require('./server');

app.listen(app.get('port'));

console.log(`listening on port ${app.get('port')}`);
