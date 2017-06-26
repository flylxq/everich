/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { Captcha, CaptchaModel } from '../components/Captcha.jsx';
import { Cookie } from '../../../common/Cookie';
import LoginStates from './reduers';
import { connect } from 'react-redux';
import { red800, green800 } from 'material-ui/styles/colors';

require('../../stylesheets/login.scss');

let CheckTextField = React.createClass({
    getDefaultProps() {
        return {
            type: 'text',
            errText: 'This is required'
        };
    },

    getInitialState() {
        return {
            check: null,
            value: ''
        };
    },

    _setValue(event) {
        let value = event.target.value;
        this.props.setValue(value);
        this.state.value = value;
    },

    check() {
        let { captcha } = this.props,
            { value } = this.state;
        let check = captcha ? captcha.check(value) : value !== '';
        this.setState({
            check
        });
        return check;
    },

    _reset() {
        this.setState({
            check: null
        });
    },

    render() {
        const { type, correct, style, errText, captcha, hintText } = this.props,
            { check } = this.state;
        let errorText = check !== false ? null : errText,
            color = red800;
        if(captcha) {
            if(check) {
                errorText = 'Correct';
                color = green800;
            } else if(check === false) {
                errorText = 'Please input correct numbers in the left image.';
            }
        }

        let errorStyle = {
            color
        };

        return (
            <TextField type = {type}
                       hintText = {hintText}
                       fullWidth = {true}
                       style = {style || {}}
                       errorText = {errorText}
                       errorStyle = {errorStyle}
                       onFocus = {this._reset}
                       onChange = {this._setValue}
                       onBlur = {this.check}/>
        );
    }
});

let LoginView = React.createClass({
    getInitialState() {
        return {
            errorText: null
        };
    },

    _setUser(user) {
        this.state.user = user;
    },

    _checkUser(user) {
        return user !== '';
    },

    _setPassword(password) {
        this.state.password = password;
    },

    _checkPassword(password) {
        return password !== '';
    },

    _setCaptcha(captcha) {
        this.state.captcha = captcha;
    },

    _checkCaptcha(captcha) {
        return this.props.captcha.check(captcha);
    },

    _login() {
        const { user, password } = this.state;
        let self = this;
        $.ajax({
            url: '/login/checkUser',
            method: 'GET',
            dataType: 'json',
            data: { username: user, password },
            success: (rsp) => {
                let result = rsp.data;
                if(result.length === 0) {
                    self.setState({
                        errorText: 'The user is not existing or password is wrong.'
                    });
                    return;
                }

                window.location = '/index';
            }
        });
    },

    _handleKeyPress(event) {
        const { charCode } = event;
        if(charCode === 13) {
            const { username, password, captchaInput } = this.refs;
            let usernameCheck = username.check();
            let passwordCheck = password.check();
            let captchaCheck = captchaInput.check();
            if(usernameCheck && passwordCheck && captchaCheck) {
                this._login();
            } else {
                return;
            }
        }
    },

    render() {
        let { captcha } = this.props,
            { errorText } = this.state;

        return (
            <div className = 'main-container' onKeyPress = {this._handleKeyPress}>
                <Paper zDepth = {2} id = 'login-container'>
                    <div className = 'login-header'>EVERICH INFO</div>
                    <div className = 'login-sub-header'>Log in</div>
                    <div className = 'form-horizontal'>
                        <div className = 'form-group'>
                            <label className = 'field-label'>User:</label>
                            <CheckTextField style = {{width: '60%'}}
                                            hintText = 'User name'
                                            ref = 'username'
                                            setValue = {this._setUser} />
                        </div>
                        <div className = 'form-group'>
                            <label className = 'field-label'>Password:</label>
                            <CheckTextField style = {{width: '60%'}}
                                            type = 'password'
                                            hintText = 'Password'
                                            ref = 'password'
                                            setValue = {this._setPassword} />
                        </div>
                        <div className = 'form-group'>
                            <label className = 'field-label' >Captcha:</label>
                            <CheckTextField style = {{width: '60%'}}
                                            hintText = 'Captcha'
                                            ref = 'captchaInput'
                                            setValue = {this._setCaptcha}
                                            captcha = {captcha} />
                            <div style = {{width: '20%'}}>
                                <Captcha ref = 'captcha' />
                            </div>
                        </div>
                        <div className = 'form-group'>
                            <div className = 'control-offset' style = {{color: red800, width: '60%', height: '20px'}}>
                                {errorText || ""}
                            </div>
                        </div>
                        <div className = 'form-group'>
                            <div className = 'control-offset' style = {{width: '60%'}}>
                                <RaisedButton primary = {true}
                                              label = "LOG IN"
                                              fullWidth = {true}
                                              onClick = {this._login} />
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
});

const state2props = state => {
    const { captcha } = state;
    return {
        captcha
    };
};
let Login = connect(state2props)(LoginView);

const LoginApp = () => (
    <MuiThemeProvider>
        <Login />
    </MuiThemeProvider>
);


let captcha = new CaptchaModel(),
    cookie = new Cookie();
let store = createStore(LoginStates, { captcha, cookie });

ReactDOM.render(
    <Provider store = {store}>
        <LoginApp />
    </Provider>,
    $('#body').get(0)
);


