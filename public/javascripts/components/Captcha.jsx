/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

const CHARS = ['3','4','5','6','7','a','b','c','d','e','f','h','i','j','k','m','n','p','r','s','t','u','v','w','x','y'];

export let CaptchaModel = class {
    constructor() {
        this._charNum = 4;
        this._content = this._randomChars(this._charNum);
    }

    get content() {
        return this._content ? this._content.join('') : '';
    }

    get chars() {
        return this._content;
    }

    _randomChars(num) {
        const l = CHARS.length;
        let chars = [],
            r;
        for(let i = 0; i < num; i++) {
            r = Math.floor(Math.random() * l);
            chars.push(CHARS[r]);
        }

        return chars;
    }


    check(str) {
        return str === this.content;
    }

    refresh() {
        this._content = this._randomChars(this._charNum);
        return this._content;
    }
}

let CaptchaView = React.createClass({
    getDefaultProps() {
        return {
            width: 100,
            height: 40,
            color: 'white',
            bgColor: 'rgba(230, 230, 230, 0.2)'
        };
    },

    getInitialState() {
        return {
            content: this.props.captcha.chars
        };
    },

    _setContent() {
        const { color, bgColor, width, height } = this.props,
            { ctx, content } = this.state;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this._drawChars(ctx, content);
    },

    _setCanvas() {
        const { width, height } = this.props,
            canvas = this.refs.canvas;
        canvas.width = width;
        canvas.height = height;
    },

    componentDidMount() {
        this._setCanvas();
        let ctx = this.refs.canvas.getContext('2d');
        this.state.ctx = ctx;

        this._setContent();
    },

    componentDidUpdate() {
        console.log('The captcha is updated');
        this._setCanvas();
        this._setContent();
    },

    _randomAngle() {
        const angle = Math.PI / 4;
        return Math.random() * angle * 2 - angle;
    },

    _randomColorDimension() {
        return Math.floor(Math.random() * 200);
    },

    _randomColor() {
        let r = this._randomColorDimension(),
            g = this._randomColorDimension(),
            b = this._randomColorDimension();
        return `rgb(${r}, ${g}, ${b})`;
    },

    _xOffset() {
        return 10 * Math.random() - 5;
    },

    _yOffset() {
        return 10 * Math.random() - 5;
    },

    _drawChar(ctx, char, x, y) {
        const angle = this._randomAngle();
        x += this._xOffset();
        y += this._yOffset();

        ctx.translate(x, y);
        ctx.rotate(angle);
        const color = this._randomColor();
        ctx.fillStyle = color;
        ctx.fillText(char, 0, 0);
        ctx.rotate(-angle);
        ctx.translate(-x, -y);
    },

    _drawChars(ctx, chars) {
        const { width, height } = this.props,
            len = chars.length;
        let cWidth = width / len,
            self = this;
        chars.forEach((char, i) => {
            let x = (i + 0.5) * cWidth,
                y = height / 2;
            self._drawChar(ctx, char, x, y);
        });
    },

    refresh() {
        let content = this.props.captcha.refresh();
        this.setState({
            content
        });
    },

    render() {
        let style = Object.assign({cursor: 'pointer'}, this.props.style);

        return (
            <canvas ref = 'canvas'
                    style = {style}
                    onClick = {this.refresh}></canvas>
        );
    }
});

const state2Props = state => {
    let { captcha } = state;
    return {
        captcha
    };
}

let Captcha = connect(state2Props)(CaptchaView);

exports.Captcha = Captcha;
