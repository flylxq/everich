/**
 * Created by flylxq on 16/9/23.
 */
'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import $ from 'jquery';
import { Cookie } from '../../../common/Cookie';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    fontFamily: 'PingFang SC, 微软雅黑, Helvetica Neue, Arial, Roboto, sans-serif'
});

require('../../stylesheets/index.scss');

const MAIN_PAGE = {
    products: 'products',
    factories: 'factories',
    store: 'store',
    customers: 'customers',
    mkCommodities: 'mkCommodities',
    mkOrders: 'mkOrders',
    mkInvoices: 'mkInvoices',
    tlaCommodities: 'tlaCommodities',
    tlaOrders: 'tlaOrders',
    tlaInvoices: 'tlaInvoices',
    users: 'users',
    security: 'security'
};

let LeftContainer = React.createClass({
    getInitialState() {
        return {
            basicOpen: false,
            marketsOpen: false,
            SuperMKOpen: false,
            TLAOpen: false,
            usersOpen: false
        };
    },

    _logout() {
        this.props.cookie.clearCookie();
        window.location = '/login';
    },

    _toggle(key) {
        let state = {};
        state[key] = !this.state[key];
        this.setState(state);
    },

    render() {
        const { basicOpen, marketOpen, SuperMKOpen, TLAOpen, usersOpen } = this.state,
            { setPage } = this.props;
        return (<div className = 'left-container'>
            <Toolbar style = {{flex: '0 0 56px'}}>
                <ToolbarGroup>
                    <ToolbarTitle text = "EVERICH"
                                  style = {{marginLeft: 0}} />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarSeparator style = {{marginLeft: 0}} />
                    <RaisedButton label = 'Log out'
                                  primary = {true}
                                  fullWidth = {true}
                                  onClick = {this._logout}
                                  style = {{fontSize: '10px', marginRight: 0, marginLeft: 0}} />
                </ToolbarGroup>
            </Toolbar>
            <div className = 'menus'>
                <List>
                    <ListItem primaryText = 'Basic Info'
                              primaryTogglesNestedList = {true}
                              open = {basicOpen}
                              onClick = {() => this._toggle('basicOpen')}
                              nestedItems = {[
                                  <ListItem key = {0}
                                            primaryText = 'Products'
                                            onClick = {() => setPage(MAIN_PAGE.products)} />,
                                  <ListItem key = {1}
                                            primaryText = 'Factories'
                                            onClick = {() => setPage(MAIN_PAGE.factories)} />,
                                  <ListItem key = {2}
                                            primaryText = 'Store'
                                            onClick = {() => setPage(MAIN_PAGE.store)} />,
                                  <ListItem key = {3}
                                            primaryText = 'Customers'
                                            onClick = {() => setPage(MAIN_PAGE.customers)} />
                              ]}/>
                    <ListItem primaryText = 'Supermarkets'
                              primaryTogglesNestedList = {true}
                              open = {marketOpen}
                              onClick = {() => this._toggle("marketOpen")}
                              nestedItems = {[
                                  <ListItem key = {0} primaryText = 'KMart'
                                            primaryTogglesNestedList = {true}
                                            open = {SuperMKOpen}
                                            onClick = {() => this._toggle("SuperMKOpen")}
                                            nestedItems = {[
                                                <ListItem key = {0}
                                                          primaryText = 'Commodities'
                                                          onClick = {() => setPage(MAIN_PAGE.mkCommodities)} />,
                                                <ListItem key = {1}
                                                          primaryText = 'Orders'
                                                          onClick = {() => setPage(MAIN_PAGE.mkOrders)} />,
                                                <ListItem key = {2}
                                                          primaryText = 'Invoices'
                                                          onClick = {() => setPage(MAIN_PAGE.mkInvoices)} />
                                            ]}
                                  />,
                                  <ListItem key = {1} primaryText = 'TLA'
                                            primaryTogglesNestedList = {true}
                                            open = {TLAOpen}
                                            onClick = {() => this._toggle("TLAOpen")}
                                            nestedItems = {[
                                                <ListItem key = {0}
                                                          primaryText = 'Commodities'
                                                          onClick = {() => setPage(MAIN_PAGE.tlaCommodities)} />,
                                                <ListItem key = {1}
                                                          primaryText = 'Orders'
                                                          onClick = {() => setPage(MAIN_PAGE.tlaOrders)} />,
                                                <ListItem key = {2}
                                                          primaryText = 'Invoices'
                                                          onClick = {() => setPage(MAIN_PAGE.tlaInvoices)} />
                                            ]}
                                  />
                              ]}
                    />
                    <ListItem primaryText = 'Users'
                              primaryTogglesNestedList = {true}
                              open = {usersOpen}
                              onClick = {() => this._toggle("usersOpen")}
                              nestedItems = {[
                                  <ListItem key = {0}
                                            primaryText = 'Users'
                                            onClick = {() => setPage(MAIN_PAGE.users)} />,
                                  <ListItem key = {1}
                                            primaryText = 'Security'
                                            onClick = {() => setPage(MAIN_PAGE.security)} />
                              ]}
                    />
                </List>
            </div>
            <div className = 'footer'></div>
        </div>);
    }
});

import Customers from '../../../pages/Customers.jsx';
import Factories from '../../../pages/Factories.jsx';
import Products from '../../../pages/Products.jsx';
import Store from '../../../pages/Store.jsx';
import MKCommodities from '../../../pages/MKCommodities.jsx';
import MKOrders from '../../../pages/MKOrders.jsx';
import MKInvoices from '../../../pages/MKInvoices.jsx';
import TLACommodities from '../../../pages/TLACommodities.jsx';
import TLAOrders from '../../../pages/TLAOrders.jsx';
import TLAInvoices from '../../../pages/TLAInvoices.jsx';
import Users from '../../../pages/Users.jsx';
import Security from '../../../pages/Security.jsx';
let IndexView = class IndexView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cookie: new Cookie(),
            content: MAIN_PAGE.products
        };
    }

    _setPage(content) {
        this.setState({content});
    }

    _mainPage(content) {
        switch(content) {
            case MAIN_PAGE.customers:
                return <Customers />;
            case MAIN_PAGE.factories:
                return <Factories />;
            case MAIN_PAGE.products:
                return <Products />;
            case MAIN_PAGE.store:
                return <Store />;
            case MAIN_PAGE.mkCommodities:
                return <MKCommodities />;
            case MAIN_PAGE.mkOrders:
                return <MKOrders />;
            case MAIN_PAGE.mkInvoices:
                return <MKInvoices />;
            case MAIN_PAGE.tlaCommodities:
                return <TLACommodities />;
            case MAIN_PAGE.tlaOrders:
                return <TLAOrders />;
            case MAIN_PAGE.tlaInvoices:
                return <TLAInvoices />;
            case MAIN_PAGE.users:
                return <Users />;
            case MAIN_PAGE.security:
                return <Security />;
            default:
                return <Products />;
        }
    }

    render() {
        const { cookie, content } = this.state;
        return (<div className = 'container-fluid' style = {{padding: 0}}>
            <LeftContainer cookie = {cookie}
                           setPage = {this._setPage.bind(this)} />
            {this._mainPage(content)}
        </div>);
    }
};

const Index = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <IndexView />
    </MuiThemeProvider>
);

ReactDOM.render(
    <Index />,
    $('#body').get(0)
);