import React from "react";
import { Form, Button, Icon } from "semantic-ui-react";

const ReusableForm = (props) => {
  const { cancel, errors, submit, children } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    cancel();
  };

  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        {children}
        <Button color="teal" type="submit">
          <Icon name="add" />
          Submit
        </Button>
        <Button color="red" onClick={handleCancel}>
          <Icon name="close" />
          Cancel
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default ReusableForm;
