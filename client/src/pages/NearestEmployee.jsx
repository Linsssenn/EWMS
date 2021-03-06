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
import { fetchNearestEmployee, clearEmployees } from "../actions/detachment";
import getNumber from "../util/getNumber";
import fetchStates from "../reducers/fetchStates";
import Spinner from "../components/Spinner";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import Routing from "../components/Routing";

export default function NearestEmployee() {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_FIELDS = { search: "" };

  const [page, setPage] = useState(1);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [directions, setDirections] = useState([]);

  const detachment = useSelector((state) => state.detachment);

  const dispatch = useDispatch();
  const mapRef = createRef();

  let history = useHistory();
  let location = useLocation();

  const {
    status,
    employees,
    count,
    detachment: selectedDetachment,
    detachmentId,
  } = detachment;

  // check selected detachment
  const detach =
    parseInt(detachmentId) === selectedDetachment.id
      ? { name: selectedDetachment.name, address: selectedDetachment.address }
      : "";

  // Similar to componentDidMount and componentDidUpdate:
  // “only run on mount, and clean up on unmount”
  // empty array [] is equivalent to componentDidMount
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const { id } = parsed;
    if (id) {
      dispatch(
        fetchNearestEmployee({
          detachmentId: id,
        })
      );
    }
    setDirections([]);
    // componentWillUnmount
    return () => dispatch(clearEmployees());
    // componentDidUpdate fires when there's change in dispatch and location
  }, [dispatch, location]);

  // componentDidUpdate
  useEffect(() => {
    const map = mapRef.current;

    if (map != null && !!selectedDetachment) {
      const { lat, lon } = selectedDetachment;
      map.leafletElement.setView([lat, lon], 13);
    }
  }, [selectedDetachment]);

  // Table page change event
  const onPageChange = (event, data) => {
    const parsed = queryString.parse(location.search);
    const { id } = parsed;
    setPage(data.activePage);
    setDirections([]);
    if (id) {
      dispatch(
        fetchNearestEmployee({
          page: data.activePage,
          limit: DEFAULT_LIMIT,
          detachmentId: id,
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
    const { lat, lon } = selectedDetachment;
    setDirections([{ lat, lon }, latLngObj]);
  };

  if (status === fetchStates.fetching) {
    return (
      <div>
        <Spinner content={"Nearest Employees"} />
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
              <Header as="h3">Find Nearest Employees</Header>
              <p>
                Search for the nearest employees from a detachment's location
              </p>
              <Input
                style={{ width: "100%" }}
                name="search"
                placeholder="Enter ID of Detachment"
                size="large"
                onBlur={onChange}
              />
              <Divider hidden />
              <Button onClick={onSearch} icon labelPosition="left" color="teal">
                <Icon name="search" /> SEARCH DETACHMENT
              </Button>
            </Segment>
            {!!detach && (
              <Header as="h4">
                Employees near of {detach.name} in {detach.address}
              </Header>
            )}
          </Grid.Column>
        </Grid.Row>

        {!!Object.keys(selectedDetachment).length && (
          <React.Fragment>
            {" "}
            <Grid.Column>
              <ReusedTable
                data={employees}
                header={["id", "name", "city", "dist_miles"]}
                mapRef={mapRef}
                specifiedHeader={["id", "name", "city", "distance in miles"]}
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
                <DisplayMap data={employees} type={"employee"} ref={mapRef}>
                  <Marker
                    position={[selectedDetachment.lat, selectedDetachment.lon]}
                  >
                    <Popup>
                      <h3>Detachment</h3>
                      {Object.entries(selectedDetachment).map(
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
