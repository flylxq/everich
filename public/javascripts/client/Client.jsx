/**
 *
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import DAO from '../controller/DAO'
import { ManageTable } from '../components/Table'
import { Button, Input, Modal } from 'react-bootstrap'
import NotificationSystem from 'react-notification-system'

require('../../stylesheets/client.scss')

/**
 * key: key's name in source table
 * label: key's show text
 * require: whether the key is required, default is false
 * type: key's type for input, default is text
 * @type {*[]}
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
}]
var ERROR = {
    text: '错误',
    unknown: '未知错误',
    transport: '传输错误'
}

let Client = React.createClass({
    getDefaultProps: function() {
        return {
            schema: CLIENT_SCHEMA,
            tableAdmin: true,
            tableIndex: true,
            dao: new DAO('/clientServer')
        }
    },
    getInitialState: function() {
        this._initAjax()
        return {
            client: this._getEmptyClient(),
            status: '',
            showModal: false,
            data: [{id: 1, code: '001', name: 'test1', address: 'address1', contact: 'contact1'},{id: 2, code: '002', name: 'test2', address: 'address2', contact: 'contact2'},]
        }
    },
    _notificationSystem: null,
    _initAjax: function() {
        let self = this
        $.ajaxSetup({
            method: 'json',
            dataFilter: function(rsp, settings) {
                if(rsp.success) {
                    return rsp.data;
                } else {
                    self._addNotification({
                        title: ERROR.text,
                        message: rsp.message,
                        level: 'error'
                    })
                }
            },
            error: function(jqXHR){
                console.log(jqXHR);
                self._addNotification({
                    title: ERROR.text,
                    message: ERROR.transport,
                    level: 'error'
                })
            }
        })
    },
    _addNotification: function(notification) {
        this._notificationSystem.addNotification(notification)
    },
    _getEmptyClient: function() {
        let client = {}
        CLIENT_SCHEMA.forEach(key => client[key.key] = '')
        return client
    },
    _editClient: function(client) {
        this.setState({client: client, status: 'edit', showModal: true})
    },
    _deleteClient: function(client) {
        let { dao } = this.props
        dao.delete(client.id)
    },
    _addClient: function() {
        let client = this._getEmptyClient()
        this.setState({client: client, status: 'add', showModal: true})
    },
    _confirm: function() {
        let { status, client } = this.state
        let { dao } = this.props
        if(status === 'add') {
            dao.create(client)
        } else if(status === 'edit') {
            dao.update(client)
        }
        this.setState({showModal: false})
    },
    _cancel: function() {
        this.setState({showModal: false})
    },
    _validate: function(header) {
        if(header.require && this.state.client[header.key].length === 0) {
            return 'error'
        }
        return 'success'
    },
    _handleChange: function(header) {
        let { client } = this.state
        let key = header.key
        client[key] = this.refs[key].getValue()
        this.setState({client: client})
    },
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem
    },
    render: function() {
        let { schema, tableAdmin, tableIndex } = this.props
        let { client, data, status, showModal } = this.state

        let inputNodes = schema.map((header, index) => (
            <Input key = {index}
                   type = {header.type || 'text'}
                   value = {client[header.key]}
                   placeholder = {header.label}
                   label = {(header.require ? '*' : '') + header.label + ':'}
                   labelClassName = 'col-md-2'
                   ref = {header.key}
                   wrapperClassName = 'col-md-10'
                   bsStyle = {this._validate(header)}
                   onChange = {() => this._handleChange(header)}></Input>
        ))

        return (
            <div className = 'container'>
                <div className = 'page-header row'>
                    <div className = 'col-lg-2'>
                        <button className = 'btn btn-block btn-success' onClick = {this._addClient}>
                            <span className = 'glyphicon glyphicon-plus'></span>
                            添加客户
                        </button>
                    </div>
                    <div className = 'col-lg-10 page-title'>
                        Client Management
                    </div>
                </div>
                <ManageTable schema = {schema}
                       data = {data}
                       editRow = {this._editClient}
                       deleteRow = {this._deleteClient}
                       tableAdmin = {tableAdmin}
                       tableIndex = {tableIndex}></ManageTable>
                <Modal show = {showModal}
                       onHide = {this._cancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>{status === 'add' ? '添加客户' : '编辑客户'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className = 'form-horizontal'>
                            {inputNodes}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsSize = 'medium' onClick = {this._cancel}>取消</Button>
                        <Button bsSize = 'medium' bsStyle = 'primary' onClick = {this._confirm}>确认</Button>
                    </Modal.Footer>
                </Modal>
                <NotificationSystem ref = 'notificationSystem'></NotificationSystem>
            </div>
        )
    }
})

ReactDOM.render(
    <Client></Client>,
    $('#body').get(0)
)
