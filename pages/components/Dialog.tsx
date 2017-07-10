/**
 *
 */
'use strict';
import * as React from 'react'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export class Confirm extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        var self = this;
        window.addEventListener('keypress', event => {
            if(self.props.show && event.keyCode === 13) {
                self.props.confirm();
            }
        });
    }

    componentWillUnMount() {
        window.removeEventListener('keypress');
    }

    render() {
        let { show, message, confirm, cancel } = this.props;
        let actionStyle = {
            margin: '0 6px'
        };
        let actions = [
            <RaisedButton primary={true} label="Confirm" onClick={confirm} style={actionStyle} />
        ];
        if(cancel) {
            actions.push(<RaisedButton label="Cancel" onClick={cancel} style={actionStyle} />)
        }
        return (
            <Dialog open={show}
                    actions={actions}
                    modal={true}
                    onRequestClose={cancel || confirm}
                    actionsContainerStyle={{display: 'flex', justifyContent: 'center'}} >
                {message}
            </Dialog>
        );
    }
}
