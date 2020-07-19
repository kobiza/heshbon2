import React from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { ROUTES } from '../utils/consts'
import FixedAndVariableCostsGraphs from './FixedAndVariableCostsGraphs.jsx'
import MonthCostsGraphs from './MonthCostsGraphs.jsx'
import PageTitle from './PageTitle.jsx'
import Transactions from './Transactions.jsx'
import TransactionsAutoTags from './TransactionsAutoTags.jsx'
import {loginWithGoogle, fetchAuthData, signOut} from '../redux/actions/authActions'
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BarChartIcon from '@material-ui/icons/BarChart';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginRight: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 36,
        marginRight: -12
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    menuItem: {
        textAlign: 'right'
    }
})

function mapStateToProps(state) {
    return {
        authData: state.authData
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchAuthData: () => dispatch(fetchAuthData()),
    loginWithGoogle: () => dispatch(loginWithGoogle()),
    signOut: () => dispatch(signOut())
});

class App2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleDrawerOpen = () => {
            this.setState({open: true})
        }

        this.handleDrawerClose = () => {
            this.setState({open: false})
        }
    }
    componentWillMount() {
        this.props.fetchAuthData();
    }

    render() {
        const { classes } = this.props
        const theme = createMuiTheme({
            direction: 'rtl',
        });
        const link1 = React.forwardRef((linkProps, ref) => (
            <Link ref={ref} to="/" {...linkProps} />
        ))
        const link2 = React.forwardRef((linkProps, ref) => (
            <Link ref={ref} to="/fixedAndVariableCostsGraphs" {...linkProps} />
        ))
        const link3 = React.forwardRef((linkProps, ref) => (
            <Link ref={ref} to="/monthCostsGraphs" {...linkProps} />
        ))
        const link4 = React.forwardRef((linkProps, ref) => (
            <Link ref={ref} to="/transactionsAutoTags" {...linkProps} />
        ))
        return (
            <ThemeProvider theme={theme}>
                <Router>

                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <PageTitle classes={classes.title}/>
                        </Toolbar>
                        {!this.props.authData && (
                            <button className="login-button" onClick={this.props.loginWithGoogle}>
                                <span>התחבר</span>
                            </button>
                        )}
                        {this.props.authData && (
                            <button className="logout-button" onClick={this.props.signOut}>
                                <span>התנתק</span>
                            </button>
                        )}
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <div>
                                <ListItem button className={classes.menuItem} component={link1}>
                                    <ListItemIcon>
                                        <FormatListNumberedRtlIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={ROUTES["/"]} />
                                </ListItem>
                                <ListItem button className={classes.menuItem} component={link2}>
                                    <ListItemIcon>
                                        <BarChartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={ROUTES["/fixedAndVariableCostsGraphs"]} />
                                </ListItem>
                                <ListItem button className={classes.menuItem} component={link3}>
                                    <ListItemIcon>
                                        <TrendingUpIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={ROUTES["/monthCostsGraphs"]} />
                                </ListItem>
                                <ListItem button className={classes.menuItem} component={link4}>
                                    <ListItemIcon>
                                        <LocalOfferIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={ROUTES["/transactionsAutoTags"]} />
                                </ListItem>
                            </div>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Container maxWidth="lg" className={classes.container}>
                            <Switch>
                                <Route path="/fixedAndVariableCostsGraphs">
                                    {this.props.authData && <FixedAndVariableCostsGraphs/>}
                                </Route>
                                <Route path="/monthCostsGraphs">
                                    {this.props.authData && <MonthCostsGraphs/>}
                                </Route>
                                <Route path="/transactionsAutoTags">
                                    {this.props.authData && <TransactionsAutoTags/>}
                                </Route>
                                <Route path="/">
                                    {this.props.authData && <Transactions/>}
                                </Route>
                            </Switch>
                        </Container>

                    </main>
                </div>
                </Router>
            </ThemeProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App2));
