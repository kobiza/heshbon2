import React  from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';



export default class Example extends React.Component {
    render() {
        return (
            <AreaChart
                width={500}
                height={400}
                data={this.props.data}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="constant" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="dynamic" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
        );
    }
}
