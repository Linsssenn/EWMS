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

export default function Employee() {
  return (
    <Container style={{ marginTop: "8em" }}>
      <Grid stackable columns={2} textAlign="left">
        <Grid.Column>
          <Segment>
            <Header as="h3">Find Employee</Header>

            <Input
              style={{ width: "100%" }}
              placeholder="Enter name of Employee"
              size="large"
            />
            <Divider hidden />
            <Button icon labelPosition="left" color="teal">
              <Icon name="search" /> SEARCH EMPLOYEE
            </Button>
          </Segment>
          <Divider hidden />
          <Button icon labelPosition="left" color="teal">
            <Icon name="add" /> ADD EMPLOYEE
          </Button>
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
