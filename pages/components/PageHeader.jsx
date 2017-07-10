/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

import * as React from 'react';

let PageHeader = React.createClass({
    render() {
        const { header, color } = this.props;
        let style = {

        };
        return (
            <div className = 'page-header'>{header}</div>
        );
    }
});