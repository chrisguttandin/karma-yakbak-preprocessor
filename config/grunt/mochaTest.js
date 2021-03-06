const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

module.exports = {
    test: {
        options: {
            bail: true,
            clearRequireCache: true,
            require: [
                () => global.expect = chai.expect
            ]
        },
        src: [
            'test/unit/**/*.js'
        ]
    }
};
