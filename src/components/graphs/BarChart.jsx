import _ from 'lodash';
import React, { PureComponent } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const getBars = ({bars}) => {
    return _.map(bars, ({dataKey, name, color, stackId}) => (
        <Bar key={`bar-${dataKey}`} dataKey={dataKey} name={name} fill={color} stackId={stackId}/>
    ))
}

export default class MyBarChart extends PureComponent {

    render() {
        return (
            <ResponsiveContainer height='100%' width='100%'>
                <BarChart
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
            </ResponsiveContainer>
        );
    }
}
