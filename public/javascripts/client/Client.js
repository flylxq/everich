'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _DAO = require('../controller/DAO');

var _DAO2 = _interopRequireDefault(_DAO);

var _Table = require('../components/Table');

var _Dialog = require('../components/Dialog');

var _reactBootstrap = require('react-bootstrap');

var _reactNotificationSystem = require('react-notification-system');

var _reactNotificationSystem2 = _interopRequireDefault(_reactNotificationSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

require('../../stylesheets/client.scss');

/**
 * key: key's name in source table
 * label: key's show text
 * require: whether the key is required, default is false
 * type: key's type for input, default is text
 * @type {*[]}
 */
/**
 *
 */

var CLIENT_SCHEMA = [{
    key: 'code',
    label: '编号',
    require: true
}, {
    key: 'name',
    label: '名称',
    require: true
}, {
    key: 'address',
    label: '地址',
    require: false
}, {
    key: 'contact',
    label: '联系信息',
    type: 'textarea',
    require: false
}];
var ERROR = {
    text: '错误',
    unknown: '未知错误',
    transport: '传输错误'
};

var Client = React.createClass({
    displayName: 'Client',

    getDefaultProps: function getDefaultProps() {
        return {
            schema: CLIENT_SCHEMA,
            tableAdmin: true,
            tableIndex: true,
            dao: new _DAO2.default('/clientServer')
        };
    },
    getInitialState: function getInitialState() {
        this._initAjax();
        return {
            client: this._getEmptyClient(),
            status: '',
            showModal: false,
            dialog: {},
            data: [{ id: 1, code: '001', name: 'test1', address: 'address1', contact: 'contact1' }, { id: 2, code: '002', name: 'test2', address: 'address2', contact: 'contact2' }]
        };
    },
    _notificationSystem: null,
    _dialog: null,
    _initAjax: function _initAjax() {
        var self = this;
        $.ajaxSetup({
            method: 'json',
            dataFilter: function dataFilter(rsp, settings) {
                if (rsp.success) {
                    return rsp.data;
                } else {
                    self._addNotification({
                        title: ERROR.text,
                        message: rsp.message,
                        level: 'error'
                    });
                }
            },
            error: function error(jqXHR) {
                console.log(jqXHR);
                self._addNotification({
                    title: ERROR.text,
                    message: ERROR.transport,
                    level: 'error'
                });
            }
        });
    },
    _addNotification: function _addNotification(notification) {
        this._notificationSystem.addNotification(notification);
    },
    _getEmptyClient: function _getEmptyClient() {
        var client = {};
        CLIENT_SCHEMA.forEach(function (key) {
            return client[key.key] = '';
        });
        return client;
    },
    _editClient: function _editClient(client) {
        this.setState({ client: client, status: 'edit', showModal: true });
    },
    _deleteClient: function _deleteClient(client) {
        var dao = this.props.dao;

        this._dialog.confirm('Are you sure to remove the client' + client.name + ' which could not recover?', function () {
            dao.delete(client.id);
        });
    },
    _addClient: function _addClient() {
        var client = this._getEmptyClient();
        this.setState({ client: client, status: 'add', showModal: true });
    },
    _confirm: function _confirm() {
        var _state = this.state;
        var status = _state.status;
        var client = _state.client;
        var dao = this.props.dao;

        if (status === 'add') {
            dao.create(client);
        } else if (status === 'edit') {
            dao.update(client);
        }
        this.setState({ showModal: false });
    },
    _cancel: function _cancel() {
        this.setState({ showModal: false });
    },
    _validate: function _validate(header) {
        if (header.require && this.state.client[header.key].length === 0) {
            return 'error';
        }
        return 'success';
    },
    _handleChange: function _handleChange(header) {
        var client = this.state.client;

        var key = header.key;
        client[key] = this.refs[key].getValue();
        this.setState({ client: client });
    },
    componentDidMount: function componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
        this._dialog = this.refs.dialog;
    },
    render: function render() {
        var _this = this;

        var _props = this.props;
        var schema = _props.schema;
        var tableAdmin = _props.tableAdmin;
        var tableIndex = _props.tableIndex;
        var _state2 = this.state;
        var client = _state2.client;
        var data = _state2.data;
        var status = _state2.status;
        var showModal = _state2.showModal;
        var dialog = _state2.dialog;

        var inputNodes = schema.map(function (header, index) {
            return React.createElement(_reactBootstrap.Input, { key: index,
                type: header.type || 'text',
                value: client[header.key],
                placeholder: header.label,
                label: (header.require ? '*' : '') + header.label + ':',
                labelClassName: 'col-md-2',
                ref: header.key,
                wrapperClassName: 'col-md-10',
                bsStyle: _this._validate(header),
                onChange: function onChange() {
                    return _this._handleChange(header);
                } });
        });

        return React.createElement(
            'div',
            { className: 'container' },
            React.createElement(
                'div',
                { className: 'page-header row' },
                React.createElement(
                    'div',
                    { className: 'col-lg-2' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-block btn-success', onClick: this._addClient },
                        React.createElement('span', { className: 'glyphicon glyphicon-plus' }),
                        '添加客户'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-lg-10 page-title' },
                    'Client Management'
                )
            ),
            React.createElement(_Table.ManageTable, { schema: schema,
                data: data,
                editRow: this._editClient,
                deleteRow: this._deleteClient,
                tableAdmin: tableAdmin,
                tableIndex: tableIndex }),
            React.createElement(
                _reactBootstrap.Modal,
                { show: showModal,
                    onHide: this._cancel },
                React.createElement(
                    _reactBootstrap.Modal.Header,
                    { closeButton: true },
                    React.createElement(
                        _reactBootstrap.Modal.Title,
                        null,
                        status === 'add' ? '添加客户' : '编辑客户'
                    )
                ),
                React.createElement(
                    _reactBootstrap.Modal.Body,
                    null,
                    React.createElement(
                        'div',
                        { className: 'form-horizontal' },
                        inputNodes
                    )
                ),
                React.createElement(
                    _reactBootstrap.Modal.Footer,
                    null,
                    React.createElement(
                        _reactBootstrap.Button,
                        { onClick: this._cancel },
                        '取消'
                    ),
                    React.createElement(
                        _reactBootstrap.Button,
                        { bsStyle: 'primary', onClick: this._confirm },
                        '确认'
                    )
                )
            ),
            React.createElement(_reactNotificationSystem2.default, { ref: 'notificationSystem' }),
            React.createElement(_Dialog.Dialog, { ref: 'dialog', dialog: dialog })
        );
    }
});

ReactDOM.render(React.createElement(Client, null), $('#body').get(0));

//# sourceMappingURL=Client.js.map