/**
 *
 */
'use strict';
import * as React from 'react';
import {Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton';
import EditSVG from 'material-ui/svg-icons/image/edit';
import DeleteSVG from 'material-ui/svg-icons/action/delete';
import {red900, green900} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from './Pagination';

export class ManageTable extends React.Component<any, any>{
    static defaultProps: any = {
        loading: false
    };

    constructor(props: any) {
        super(props);
    }

    private adminNode(row: any, key: any, total: number) {
        let { editRow, deleteRow } = this.props;
        let buttonStyle = {
            padding: '6px',
            margin: '0',
            height: '36px'
        };

        return (
            <TableRowColumn style={{
                width: `${key.width / total * 100}%`,
                padding: '2px 6px',
                textAlign: 'center',
                overflow: 'visible'
            }}>
                <IconButton onClick = {() => editRow(row)}
                            iconStyle={{color: green900}}
                            style={Object.assign({}, buttonStyle)}
                            tooltip="edit"
                            tooltipPosition="top-right"
                            tooltipStyles={{zIndex: 1000, top: '24px', left: '36px'}}>
                    <EditSVG />
                </IconButton>
                <IconButton onClick = {() => deleteRow(row)}
                            tooltip="delete"
                            tooltipPosition="top-right"
                            tooltipStyles={{zIndex: 1000, top: '24px', left: '36px'}}
                            iconStyle={{color: red900}}
                            style={Object.assign({}, buttonStyle)}>
                    <DeleteSVG />
                </IconButton>
            </TableRowColumn>
        );
    }

    render() {
        let { schema,
            data,
            tableAdmin,
            tableIndex,
            styleColor,
            loading,
            pages,
            activePage,
            setPage } = this.props;
        let theaders = [{label: 'Admin', width: 60}, {label: 'No.', width: 20}].concat(schema);
        if(tableIndex) {
            theaders.unshift({label: 'No.', width: 20});
        }
        if(tableAdmin) {
            theaders.unshift({label: 'Admin', width: 60});
        }
        let total = theaders.reduce((s: number, h: any) => s + h.width, 0);
        return (
            <div style={{
                width: '100%',
                flex: '1 1 auto',
                padding: '5px 10px',
                display: 'flex',
                flexDirection: 'column'}}>
                {pages > 1 && <Pagination pageNum = {pages}
                        pageRange = {5}
                        pageMargin = {1}
                        activePage = {activePage}
                        setPage = {setPage} />}
                <div style={{flex: '1 1 auto', width: '100%', overflowX: 'auto'}}>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}>
                            <TableRow>
                                {theaders.map((header: any, index: any) => (
                                    <TableHeaderColumn key = {index}
                                                       style = {{
                                                           fontFamily: 'Times New Roman',
                                                           textAlign: 'center',
                                                           backgroundColor: styleColor,
                                                           color: 'white',
                                                           width: `${header.width / total * 100}%`,
                                                           padding: '2px 12px',
                                                           fontSize: '15px',
                                                           lineHeight: '16px',
                                                           height: '32px'
                                                       }}>
                                        {header.label}
                                    </TableHeaderColumn>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}
                                   deselectOnClickaway={false}
                                   stripedRows = {true}
                                   showRowHover = {true}
                                   style={{width: 'auto'}}>
                            {data.map((d: any, index: any) => (
                                <TableRow key = {index}
                                          selectable={false}
                                          style={{height: 'auto'}}>
                                    {tableAdmin && this.adminNode(d, theaders[0], total)}
                                    {tableIndex && <TableRowColumn style={{
                                                        width: `${theaders[1].width / total * 100}%`,
                                                        padding: '2px 6px',
                                                        textAlign: 'center'}}>
                                                        {index + 1}
                                                    </TableRowColumn>}
                                    {schema.map((key: any, j: any) => <TableRowColumn key = {j}
                                                                                      style={{
                                                                                          width: `${key.width / total * 100}%`,
                                                                                          padding: '2px 6px',
                                                                                          textOverflow: 'inherit',
                                                                                          whiteSpace: 'normal',
                                                                                          overflow: 'visible',
                                                                                          textAlign: 'center',
                                                                                          height: 'auto'
                                                                                      }}>
                                        {d[key.key]}
                                    </TableRowColumn>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div style = {{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 20,
                    width: '100%',
                    height: '100%',
                    display: loading ? 'flex' : 'none',
                    backgroundColor: 'rgba(32, 32, 32, .5)',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    {loading && <CircularProgress size = {80} thickness = {6} /> }
                </div>
            </div>
        );
    }
}