/**
 *
 */
import React from 'react'
import { Table, Button } from 'react-bootstrap'
export let ManageTable = React.createClass({
    getInitialState: function() {
        return {}
    },
    _adminNode: function(row) {
        let { editRow, deleteRow } = this.props
        if(this.props.tableAdmin) {
            return (
                <td>
                    <Button bsStyle = 'warning' onClick = {() => editRow(row)}>
                        <span className = 'glyphicon glyphicon-pencil'></span>
                        Edit
                    </Button>
                    <Button bsStyle = 'danger' onClick = {() => deleteRow(row)}>
                        <span className = 'glyphicon glyphicon-remove'></span>
                        Delete
                    </Button>
                </td>
            )
        }
    },
    _indexNode: function(index) {
        if(this.props.tableIndex) {
            return (<td>{index + 1}</td>)
        }
    },
    render: function() {
        let { schema, data, tableAdmin, tableIndex } = this.props
        let theaders = schema.map((key) => key.label)
        tableIndex && theaders.unshift('序号')
        tableAdmin && theaders.unshift('管理')
        var headerNodes = theaders.map((header, index) => <th key = {index}>{header}</th>),
            bodyNodes = data.map((d, index) => {
                let rows = schema.map((key, index) => <td key = {index}>{d[key.key]}</td>)
                return (
                    <tr key = {index}>
                        {this._adminNode(d)}
                        {this._indexNode(index)}
                        {rows}
                    </tr>
                )
            })

        return (
            <Table responsive
                   striped
                   hover
                   condensed>
                <thead><tr>{headerNodes}</tr></thead>
                <tbody>{bodyNodes}</tbody>
            </Table>
        )
    }
})