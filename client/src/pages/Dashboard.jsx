import React from "react";
import {
  Button,
  Grid,
  Segment,
  Header,
  Input,
  Divider,
  Container,
  Icon,
} from "semantic-ui-react";

export default function Dashboard() {
  return (
    <Container style={{ marginTop: "8em" }}>
      <Grid stackable columns={2} textAlign="left">
        <Grid.Column>
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
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <Header as="h3">Find Nearest Detachment</Header>
            <p>Search for the nearest detachment from a employee's location</p>
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
        </Grid.Column>
      </Grid>
    </Container>
  );
}
