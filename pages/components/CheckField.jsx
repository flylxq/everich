/**
 * Created by Xiaoqing Liu at 2016-11-07
 */

import React, { Component } from 'react';
import { red800 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';

export default class CheckTextField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            check: null
        }
    }

    check = () => {
        this.setState({
            check: this.props.value !== ''
        });
    }

    _reset = () => {
        this.setState({
            check: null
        });
    }

    render() {
        let props = Object.assign({}, this.props),
            { check } = this.state;

        if (check !== false) {
            props.errorText = null;
        }

        return (
            <TextField {...props}
                       onFocus = {this._reset}
                       onBlur = {this.check}/>
        );
    }
};

CheckTextField.defaultProps = {
    type: 'text',
    errorText: 'This is required',
    errorStyle: {
        color: red800
    }
};