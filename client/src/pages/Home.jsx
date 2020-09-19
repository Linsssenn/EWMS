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

export default function Home() {
  return (
    <Segment
      inverted
      textAlign="center"
      style={{ minHeight: "100vh", padding: "1em 0em" }}
      vertical
    >
      {" "}
      <HomepageHeading />
    </Segment>
  );
}

const HomepageHeading = ({ mobile }) => (
  <Container text style={{ paddingTop: "3em" }}>
    <Header
      as="h1"
      content="Employee Worksite Matching System"
      inverted
      style={{
        fontSize: mobile ? "2em" : "4em",
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: mobile ? "1.5em" : "3em",
      }}
    />
  </Container>
);
