jest.mock('express');
jest.mock('body-parser');

const express = require.requireMock('express');
const bodyParser = require.requireMock('body-parser');

const ExpressAdapter = require('./express');

describe('Express Plugin', () => {
    let adapter;
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

    it('should createRoute correctly', () => {
        const port = 3000;
        const host = '0.0.0.0';

        global.astronode = { config: { port, host }};

        adapter.start();

        const args = app.listen.mock.calls[0];
        expect(args).toHaveProperty('0', port);
        expect(args).toHaveProperty('1', host);
    });
});
