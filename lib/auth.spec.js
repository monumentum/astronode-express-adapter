jest.mock('astronode-plugin');

const ExpressAuthController = require('./auth');
const { AuthAdapter } = require.requireMock('astronode-plugin');

describe('Express AuthController', () => {
    let ctrl;
    const fakeMethods = {
        login: jest.fn(),
        logout: jest.fn()
    };


    beforeEach(() => {
        AuthAdapter.mockImplementation(() => fakeMethods);
        ctrl = new ExpressAuthController();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call login correctly', () => {
        const body = { foo: 'bar' };

        ctrl.login({ body });
        expect(AuthAdapter.prototype.login).toHaveBeenCalledWith(body);
    });

    it('should call logout', () => {
        const params = { id: '1' };

        ctrl.logout({ params });
        expect(AuthAdapter.prototype.logout).toHaveBeenCalledWith(params.id);
    });
});