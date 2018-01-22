const express = require('express');
const bodyParser = require('body-parser');

const { EngineAdapter } = require('astronode-plugin');

class Express extends EngineAdapter{
    constructor() {
        super();
        this.app = express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    createRoute(path, method, middlewares, callback) {
        this.app[method](path, middlewares, callback);
    }

    start() {
        this.app.listen(astronode.config.port, astronode.config.host, () => {
            console.log(`Express server up on <http://${astronode.config.host}:${astronode.config.port}/>`);
        });
    }
}

module.exports = Express;