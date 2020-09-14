import React, { Component, createRef } from "react";
import ReusedTable from "../components/ReusedTable";
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
import DisplayMap from "../components/DisplayMap";
import { connect } from "react-redux";
import { fetchEmployees, fetchEmployee } from "../actions/employee";
import PropTypes from "prop-types";
import queryString from "query-string";
import fetchStates from "../reducers/fetchStates";
import getNumber from "../util/getNumber";
import Spinner from "../components/Spinner";
import AddModalEmployee from "../components/AddModalEmployee";

const DEFAULT_LIMIT = 10;

class Employee extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = {
      page: 1,
      modal: false,
      search: "",
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    const { page, limit } = parsed;
    console.log(parsed);
    // this.setState({ page });
    // this.props.fetchEmployees(parsed);
    this.props.fetchEmployees({});
  }

  onPageChange = (event, data) => {
    this.setState({ page: data.activePage });
    this.props.fetchEmployees({ page: data.activePage, limit: DEFAULT_LIMIT });
  };

  /**@param {event} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSearch = () => {
    const { search } = this.state;

    this.props.fetchEmployees({ search: search });
  };

  toggleModal = () => this.setState({ modal: !this.state.modal });
  // openModal = () => this.setState({ modal: true });

  // closeModal = () => this.setState({ modal: false });

  render() {
    const { status, employees, count } = this.props.employee;
    const { page, modal } = this.state;

    if (status === fetchStates.fetching) {
      return (
        <div>
          <Spinner content={"employee"} />
        </div>
      );
    }

    return (
      <Container style={{ marginTop: "8em", width: "85%" }}>
        <Grid stackable columns={2} textAlign="left">
          <Grid.Column>
            <Segment>
              <Header as="h3">Find Employee</Header>

              <Input
                style={{ width: "100%" }}
                placeholder="Enter name of Employee"
                size="large"
                name="search"
                onChange={this.onChange}
              />
              <Divider hidden />
              <Button
                icon
                labelPosition="left"
                color="teal"
                onClick={this.onSearch}
              >
                <Icon name="search" /> SEARCH EMPLOYEE
              </Button>
            </Segment>
            <Divider hidden />
            <Button
              onClick={this.toggleModal}
              icon
              labelPosition="left"
              color="teal"
            >
              <Icon name="add" /> ADD EMPLOYEE
            </Button>
            <ReusedTable
              data={employees}
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
              <DisplayMap
                data={employees}
                type={"employee"}
                ref={this.mapRef}
              />
            </Segment>
          </Grid.Column>
        </Grid>
        <AddModalEmployee
          title={"Add an Employee"}
          modal={modal}
          closeModal={this.toggleModal}
        />
      </Container>
    );
  }
}

Employee.propTypes = {
  fetchEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  employee: state.employee,
});
export default connect(mapStateToProps, { fetchEmployees, fetchEmployee })(
  Employee
);
