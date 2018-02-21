const express = require('express');
const bodyParser = require('body-parser');
const ExpressAuthController = require('./auth');

const { EngineAdapter } = require('astronode-plugin');

const get = (value, key) => {
    const values = key.split('.');
    let finalValue = value;

    values.forEach(v => {
        try {
            finalValue = finalValue[v]
        } catch (e) {
            finalValue = null
        }
    });

    return finalValue;
};

class Express extends EngineAdapter{
    constructor() {
        super();
        this.app = express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    extract(what) {
        return req => {
            return Promise.resolve(get(req, what))
        }
    }

    authenticationMiddleware(check) {
        return (roles, req, res, next) => {
            if (check(req.headers.token, roles)) return next();
            return res.status(401).json({ message: 'Not Allowed' });
        }
    }

    authenticationController(authentication) {
        return new ExpressAuthController(authentication);
    }

    createRoute(path, method, middlewares, callback) {
        this.app[method](path, middlewares, callback);
    }

    start(config) {
        this.app.listen(config.port, config.host, () => {
            console.log(`Express server up on <http://${config.host}:${config.port}/>`);
        });
    }
}

module.exports = Express;