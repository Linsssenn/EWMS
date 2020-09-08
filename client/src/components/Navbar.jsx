import React, { Component } from "react";
import { Menu, Container, Dropdown, Image } from "semantic-ui-react";
import logo from "../logo.svg";
import { connect } from "react-redux";
import { logout } from "../actions/account";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const menuStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
};

class Navbar extends Component {
  onLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { account } = this.props;
    return (
      <Menu style={menuStyle} borderless fixed="top" size="large">
        <Container>
          <Menu.Item>
            <Image size="tiny" src={logo} />
          </Menu.Item>
          <Menu.Item as={NavLink} header to="/">
            EWMS
          </Menu.Item>
          <Dropdown item simple text="Employee">
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/employee">
                Employee
              </Dropdown.Item>

              <Dropdown.Item>Find nearest Detachment</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item simple text="Detachment">
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/detachment">
                Detachment
              </Dropdown.Item>

              <Dropdown.Item>Find nearest Employee</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position="right">
            <Dropdown
              text={`Welcome, ${!!account ? account.username : "Admin"}`}
              pointing
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(Navbar);
