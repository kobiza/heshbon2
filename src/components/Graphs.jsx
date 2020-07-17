import React, { Component } from 'react';
import Graph1 from './customGraphs/Graph1.jsx'
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

class Graphs extends Component {

    render() {
        return (
            <div className="graphs-page">
                <Graph1 transactions={this.props.transactions}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Graphs);
