'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dialog = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 *
 */

var Dialog = exports.Dialog = React.createClass({
    displayName: 'Dialog',

    getInitialState: function getInitialState() {
        var _props$dialog = this.props.dialog;
        var show = _props$dialog.show;
        var message = _props$dialog.message;
        var type = _props$dialog.type;
        var callback = _props$dialog.callback;

        return {
            show: show || false,
            message: message || '',
            type: type || 'alert',
            callback: callback || null
        };
    },
    alert: function alert(message, callback) {
        this.setState({
            show: true,
            message: message,
            type: 'alert',
            callback: callback
        });
    },
    confirm: function confirm(message, callback) {
        this.setState({
            show: true,
            message: message,
            type: 'confirm',
            callback: callback
        });
    },
    _confirm: function _confirm() {
        this.state.callback();
        this.setState({ show: false });
    },
    _cancel: function _cancel() {
        this.setState({ show: false });
    },
    componentDidMount: function componentDidMount() {
        var self = this;
        $(window).on('keypress', function (event) {
            if (self.state.show && event.keyCode === 13) {
                self._confirm();
            }
        });
    },
    render: function render() {
        var _state = this.state;
        var show = _state.show;
        var type = _state.type;
        var message = _state.message;

        var cancelNode = type === 'confirm' ? React.createElement(
            _reactBootstrap.Button,
            { onClick: this._cancel },
            '取消'
        ) : null;
        return React.createElement(
            _reactBootstrap.Modal,
            { show: show,
                backdrop: 'static',
                enforceFocus: true,
                keyboard: false },
            React.createElement(
                _reactBootstrap.Modal.Body,
                null,
                message
            ),
            React.createElement(
                _reactBootstrap.Modal.Footer,
                null,
                React.createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'primary', onClick: this._confirm },
                    '确认'
                ),
                cancelNode
            )
        );
    }
});

//# sourceMappingURL=Dialog.js.map