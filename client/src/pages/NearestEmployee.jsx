import React from "react";
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
import Maps from "../components/Maps";

export default function NearestEmployee() {
  return (
    <Container style={{ marginTop: "8em" }}>
      <Segment>
        <Header as="h3">Find Nearest Employees</Header>
        <p>Search for the nearest employees from a detachment's location</p>
        <Input
          style={{ width: "100%" }}
          placeholder="Enter name of Detachment"
          size="large"
        />
        <Divider hidden />
        <Button icon labelPosition="left" color="teal">
          <Icon name="search" /> SEARCH EMPLOYEE
        </Button>
      </Segment>
      <Divider hidden />
      <Grid stackable columns={2} textAlign="left">
        <Grid.Column>
          <Header as="h4">
            Employees near of Detachment in Dasmariñas, Cavite
          </Header>
          <ReusedTable />
          <Pagination defaultActivePage={1} totalPages={10} />
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <Maps />
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
