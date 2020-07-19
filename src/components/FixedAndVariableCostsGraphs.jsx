import React, { Component } from 'react';
import Graph1 from './customGraphs/Graph1.jsx'
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

class FixedAndVariableCostsGraphs extends Component {

    render() {
        return (
            <div className="graphs-page">
                <Graph1 transactions={this.props.transactions} style={{width: '100%', height: '300px'}}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(FixedAndVariableCostsGraphs);
