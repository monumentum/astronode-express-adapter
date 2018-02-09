jest.mock('express');
jest.mock('body-parser');

const express = require.requireMock('express');
const bodyParser = require.requireMock('body-parser');

const ExpressAdapter = require('./express');

describe('Express Plugin', () => {
    let adapter;
    let req;
    let res;
    let next;
    const urlencoded = jest.fn();
    const json = jest.fn();
    const fakeMethod = 'test';
    const app = { use: jest.fn(), [fakeMethod]: jest.fn(), listen: jest.fn((p, h, cb) => cb()) }

    const checkInitialization = () => {
        expect(app.use).toHaveBeenCalledTimes(2);
        expect(urlencoded).toHaveBeenCalledWith({ extended: true });
        expect(json).toHaveBeenCalledTimes(1);
    }

    beforeEach(() => {
        express.mockReturnValue(app);
        bodyParser.urlencoded = urlencoded;
        bodyParser.json = json;

        next = jest.fn();
        req = { headers: { token: 'x' }};
        res = {};
        res.json = jest.fn();
        res.status = jest.fn().mockReturnValue(res);

        adapter = new ExpressAdapter();
        checkInitialization();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start server correctly', () => {
        const fakePath = '/fake';
        const fakeMiddleware = 'FAKE_MID';
        const fakeCallback = '() => fake';

        adapter.createRoute(fakePath, fakeMethod, fakeMiddleware, fakeCallback);
        expect(app[fakeMethod]).toHaveBeenCalledWith(fakePath, fakeMiddleware, fakeCallback);
    });

    it('should call authenticationMiddleware', () => {
        const role = 'test';
        const fakeCheck = jest.fn().mockReturnValue(true);

        const wrap = adapter.authenticationMiddleware(fakeCheck);
        wrap(role, req, res, next);

        expect(fakeCheck).toHaveBeenCalledWith(req.headers.token, role);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call authenticationMiddleware', () => {
        const role = 'test';
        const fakeCheck = jest.fn().mockReturnValue(false);

        const wrap = adapter.authenticationMiddleware(fakeCheck);
        wrap(role, req, res, next);

        expect(fakeCheck).toHaveBeenCalledWith(req.headers.token, role);
        expect(next).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not Allowed' });
    });

    it('should call authenticationController', () => {
        const authentication = {
            api: {}
        };

        const controller = adapter.authenticationController(authentication);
        expect(controller).toHaveProperty('login');
        expect(controller).toHaveProperty('logout');
    });

    it('should createRoute correctly', () => {
        const port = 3000;
        const host = '0.0.0.0';

        const config = { port, host };

        adapter.start(config);

        const args = app.listen.mock.calls[0];
        expect(args).toHaveProperty('0', port);
        expect(args).toHaveProperty('1', host);
    });
});
