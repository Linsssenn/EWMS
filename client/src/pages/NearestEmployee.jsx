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
import DisplayMap from "../components/DisplayMap";
import { useSelector, useDispatch } from "react-redux";
import { fetchNearestEmployee } from "../actions/detachment";
import getNumber from "../util/getNumber";
import fetchStates from "../reducers/fetchStates";
import Spinner from "../components/Spinner";

export default function NearestEmployee(props) {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_FIELDS = { search: "" };

  const [page, setPage] = useState(1);
  const [fields, setFields] = useState(DEFAULT_FIELDS);

  const detachment = useSelector((state) => state.detachment);
  const dispatch = useDispatch();
  const mapRef = createRef();

  // Similar to componentDidMount and componentDidUpdate:
  // “only run on mount, and clean up on unmount”
  // change [] to dispatch if strange problem occurs
  useEffect(() => {
    dispatch(
      fetchNearestEmployee({
        detachmentId: 1,
      })
    );
  }, [dispatch]);

  const loadEmployees = () => {};

  const onPageChange = (event, data) => {
    console.log(data);
    setPage(data.activePage);
    dispatch(
      fetchNearestEmployee({
        page: data.activePage,
        limit: DEFAULT_LIMIT,
        detachmentId: 1,
      })
    );
  };

  const onChange = ({ target }) => {
    const { value, name } = target;
    setFields({ ...fields, [name]: value });
  };

  const {
    status,
    employees,
    count,
    detachment: selectedDetachment,
    detachmentId,
  } = detachment;
  console.log(!page ? 1 : page);

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
        <Grid.Column>
          <Segment>
            <Header as="h3">Find Nearest Employees</Header>
            <p>Search for the nearest employees from a detachment's location</p>
            <Input
              style={{ width: "100%" }}
              placeholder="Enter name of Detachment"
              size="large"
              onChange={onChange}
            />
            <Divider hidden />
            <Button icon labelPosition="left" color="teal">
              <Icon name="search" /> SEARCH DETACHMENT
            </Button>
          </Segment>

          <Header as="h4">
            Employees near of Detachment in Dasmariñas, Cavite
          </Header>
          <ReusedTable
            data={employees}
            header={["id", "name", "city", "dist_miles"]}
            mapRef={mapRef}
            specifiedHeader={["id", "name", "city", "distance in miles"]}
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
              {/* <Marker icon={homeIcon} position={DEFAULT_POSITION}>
        <Popup>
          A pretty CSS3 popup.
          <br />
          Easily customizable.
        </Popup>
      </Marker> */}
            </DisplayMap>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
