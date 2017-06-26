/**
 * Created by flylxq on 16/10/26.
 */
'use strict';

import React, { Component } from 'react';
import ReactPagination from 'react-paginate';

require('../../public/stylesheets/pagination.scss');

export default class Pagination extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { pageNum, pageMargin, pageRange, activePage, setPage } = this.props;
        return <ReactPagination pageNum = {pageNum || 1}
                                initialSelected = {activePage || 0}
                                pageRangeDisplayed = {pageRange || 5}
                                marginPagesDisplayed = {pageMargin || 1}
                                containerClassName = 'pagination'
                                pageClassName = 'pag-item'
                                activeClassName = 'page-active'
                                clickCallback = {data => setPage(data.selected)} />
    }
}