import React, { useEffect, createRef, useState } from "react";
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
import { Marker, Popup } from "react-leaflet";
import DisplayMap from "../components/DisplayMap";
import { useSelector, useDispatch } from "react-redux";
import { fetchNearestDetachment, clearDetachments } from "../actions/employee";
import getNumber from "../util/getNumber";
import fetchStates from "../reducers/fetchStates";
import Spinner from "../components/Spinner";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import Routing from "../components/Routing";
import homeIcon from "../components/HomeIcon";

export default function NeareastDetachment() {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_FIELDS = { search: "" };

  const [page, setPage] = useState(1);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [directions, setDirections] = useState([]);

  const employee = useSelector((state) => state.employee);

  const dispatch = useDispatch();
  const mapRef = createRef();

  let history = useHistory();
  let location = useLocation();

  const {
    status,
    detachments,
    count,
    employee: selectedEmployee,
    employeeId,
  } = employee;

  // check selected employee

  const emp =
    parseInt(employeeId) === selectedEmployee.id ? selectedEmployee.name : "";

  // Similar to componentDidMount and componentDidUpdate:
  // “only run on mount, and clean up on unmount”
  // empty array [] is equivalent to componentDidMount
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const { id } = parsed;

    if (id) {
      dispatch(fetchNearestDetachment({ employeeId: id }));
    }
    setDirections([]);
    // componentWillUnmount
    return () => dispatch(clearDetachments());
    // componentDidUpdate fires when there's change in dispatch and location
  }, [dispatch, location]);

  // componentDidUpdate
  useEffect(() => {
    const map = mapRef.current;

    if (map != null && !!selectedEmployee) {
      const { lat, lon } = selectedEmployee;
      map.leafletElement.setView([lat, lon], 13);
    }
  }, [selectedEmployee]);

  // Table page change event
  const onPageChange = (event, data) => {
    const parsed = queryString.parse(location.search);
    const { id } = parsed;
    setPage(data.activePage);
    setDirections([]);
    if (id) {
      dispatch(
        fetchNearestDetachment({
          page: data.activePage,
          limit: DEFAULT_LIMIT,
          employeeId: id,
        })
      );
    }
  };

  // input change event
  const onChange = ({ target }) => {
    const { value, name } = target;
    setFields({ ...fields, [name]: value });
  };

  // redirect to searched employee
  const onSearch = () => {
    const { search } = fields;
    if (search) history.push(`${location.pathname}?id=${search}`);
  };

  // activate set waypoints in Routing component
  const routeDirections = (latLngObj) => {
    const { lat, lon } = selectedEmployee;
    setDirections([{ lat, lon }, latLngObj]);
  };

  if (status === fetchStates.fetching) {
    return (
      <div>
        <Spinner content={"Nearest Detachments"} />
      </div>
    );
  }

  return (
    <Container style={{ marginTop: "8em", width: "85%" }}>
      <Grid stackable columns={2} textAlign="left">
        <Grid.Row>
          <Grid.Column>
            {" "}
            <Segment>
              <Header as="h3">Find Nearest Detachments</Header>
              <p>
                Search for the nearest detachment from an employee's location
              </p>
              <Input
                style={{ width: "100%" }}
                name="search"
                placeholder="Enter ID of Employee"
                size="large"
                onBlur={onChange}
              />
              <Divider hidden />
              <Button onClick={onSearch} icon labelPosition="left" color="teal">
                <Icon name="search" /> SEARCH EMPLOYEE
              </Button>
            </Segment>
            {!!emp && <Header as="h4">Detachments near of {emp}</Header>}
          </Grid.Column>
        </Grid.Row>

        {!!Object.keys(selectedEmployee).length && (
          <React.Fragment>
            {" "}
            <Grid.Column>
              <ReusedTable
                data={detachments}
                header={["id", "name", "address", "dist_miles"]}
                mapRef={mapRef}
                specifiedHeader={["id", "name", "address", "distance in miles"]}
                route={routeDirections}
              />
              <Pagination
                onPageChange={onPageChange}
                defaultActivePage={!page ? 1 : page}
                totalPages={Math.ceil(
                  getNumber({ value: count, defaultValue: 1 }) / DEFAULT_LIMIT
                )}
              />
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <DisplayMap data={detachments} ref={mapRef}>
                  <Marker
                    icon={homeIcon}
                    position={[selectedEmployee.lat, selectedEmployee.lon]}
                  >
                    <Popup>
                      <h3>Employee</h3>
                      {Object.entries(selectedEmployee).map(
                        ([key, value], index) => (
                          <div key={index}>
                            <span>{key}: </span>
                            {value}
                          </div>
                        )
                      )}
                    </Popup>
                  </Marker>

                  <Routing map={mapRef} directions={directions} />
                </DisplayMap>
              </Segment>
            </Grid.Column>
          </React.Fragment>
        )}
      </Grid>
    </Container>
  );
}
