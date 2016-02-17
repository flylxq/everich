'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ManageTable = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 */
var ManageTable = exports.ManageTable = _react2.default.createClass({
    displayName: 'ManageTable',

    getInitialState: function getInitialState() {
        return {};
    },
    _adminNode: function _adminNode(row) {
        var _props = this.props;
        var editRow = _props.editRow;
        var deleteRow = _props.deleteRow;

        if (this.props.tableAdmin) {
            return _react2.default.createElement(
                'td',
                null,
                _react2.default.createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'warning', onClick: function onClick() {
                            return editRow(row);
                        } },
                    _react2.default.createElement('span', { className: 'glyphicon glyphicon-pencil' }),
                    'Edit'
                ),
                _react2.default.createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'danger', onClick: function onClick() {
                            return deleteRow(row);
                        } },
                    _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' }),
                    'Delete'
                )
            );
        }
    },
    _indexNode: function _indexNode(index) {
        if (this.props.tableIndex) {
            return _react2.default.createElement(
                'td',
                null,
                index + 1
            );
        }
    },
    render: function render() {
        var _this = this;

        var _props2 = this.props;
        var schema = _props2.schema;
        var data = _props2.data;
        var tableAdmin = _props2.tableAdmin;
        var tableIndex = _props2.tableIndex;

        var theaders = schema.map(function (key) {
            return key.label;
        });
        tableIndex && theaders.unshift('序号');
        tableAdmin && theaders.unshift('管理');
        var headerNodes = theaders.map(function (header, index) {
            return _react2.default.createElement(
                'th',
                { key: index },
                header
            );
        }),
            bodyNodes = data.map(function (d, index) {
            var rows = schema.map(function (key, index) {
                return _react2.default.createElement(
                    'td',
                    { key: index },
                    d[key.key]
                );
            });
            return _react2.default.createElement(
                'tr',
                { key: index },
                _this._adminNode(d),
                _this._indexNode(index),
                rows
            );
        });

        return _react2.default.createElement(
            _reactBootstrap.Table,
            { responsive: true,
                striped: true,
                hover: true,
                condensed: true },
            _react2.default.createElement(
                'thead',
                null,
                _react2.default.createElement(
                    'tr',
                    null,
                    headerNodes
                )
            ),
            _react2.default.createElement(
                'tbody',
                null,
                bodyNodes
            )
        );
    }
});

//# sourceMappingURL=Table.js.map