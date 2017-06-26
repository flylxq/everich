/**
 * Created by flylxq on 16/10/26.
 */
'use strict';

import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CheckField from './CheckField.jsx';

const DIALOG_MODE = {
    edit: 'edit',
    delete: 'add'
};

const FieldType = {
    QUOTER: 0.25,
    HALF: 0.5,
    FULL: 1,
    AREA: 1
};

const TypeOptions = {
    O: 'O',
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D'
};

const CheckOptions = ['是', '否'];

exports.FieldType = FieldType;

class EditDialog extends React.Component {
    constructor(props) {
        super(props);

        const { data } = props;
        this.state = {
            mode: this._getMode(data),
            data: data || this._getEmpty()
        };
    }

    _getEmpty = () => {
        const { keys } = this.props;
        let data = {};
        keys.forEach(item => {
            let { editType, editable, key, type } = item;
            if(editable === false || editType === null) {
                return;
            }

            switch(type) {
                case 'YYYY-MM-DD':
                    data[key] = null;
                    break;
                case 'switcher':
                    data[key] = CheckOptions[0];
                    break;
                case 'selector':
                    data[key] = TypeOptions.O;
                    break;
                default:
                    data[key] = '';
            }
        });

        return data;
    }

    _handleClose = () => {
        let { close } = this.props;
        close();
    }

    _handleSubmitBtn = () => {
        const { submit } = this.props,
            { data } = this.state;
        submit(data);
    }

    _handleEdit = (key, value, index) => {
        // let value = e.target.value;
        console.log(`Handle edit in edit dialog set ${key} to ${value}.`);
        this.state.data[key] = value;
    }

    _getMode = (data) => {
        return data ? DIALOG_MODE.edit : DIALOG_MODE.add;
    }

    componentWillReceiveProps(nextProps) {
        let { data } = nextProps;
        this.setState({
            mode: this._getMode(data),
            data: data || this._getEmpty()
        });
    }

    render() {
        const { keys, open } = this.props,
            { mode, data } = this.state;
        let dialogLabel = mode === DIALOG_MODE.edit ? '修改' : '添加',
            btnStyle = {
                width: '150px',
                margin: '0 10px'
            };
        let rows = [];
        keys.forEach((item, index) => {
            item.index = index;
            const { editable, editType } = item;
            if(editable === false || editType === null) {
                return;
            }

            switch(editType) {
                case FieldType.QUOTER:
                case FieldType.HALF:
                    let insert = rows.some(row => {
                        if (1 - row.width >= editType) {
                            row.items.push(item);
                            row.width += editType;
                            return true;
                        }
                    });

                    insert || rows.push({items: [item], width: editType});
                    break;
                case FieldType.AREA:
                case FieldType.FULL:
                default:
                    rows.push({items: [item], width: 1});
                    break;
            }
        });
        let nodes = rows.map((row, i) => (
            <div key = {i} className = 'dialog-row' style = {{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                {row.items.map(item => {
                    const { label, key, editable, editType, type, index, required }  = item;
                    if (editable === false || editType === null) {
                        return null;
                    }

                    let props = {
                        hintText: label,
                        floatingLabelText: label,
                        defaultValue: data[key],
                        onChange: e => this._handleEdit(key, e.target.value, index),
                        style: { margin: '0 10px'}
                    };
                    switch(editType) {
                        case FieldType.AREA:
                            props.style.width = '90%';
                            props.multiLine = true;
                            props.rows = 5;
                            break;
                        case FieldType.QUOTER:
                            props.style.width = '20%';
                            break;
                        case FieldType.HALF:
                            props.style.width = '45%';
                            break;
                        default:
                            props.style.width = '90%';
                    }
                    if(type === 'YYYY-MM-DD') {
                        console.log('date format:', type, data[key]);
                        if(data[key] instanceof Date) {
                            props.defaultDate = data[key];
                        } else if (typeof data[key] === 'string') {
                            props.defaultDate = new Date(data[key]);
                        } else {
                            props.defaultDate = new Date();
                        }
                        props.onChange = (e, date) => this._handleEdit(key, date, index);
                        return (
                            <DatePicker key = {index}
                                        {...props}
                                        mode = 'landscape'
                                        container = 'inline'
                                        textFieldStyle = {{width: '100%'}} />
                        );
                    } else if (type === 'selector') {
                        delete props.defaultValue;
                        props.value = data[key];
                        let items = [];
                        for(let key in TypeOptions) {
                            items.push(<MenuItem key = {key}
                                                 value = {key}
                                                 primaryText = {TypeOptions[key]} />);
                        }
                        props.onChange = (e, itemIndex, value) => this._handleEdit(key, value, index);
                        return (
                            <SelectField key = {index} {...props}>
                                {items}
                            </SelectField>
                        );
                    }  else if (type === 'switcher') {
                        delete props.defaultValue;
                        props.value = data[key];
                        let items = CheckOptions.map((key, j) => (<MenuItem key = {key} value = {key} primaryText = {key} />));
                        props.onChange = (e, itemIndex, value) => this._handleEdit(key, value, index);
                        return (
                            <SelectField key = {index} {...props}>
                                {items}
                            </SelectField>
                        );
                    } else if (required) {
                        return (
                            <CheckField key = {index}
                                       {...props} />
                        );
                    } else {
                        return (
                            <TextField key = {index}
                                       {...props} />
                        );
                    }

                })}
            </div>
        ));
        return (
            <Dialog open = {open}
                    title = {dialogLabel}
                    titleStyle = {{textAlign: 'center'}}
                    autoScrollBodyContent = {true}
                    actionsContainerStyle = {{textAlign: 'center'}}
                    actions = {[<RaisedButton label = {dialogLabel}
                                              primary = {true}
                                              onClick = {this._handleSubmitBtn}
                                              style = {btnStyle} />,
                                <RaisedButton label = '取消'
                                              onClick = {this._handleClose}
                                              style = {btnStyle} />]}
                    modal = {false}
                    onRequestClose = {this._handleClose}>
                {nodes}
            </Dialog>
        )
    }
}

exports.EditDialog = EditDialog;