import React, { Component } from "react";
import { Modal, Grid, Form, Segment, Message } from "semantic-ui-react";
import Maps from "./Maps";
import { storeDetachment } from "../actions/detachment";
import { connect } from "react-redux";
import fetchState from "../reducers/fetchStates";
import ReusableForm from "./ReusableForm";

class AddModalDetachment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        name: "",
        address: "",
        city: "",
        zip: "",
        lat: "",
        lon: "",
      },
    };
  }

  close = () => {
    this.props.closeModal();
  };

  handleSubmit = () => {
    const { fields } = this.state;
    this.props.storeDetachment(fields);
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      fields: { ...prevState.fields, [name]: value },
    }));
  };

  // Callback pass to Maps.jsx
  toggleLatLong = ({ lat, lon }) => {
    this.setState((prevState) => ({
      fields: { ...prevState.fields, lat: lat, lon: lon },
    }));
  };

  createInput = () =>
    Object.keys(this.state.fields).map((value, index) => {
      return (
        <Form.Input
          key={`${index}`}
          label={value.toUpperCase()}
          fluid
          required
          name={value}
          onChange={this.onChange}
          value={this.state.fields[value] || ""}
        />
      );
    });

  render() {
    const { modal, detachment } = this.props;

    return (
      <Modal size="large" open={modal} onClose={this.close}>
        <Modal.Header>Add a Detachment</Modal.Header>
        <Modal.Content scrolling>
          {detachment.status === fetchState.error && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <Message.Content>{detachment.message}</Message.Content>
            </Message>
          )}
          {detachment.message && detachment.status === fetchState.success && (
            <Message>
              <Message.Content>{detachment.message}</Message.Content>
            </Message>
          )}
          <Grid stackable columns={2} textAlign="left">
            <Grid.Column>
              <ReusableForm cancel={this.close} submit={this.handleSubmit}>
                {this.createInput()}
              </ReusableForm>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Maps toggleLatLong={this.toggleLatLong} />
              </Segment>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  detachment: state.detachment,
});

export default connect(mapStateToProps, { storeDetachment })(
  AddModalDetachment
);
