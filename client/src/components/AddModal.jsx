import React, { Component } from "react";
import {
  Modal,
  Grid,
  Button,
  Icon,
  Form,
  Segment,
  Message,
} from "semantic-ui-react";
import Maps from "./Maps";
import { storeEmployee } from "../actions/employee";
import { connect } from "react-redux";
import fetchState from "../reducers/fetchStates";

const infoFields = [
  "name",
  "employmentType",
  "email",
  "homePhone",
  "cellPhone",
];

const addressFields = ["lat", "lon", "city", "region", "zipCode"];
const info = infoFields.reduce((a, b) => ((a[b] = ""), a), {});
const address = addressFields.reduce((a, b) => ((a[b] = ""), a), {});

const initialState = { info, address, buttonClicked: false };
class AddModal extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  // Callback pass to Maps.jsx
  toggleLatLong = ({ lat, lon }) => {
    console.log(lat, lon);
    this.setState({
      address: { lat: lat, lon: lon },
    });
  };

  createInput = (inputArray) =>
    inputArray.map((value, index) => {
      const activeValue = infoFields.includes(value)
        ? this.state.info[value]
        : this.state.address[value];

      return (
        <Form.Input
          key={`${index}`}
          label={value.toUpperCase()}
          fluid
          required
          name={value}
          onChange={this.onChange}
          value={activeValue || ""}
        />
      );
    });

  /**@param {event} event */

  onChange = (event) => {
    const { name, value } = event.target;
    if (infoFields.includes(name)) {
      this.setState((prevState) => ({
        info: { ...prevState.info, [name]: value },
      }));
    } else if (addressFields.includes(name)) {
      this.setState((prevState) => ({
        address: { ...prevState.address, [name]: value },
      }));
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { address, info } = this.state;
    this.props.storeEmployee({ info: info, address: address });
  };

  close = () => {
    this.setState(initialState);
    this.props.closeModal();
  };

  render() {
    const { modal, employee } = this.props;

    return (
      <Modal
        size="large"
        as={Form}
        onSubmit={this.handleSubmit}
        open={modal}
        onClose={this.close}
      >
        <Modal.Header>Add an Employee</Modal.Header>
        <Modal.Content scrolling>
          {employee.status === fetchState.error && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <Message.Content>{employee.message}</Message.Content>
            </Message>
          )}
          {employee.message && employee.status === fetchState.success && (
            <Message>
              <Message.Content>{employee.message}</Message.Content>
            </Message>
          )}
          <Grid stackable columns={2} textAlign="left">
            <Grid.Column>
              {this.createInput(infoFields)}
              {this.createInput(addressFields)}
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Maps toggleLatLong={this.toggleLatLong} />
              </Segment>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color="teal" type="submit">
            <Icon name="add" />
            Submit
          </Button>
          <Button color="red" onClick={this.close}>
            <Icon name="close" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee,
});

export default connect(mapStateToProps, { storeEmployee })(AddModal);
