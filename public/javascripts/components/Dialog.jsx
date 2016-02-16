/**
 *
 */

import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'

export let Dialog = React.createClass({
    getInitialState: function(){
        let { show, message, type, callback } = this.props.dialog
        return {
            show: show || false,
            message: message || '',
            type: type || 'alert',
            callback: callback || null
        }
    },
    alert: function(message, callback) {
        this.setState({
            show: true,
            message: message,
            type: 'alert',
            callback: callback
        })
    },
    confirm: function(message, callback) {
        this.setState({
            show: true,
            message: message,
            type: 'confirm',
            callback: callback
        })
    },
    _confirm: function() {
        this.state.callback()
        this.setState({show: false})
    },
    _cancel: function() {
        this.setState({show: false})
    },
    componentDidMount: function() {
        var self = this;
        $(window).on('keypress', function(event){
            if(self.state.show && event.keyCode === 13) {
                self._confirm();
            }
        })
    },
    render: function() {
        let { show, type, message } = this.state
        let cancelNode = type === 'confirm' ? (<Button onClick = {this._cancel}>取消</Button>) : null
        return (
            <Modal show = {show}
                   backdrop = 'static'
                   enforceFocus
                   keyboard = {false}>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button bsStyle = 'primary' onClick = {this._confirm}>确认</Button>
                    {cancelNode}
                </Modal.Footer>
            </Modal>
        )
    }
})
