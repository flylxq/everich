'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DAO2 = require('./DAO');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ClientDAO = (function (_DAO) {
    _inherits(ClientDAO, _DAO);

    function ClientDAO() {
        _classCallCheck(this, ClientDAO);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ClientDAO).call(this));
    }

    return ClientDAO;
})(_DAO2.DAO);

exports.default = ClientDAO;

//# sourceMappingURL=clients.js.map