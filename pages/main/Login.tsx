/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { Captcha, CaptchaModel } from '../components/Captcha.jsx';
import { Cookie } from '../../common/Cookie';
import LoginStates from '../../public/javascripts/main/reduers.js';
import { connect } from 'react-redux';
import { red800, green800 } from 'material-ui/styles/colors';
import * as moment from 'moment';
import * as crypto from 'crypto';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

require('../../public/stylesheets/login.scss');


class CheckTextField extends React.Component<any, any> {
    public static defaultProps = {
        type: 'text',
        errText: 'Required'
    };

    constructor(props: any) {
        super(props);
    }

    render() {
        const { type, correct, style, errText, captcha, hintText, check, blur, keyword: key, setValue, reset } = this.props;
        let errorText = check !== false ? null : errText,
            color = red800;
        if(captcha) {
            if(check) {
                errorText = 'Correct';
                color = green800;
            } else if(check === false) {
                errorText = 'Please input correct numbers in the image.';
            }
        }

        let errorStyle = {
            color
        };

        return (
            <TextField type = {type}
                       hintText = {hintText}
                       floatingLabelText={hintText}
                       fullWidth = {true}
                       style = {style || {}}
                       errorText = {errorText}
                       errorStyle = {errorStyle}
                       onFocus = {() => reset(key)}
                       onChange = {(e: any) => setValue(key, e.target.value)}
                       onBlur = {() => blur(key)} />
        );
    }
}

class LoginView extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: null,
            password: null,
            captcha: null,
            errorText: null,
            usernameCheck: null,
            passwordCheck: null,
            captchaCheck: null
        };
    }

    private setValue = (key: string, value: string) => {
        this.setState({
            [key]: value
        });
    }

    static md5(str: string) {
        return crypto.createHash('md5').update(str).digest('hex');
    }

    private login = () => {
        const {username, password} = this.state;
        const {cookie} = this.props;
        fetch(`/checkUser?username=${username}&password=${LoginView.md5(password)}`)
            .then(rsp => rsp.json())
            .then(rsp => {
                const {UID: uid, power, username} = rsp.data;
                const expireDate = moment().add(30, 'days').utc();
                cookie.setItem('uid', uid, expireDate);
                cookie.setItem('power', power, expireDate);
                cookie.setItem('username', username, expireDate);
                console.log('cookie:', document.cookie);
                window.location.replace(`/index`);
            });
    }

    private handleKeyPress(event) {
        const {charCode} = event;
        if (charCode === 13) {
            const {usernameCheck, passwordCheck, captchaCheck} = this.state;
            if (usernameCheck && passwordCheck && captchaCheck) {
                this.login();
            } else {
                return;
            }
        }
    }

    private check = (key: string, captcha?: any) => {
        let value = this.state[key];
        let check = captcha ? captcha.check(value) : value !== '';
        this.setState({
            [key + "Check"]: check
        });
    }

    private reset = (key: string) => {
        this.setState({
            [key + "Check"]: null
        });
    }

    render() {
        let {captcha} = this.props,
            {errorText, usernameCheck, passwordCheck, captchaCheck, username, password: p, captcha: c} = this.state;

        return (
            <div className='main-container'
                 style={{
                     boxSizing: 'border-box',
                     paddingBottom: '10%'
                 }}
                 onKeyPress={this.handleKeyPress}>
                <Paper zDepth={4}
                       id='login-container'
                       style={{padding: '20px 10px'}}>
                    <div className='login-header'>EVERICH</div>
                    <div className='form-horizontal'>
                        <div className='form-group'>
                            <CheckTextField hintText='User name'
                                            keyword="username"
                                            blur={this.check}
                                            reset={this.reset}
                                            check={usernameCheck}
                                            value={username}
                                            setValue={this.setValue}/>
                        </div>
                        <div className='form-group'>
                            <CheckTextField type='password'
                                            hintText='Password'
                                            keyword="password"
                                            blur={this.check}
                                            reset={this.reset}
                                            check={passwordCheck}
                                            value={p}
                                            setValue={this.setValue}/>
                        </div>
                        <div className='form-group'>
                            <CheckTextField style={{flexGrow: 1, flexShrink: 1}}
                                            hintText='Captcha'
                                            keyword="captcha"
                                            blur={key => this.check(key, captcha)}
                                            reset={this.reset}
                                            check={captchaCheck}
                                            value={c}
                                            setValue={this.setValue}
                                            captcha={captcha}/>
                            <div style={{flex: '100px 0 0'}}>
                                <Captcha />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='control-offset' style={{color: red800, width: '60%', height: '20px'}}>
                                {errorText || ""}
                            </div>
                        </div>
                        <div className='form-group' style={{justifyContent: 'center'}}>
                            <RaisedButton style={{width: '60%'}}
                                          primary={true}
                                          label="LOG IN"
                                          onClick={this.login}/>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}

const state2props = state => {
    const { captcha, cookie } = state;
    return {
        captcha,
        cookie
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
    document.querySelector('#body')
);


