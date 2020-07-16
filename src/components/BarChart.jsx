import React, { PureComponent } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

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
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="קבועות" fill="#ffc658" />
                <Bar dataKey="חדפ" stackId="a" fill="#8884d8" />
                <Bar dataKey="משתנות" stackId="a" fill="#82ca9d" />
                <Bar dataKey="לא ידוע" fill="#95a5a6" />
            </BarChart>
        );
    }
}
