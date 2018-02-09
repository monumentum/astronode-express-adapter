const { AuthAdapter } = require('astronode-plugin');

class ExpressAuthController extends AuthAdapter {
    constructor(authentication) {
        super(authentication);

        this.login = req => super.login(req.body)
        this.logout = req => super.logout(req.params.id);
    }
}

module.exports = ExpressAuthController;