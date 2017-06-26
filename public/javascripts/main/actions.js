/**
 * Created by flylxq on 16/9/24.
 */
'use strict';

export const SET_USERNAME = 'SET_USERNAME';
export function setUsername(username) {
    return {
        type: SET_USERNAME,
        payload: username
    };
};

export const SET_PASSWORD = 'SET_PASSWORD';
export function setPassword(password) {
    return {
        type: SET_PASSWORD,
        payload: password
    };
};

export const SET_CAPTCHA = 'SET_CAPTCHA';
export function setCaptcha(captcha) {
    return {
        type: SET_CAPTCHA,
        payload: captcha
    };
};
