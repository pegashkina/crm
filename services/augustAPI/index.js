require('module-alias/register');
const http = require('http'),
    augustAPI = require('@augustAPI'),
    augustServer = http.Server(augustAPI),
    augustPORT = process.env.PORT || 3001,
    LOCAL = '0.0.0.0';
augustServer.listen(augustPORT, LOCAL, () => console.log(`augustAPI running on ${augustPORT}`));