/**
 * Created by flylxq on 16/10/26.
 */
'use strict';

import * as React from 'react';
import * as ReactPagination from 'react-paginate';

require('../../public/stylesheets/pagination.scss');

export default class Pagination extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { pageNum, pageMargin, pageRange, activePage, setPage } = this.props;
        return <ReactPagination pageCount = {pageNum || 1}
                                initialPage = {0}
                                forcePage={activePage}
                                pageRangeDisplayed = {pageRange || 5}
                                marginPagesDisplayed = {pageMargin || 1}
                                containerClassName = 'pagination'
                                pageClassName = 'pag-item'
                                activeClassName = 'page-active'
                                onPageChange = {data => setPage(data.selected)} />
    }
}