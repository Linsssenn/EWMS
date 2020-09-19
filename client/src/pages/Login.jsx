import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { login } from "../actions/account";
import fetchStates from "../reducers/fetchStates";
import PropTypes from "prop-types";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      buttonClicked: false,
    };
  }

  componentDidMount() {
    if (this.props.account.loggedIn) {
      this.props.history.push("/dashboard");
    }
  }

  // unsafe according to Docs
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.account.loggedIn) {
  //     nextProps.history.push("/dashboard");
  //   }
  // }

  // re-renders due to changes to props or state
  //  fires when the parent causes a re-render and not as a result of a local setState
  static getDerivedStateFromProps(props, state) {
    if (props.account.loggedIn) {
      props.history.push("/dashboard");
    }
    return null;
  }

  /**@param {event} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * @param {event} event
   */

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ buttonClicked: true });
    const { username, password } = this.state;
    this.props.login({ username, password });
  };

  get handleError() {
    if (
      this.state.buttonClicked &&
      this.props.account.status === fetchStates.error
    ) {
      return <Message error>{this.props.account.message}</Message>;
    } else {
      return <div></div>;
    }
  }

  // loading = () => this.props.account.status === fetchStates.fetching;

  render() {
    const { status } = this.props.account;
    const loading = status === fetchStates.fetching;

    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            <span>Log-in to your account</span>
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.onChange}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={this.onChange}
              />
              <Button
                disabled={loading}
                loading={loading}
                color="teal"
                fluid
                size="large"
              >
                Login
              </Button>
            </Segment>
          </Form>
          {this.handleError}
        </Grid.Column>
      </Grid>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { login })(Login);
