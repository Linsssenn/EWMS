import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { fetchDetachments } from "../actions/detachment";
import PropTypes from "prop-types";
import ReusedTable from "../components/ReusedTable";
import DisplayMap from "../components/DisplayMap";
import {
  Button,
  Grid,
  Segment,
  Header,
  Input,
  Divider,
  Container,
  Icon,
  Pagination,
} from "semantic-ui-react";
import fetchStates from "../reducers/fetchStates";
import Spinner from "../components/Spinner";
import getNumber from "../util/getNumber";
import AddModalDetachment from "../components/AddModalDetachment";

const DEFAULT_LIMIT = 10;

class Detachment extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = {
      page: 1,
      search: "",
      modal: false,
    };
  }

  componentDidMount() {
    this.props.fetchDetachments({});
  }

  onPageChange = (event, data) => {
    this.setState({ page: data.activePage });
    this.props.fetchDetachments({
      page: data.activePage,
      limit: DEFAULT_LIMIT,
    });
  };

  /**@param {event} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  onSearch = () => {
    const { search } = this.state;

    this.props.fetchDetachments({ search: search });
  };

  toggleModal = () => this.setState({ modal: !this.state.modal });

  render() {
    const { status, count, detachments } = this.props.detachment;
    const { page, modal } = this.state;
    console.log(detachments);
    if (status === fetchStates.fetching) {
      return (
        <div>
          <Spinner content={"detachments"} />
        </div>
      );
    }
    return (
      <Container style={{ marginTop: "8em", width: "85%" }}>
        <Grid stackable columns={2} textAlign="left">
          <Grid.Column>
            <Segment>
              <Header as="h3">Find Detachment</Header>
              <Input
                style={{ width: "100%" }}
                placeholder="Enter name of Detachment"
                size="large"
                name="search"
                onChange={this.onChange}
                color="teal"
              />
              <Divider hidden />
              <Button
                icon
                labelPosition="left"
                color="teal"
                onClick={this.onSearch}
              >
                <Icon name="search" /> SEARCH DETACHMENT
              </Button>
            </Segment>
            <Divider hidden />
            <Button
              icon
              labelPosition="left"
              color="teal"
              onClick={this.toggleModal}
            >
              <Icon name="add" /> ADD DETACHMENT
            </Button>
            <ReusedTable
              data={detachments}
              header={["id", "name", "city"]}
              mapRef={this.mapRef}
            />
            <Pagination
              onPageChange={this.onPageChange}
              defaultActivePage={!page ? 1 : page}
              totalPages={Math.ceil(
                getNumber({ value: count, defaultValue: 1 }) / DEFAULT_LIMIT
              )}
            />
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <DisplayMap data={detachments} ref={this.mapRef} />
            </Segment>
          </Grid.Column>
        </Grid>
        <AddModalDetachment modal={modal} closeModal={this.toggleModal} />
      </Container>
    );
  }
}

Detachment.propTypes = {
  fetchDetachments: PropTypes.func.isRequired,
  detachment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  detachment: state.detachment,
});

export default connect(mapStateToProps, { fetchDetachments })(Detachment);
