import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = ({ content }) => (
  <Dimmer active>
    <Loader inline="centered" size="huge" content={`Preparing ${content}...`} />
  </Dimmer>
);

export default Spinner;
