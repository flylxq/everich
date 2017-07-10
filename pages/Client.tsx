/**
 *
 */
'use strict';
import * as React from 'react';
import { DAO } from '../public/javascripts/controller/DAO';
import { ManageTable } from './components/Table';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AddSVG from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Confirm} from './components/Dialog';
import {Cookie} from '../common/Cookie';
import Config from '../config/development/Config';
import {purple900} from "material-ui/styles/colors";

/**
 * key: key's name in source table
 * label: key's show text
 * require: whether the key is required, default is false
 * type: key's type for input, default is text
 * @type {*[]}
 */
var CLIENT_SCHEMA = [{
    key: 'code',
    label: 'Code',
    width: 20,
    require: true
}, {
    key: 'name',
    label: 'Name',
    width: 100,
    require: true
}, {
    key: 'address',
    label: 'Address',
    width: 120,
    require: false
}, {
    key: 'contact',
    label: 'Contact',
    type: 'textarea',
    width: 150,
    require: false
}];
const ERROR = {
    text: '错误',
    unknown: '未知错误',
    transport: '传输错误'
};

class Client extends React.Component<any, any> {
    static defaultProps: any = {
        schema: CLIENT_SCHEMA,
        tableIndex: true
    };

    private dao: DAO;

    private cookie:Cookie = new Cookie();

    constructor(props: any) {
        super(props);

        this.dao = new DAO(Config.SERVER.CLIENT, this.ajaxFail);
        if(!this.cookie.getItem('username')) {
            window.location.replace(Config.PAGE.LOGIN);
        }
        let power = Number(this.cookie.getItem('power'));
        this.state = {
            client: this.getEmptyClient(),
            status: '',
            showModal: false,
            confirmDialog: false,
            confirmMessage: '',
            data: [],
            snackMessage: null,
            power,
            tableAdmin: power === 1,
            loading: false
        };
    }

    public ajaxFail = (error: any) => {
        this.setState({
            snackMessage: JSON.stringify(error)
        });
    };

    public getEmptyClient = () => {
        let client = {};
        CLIENT_SCHEMA.forEach(key => client[key.key] = '');
        return client;
    };

    public editClient = (client: any) => {
        this.setState({client: client, status: 'edit', showModal: true});
    };

    deleteClient = (client: any) => {
        this.setState({
            confirmText: `Are you sure to remove the client ${client.name} which could not recover?`,
            confirmDialog: true,
            client
        });
    };

    confirmDelete = () => {
        let { dao } = this,
            {client} = this.state,
            self = this;
        dao.delete(client).then(() => {
            dao.read().then(rsp => {
                self.setState({
                    data: rsp.data,
                    confirmDialog: false
                });
            });
        });
    };

    cancelDelete = () => {
        this.setState({
            confirmDialog: false
        });
    };

    addClient = () => {
        let client = this.getEmptyClient();
        this.setState({client: client, status: 'add', showModal: true});
    };

    confirm = () => {
        let { status, client } = this.state;
        let { dao } = this;
        console.log(client);
        if(status === 'add') {
            dao.create(client).then(result => {
                dao.read({}).then(rsp => {
                    this.setState({showModal: false, data: rsp.data})
                });
            });
        } else if(status === 'edit') {
            dao.update(client).then(result => {
                dao.read({}).then(rsp => {
                    this.setState({showModal: false, data: rsp.data});
                });
            });
        }

    }

    cancel = () => {
        this.setState({showModal: false});
    }

    handleChange = (e: any, header: any) => {
        let { client } = this.state;
        let key = header.key;
        client[key] = e.target.value;
        this.setState({client})
    }

    hideSnack = () => {
        this.setState({
            snackMessage: null
        });
    }

    componentDidMount() {
        let { dao } = this;
        let self = this;
        this.setState({
            loading: true
        });
        dao.read().then(rsp => {
            self.setState({
                data: rsp.data,
                loading: false
            });
        });
    }

    render() {
        let { schema, tableIndex } = this.props;
        let {
            client,
            data,
            status,
            showModal,
            snackMessage,
            confirmDialog,
            confirmText,
            tableAdmin,
            power, loading } = this.state;

        let inputNodes = schema.map((header, index) => (
            <TextField key={index}
                       fullWidth={true}
                       hintText={header.label}
                       floatingLabelText={(header.require ? '*' : '') + header.label + ':'}
                       onChange={(e) => this.handleChange(e, header)}
                       value={client[header.key]}
                       multiLine={!!header.type}
                       rowsMax={header.type ? 10 : 1} />
        ));

        return (
            <div style={{display: 'flex', flexDirection: 'column', flex: '1 1 80%'}}>
                <Toolbar style={{flex: '0 0 56px', width: '100%', backgroundColor: 'rgba(239, 239, 239, .6)'}}>
                    <ToolbarGroup>
                        <ToolbarTitle text="Clients Management" style={{color: purple900, fontFamily: 'Times New Roman', fontSize: '26px'}} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        <ToolbarSeparator />
                        {power == 1 &&
                            <RaisedButton label="Register"
                                          onClick={this.addClient}
                                          primary={true}
                                          icon={<AddSVG/>} />}
                    </ToolbarGroup>
                </Toolbar>
                <ManageTable schema = {schema}
                       data = {data}
                       editRow = {this.editClient}
                       deleteRow = {this.deleteClient}
                       tableAdmin = {tableAdmin}
                       tableIndex = {tableIndex}
                       styleColor={purple900} loading={loading} />
                <Dialog title={status === 'add' ? 'Register' : 'Edit'}
                        titleStyle={{textAlign: 'center', padding: '12px 12px 8px'}}
                        open={showModal}
                        autoScrollBodyContent={true}
                        onRequestClose={this.cancel}
                        actions={[
                            <RaisedButton style={{margin: '0 6px'}} primary={true} label="Confirm" onClick={this.confirm} />,
                            <RaisedButton style={{margin: '0 6px'}} label="Cancel" onClick={this.cancel} />
                        ]}
                        actionsContainerStyle={{display: 'flex', justifyContent: 'center'}}>
                    {inputNodes}
                </Dialog>
                <Confirm show={confirmDialog}
                         message={confirmText}
                         confirm={this.confirmDelete}
                         cancel={this.cancelDelete} />
                <Snackbar message={snackMessage || ''}
                          open={!!snackMessage}
                          autoHideDuration={4000}
                          onRequestClose={this.hideSnack}/>
            </div>
        )
    }
}

export default Client;
