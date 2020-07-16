import React from "react";
import { Menu, Container, Dropdown, Image } from "semantic-ui-react";
import logo from "../logo.svg";

const menuStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
};

export default function Navbar() {
  return (
    <Menu style={menuStyle} borderless fixed="top" size="large">
      <Container>
        <Menu.Item>
          <Image size="tiny" src={logo} />
        </Menu.Item>
        <Menu.Item as="a" header>
          EWMS
        </Menu.Item>
        <Dropdown item simple text="Employee">
          <Dropdown.Menu>
            <Dropdown.Item>All Employee</Dropdown.Item>
            <Dropdown.Item>Add Employee</Dropdown.Item>
            <Dropdown.Item>Find nearest Detachment</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item simple text="Detachment">
          <Dropdown.Menu>
            <Dropdown.Item>All Detachment</Dropdown.Item>
            <Dropdown.Item>Add Detachment</Dropdown.Item>
            <Dropdown.Item>Find nearest Employee</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          <Dropdown text="Welcome, Admin" pointing className="link item">
            <Dropdown.Menu>
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
