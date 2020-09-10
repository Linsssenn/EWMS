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

const DEFAULT_LIMIT = 10;

class Detachment extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = {
      page: 1,
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

  render() {
    const { status, count, detachments } = this.props.detachment;
    const { page } = this.state;
    if (status === fetchStates.fetching) {
      return (
        <div style={{ marginTop: "8em" }}>
          <Spinner content={"detachments"} />
        </div>
      );
    }
    return (
      <Container style={{ marginTop: "8em" }}>
        <Grid stackable columns={2} textAlign="left">
          <Grid.Column>
            <Segment>
              <Header as="h3">Find Detachment</Header>
              <Input
                style={{ width: "100%" }}
                placeholder="Enter name of Employee"
                size="large"
              />
              <Divider hidden />
              <Button icon labelPosition="left" color="teal">
                <Icon name="search" /> SEARCH DETACHMENT
              </Button>
            </Segment>
            <Divider hidden />
            <Button icon labelPosition="left" color="teal">
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
