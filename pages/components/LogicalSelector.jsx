/**
 * Created by flylxq on 16/10/26.
 */
'use strict';

import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const VALUE = {
    and: 'and',
    or: 'or'
};

export default class LogicalSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        value: this.props.value || VALUE.and
    };

    static values = VALUE;

    _setValue = (e, index, value) => {
        this.setState({value});
        let { setValue } = this.props;
        setValue && setValue(value);
    };

    render() {
        const { value } = this.state,
            { underlineStyle } = this.props;
        return (
            <SelectField value = {value}
                         onChange = {this._setValue}
                         style = {{width: '50px', margin: '5px 15px'}}
                         underlineStyle = {underlineStyle || {}} >
                <MenuItem value = {VALUE.and} primaryText = "and" />
                <MenuItem value = {VALUE.or} primaryText = "or" />
            </SelectField>
        );
    }
}