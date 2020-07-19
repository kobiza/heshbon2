import React from 'react';
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {ROUTES} from "../utils/consts";

class PageTitle extends React.Component {
    render() {
        return (
            <Typography component="h1" variant="h6" color="inherit" noWrap className={this.props.classes}>
                {ROUTES[this.props.location.pathname]}
            </Typography>
        );
    }
}

export default withRouter(PageTitle);

