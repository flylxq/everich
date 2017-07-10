/**
 * Created by flylxq on 16/10/26.
 */
'use strict';

import * as React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import LogicalSelector from './components/LogicalSelector.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import AddIcon from 'material-ui/svg-icons/content/add';
import OutputIcon from 'material-ui/svg-icons/file/file-download';
import Snackbar from 'material-ui/Snackbar';
import { EditDialog, FieldType } from './components/EditDialog.jsx';
import { DAO } from '../public/javascripts/controller/DAO';
import { ManageTable } from './components/Table';
import moment from 'moment';

const KEYS = [
    {
        key: 'admin',
        label: 'admin',
        width: 200,
        editable: false
    },
    {
        key: 'index',
        label: 'No.',
        width: 30,
        editable: false
    },
    {
        key: 'P_ID',
        editable: false,
        show: false
    },
    {
        key: 'P_VALID_DATE',
        label: 'Valid Date',
        type: 'YYYY-MM-DD',
        width: 100,
        required: true,
        editType: FieldType.HALF
    },
    {
        key: 'P_NAME_KP',
        label: '开票名',
        width: 200,
        required: true,
        editType: FieldType.HALF
    },
    {
        key: 'P_NAME',
        label: '下单名',
        width: 200,
        required: true
    },
    {
        key: 'P_NAME_EN',
        label: '描述',
        width: 200,
        required: true
    },
    {
        key: 'P_LOCALCODE',
        label: 'Local Code',
        width: 100,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_HSCODE',
        label: 'HSCode',
        width: 100,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_TYPE',
        label: '类型',
        width: 50,
        editType: FieldType.QUOTER,
        type: 'selector'
    },
    {
        key: 'P_CHECK',
        label: 'Check',
        width: 50,
        editType: FieldType.QUOTER,
        required: true,
        type: 'switcher'
    },
    {
        key: 'P_UNIT',
        label: '单位',
        width: 50,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_UNIT_CN',
        label: '单位(中)',
        width: 50,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_PRICE',
        label: '价格(RMB)',
        width: 50,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_DRAWBACK_RATE',
        label: '退税率',
        width: 50,
        editType: FieldType.QUOTER
    },
    {
        key: 'P_PRICE_D',
        label: '价格(USD)',
        width: 50,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_WEIGHT_N',
        label: '净重',
        width: 50,
        editType: FieldType.QUOTER,
        required: true
    },
    {
        key: 'P_FACTORY_ID',
        label: '工厂',
        width: 150,
        required: true,
        editType: FieldType.HALF
    },
    {
        key: 'P_INTRO',
        label: '简介',
        show: false,
        editType: FieldType.AREA
    }
];


export default class Products extends React.Component {
    constructor(props) {
        super(props);
        this.dao = new DAO('/data/products', this.queryError);
    }

    state = {
        localCode: '',
        reload: false,
        selector1: LogicalSelector.values.or,
        validDate: undefined,
        activePage: 0,
        pages: 20,
        loading: false,
        products: [],
        editIndex: -1,
        editDialogOpen: false,
        dialogMode: null,
        snackOpen: false,
        snackMsg: ''
    };

    _handleState = (key, value) => {
        console.log(`Set state ${key} to ${value}.`);
        let state = {};
        state[key] = value;
        this.setState(state);
    }

    _handleSnackClose = () => {
        this.setState({
            snackOpen: false
        });
    }

    _handleEdit = (key, value) => {
        console.log(`Set edit value for ${key} to ${value}`);
    }

    _handleDialogClose = () => {
        this.setState({
            editIndex: -1,
            editDialogOpen: false
        });
    }

    _handleEditBtn = (index) => {
        this.setState({
            editIndex: index,
            editDialogOpen: true
        });
    }

    _handleDeleteBtn = (index) => {

    }

    _handleAddBtn = () => {
        this.setState({
            editIndex: -1,
            editDialogOpen: true
        });
    }

    _handleOutputBtn = () => {
        console.log('Output button is clicked.');
    }

    _getData = () => {
        let self = this;
        const { activePage } = this.state;
        this.setState({
            loading: true
        });
        this.dao.query({pageIndex: activePage}, 'POST', '/data/products').then(rsp => {
            let { list, pages } = rsp.data;
            self.setState({
                products: list,
                pages: pages,
                loading: false,
                reload: false
            });
        });
    };

    queryError = (msg) => {
        this.setState({
            snackOpen: true,
            snackMsg: typeof msg === 'string' ? msg : JSON.stringify(msg),
            loading: false,
            reload: false
        });
    };

    _submit = (product) => {
        console.log(`Submit the product of ${JSON.stringify(product)} to server.`);
        let self = this;
        self.setState({
            loading: true
        });
        this.dao.query(product, 'POST', '/data/product/add').then(rsp => {
            let state = {
                loading: false,
                reload: true
            };
            self.setState(state);
        });
    }

    componentDidMount() {
        this._getData();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.activePage !== this.state.activePage) {
            console.log(`Page index is from ${prevState.activePage} to ${this.state.activePage}.`);
            this._getData();
        } else if(this.state.reloadPage) {
            this._getData(true);
        }
    }

    render() {
        const { localCode, validDate, activePage, pages, snackOpen, snackMsg,
            products, editDialogOpen, editIndex, loading } = this.state;
        let editProduct = products[editIndex];
        const fieldStyle = {
                width: '150px',
                marginTop: '5px'
            },
            btnStyle = {
                width: '120px'
            };
        let width = KEYS.reduce((sum, item) => (item.width ? item.width + 24 + sum : sum), 0);
        return (
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Toolbar style = {{flex: '0 0 56px', width: '100%', backgroundColor: 'rgba(239, 239, 239, .6)'}}>
                    <ToolbarGroup>
                        <ToolbarTitle text = 'Cargo' style = {{color: '#525252'}} />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <TextField hintText = 'Local Code'
                                   style = {fieldStyle}
                                   value = {localCode}
                                   onChange = {e => this._handleState('localCode', e.target.value)} />
                        <LogicalSelector setValue = {value => this._handleState('selector1', value)} />
                        <DatePicker hintText = 'Valid Date'
                                    defaultDate = {validDate}
                                    onChange = {(e, date) => this._handleState('validDate', date)}
                                    style = {fieldStyle}
                                    textFieldStyle = {{width: fieldStyle.width}}
                                    container = 'inline' />
                        <RaisedButton label = 'Search'
                                      icon = {<SearchIcon />}
                                      style = {btnStyle} />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarSeparator />
                        <RaisedButton primary = {true}
                                      label = 'add'
                                      icon = {<AddIcon />}
                                      style = {btnStyle}
                                      onClick = {this._handleAddBtn} />
                        <RaisedButton primary = {true}
                                      label = 'output'
                                      icon = {<OutputIcon />}
                                      style = {btnStyle}
                                      onClick = {this._handleOutputBtn} />
                    </ToolbarGroup>
                </Toolbar>
                <ManageTable pages={pages}
                             activePage = {activePage}
                             setPage = {key => this._handleState('activePage', key)}
                             data={products}
                             schema={KEYS}
                             editRow={this._handleEditBtn}
                             deleteRow={this._handleDeleteBtn}
                             dataAdmin={true}
                             tableIndex={true}
                             styleColor={'#525252'} />
                <EditDialog data = {editProduct}
                            open = {editDialogOpen}
                            keys = {KEYS}
                            close = {this._handleDialogClose}
                            submit = {this._submit} />
                <Snackbar open = {snackOpen}
                          message = {snackMsg}
                          autoHideDuration = {5000}
                          onRequestClose = {this._handleSnackClose} />
            </div>
        )
    }
}