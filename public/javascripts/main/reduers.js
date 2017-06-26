/**
 * Created by flylxq on 16/9/24.
 */
'use strict';

import { combineReducers } from 'redux';
import { SET_USERNAME, SET_PASSWORD, SET_CAPTCHA } from './actions';

function captcha(state = '', action) {
    switch(action.type) {
        case SET_CAPTCHA:
            return action.payload;
        default:
            return state;
    }
};

function cookie(state = '', action) {
    return state;
}

const LoginStates = combineReducers({
    captcha,
    cookie
});

export default LoginStates;
