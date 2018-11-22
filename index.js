// * Polyfill not included
// * include the polyfill separately when using features that require it, like generators
require("@babel/register");

const app = require('./server');

app.listen(3000);
