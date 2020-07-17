import _ from 'lodash';
import React, { PureComponent } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const getBars = ({bars}) => {
    return _.map(bars, ({dataKey, name, color, stackId}) => (
        <Bar dataKey={dataKey} name={name} fill={color} stackId={stackId}/>
    ))
}

export default class Example extends PureComponent {

    render() {
        return (
            <BarChart
                width={980}
                height={300}
                data={this.props.data}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={this.props.groupKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {getBars(this.props)}
            </BarChart>
        );
    }
}
