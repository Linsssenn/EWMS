import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

const columnHeader = ["Name", "City"];

class ReusedTable extends Component {
  generateHeader = () => {
    let result = [];

    for (let index = 0; index < columnHeader.length; index++) {
      result.push(
        <Table.HeaderCell key={index}>{columnHeader[index]}</Table.HeaderCell>
      );
    }
    return result;
  };

  generateBody = (data) =>
    !!data &&
    data.map((value, index) => (
      <Table.Row key={index}>
        <Table.Cell>{value.name}</Table.Cell>
        <Table.Cell>{value.city}</Table.Cell>
        <Table.Cell>
          <Button icon labelPosition="left" color="teal">
            <Icon name="edit" /> UPDATE
          </Button>
        </Table.Cell>
      </Table.Row>
    ));

  render() {
    const { data } = this.props;

    return (
      <Table celled size="large">
        <Table.Header>
          <Table.Row>{this.generateHeader()}</Table.Row>
        </Table.Header>

        <Table.Body>{this.generateBody(data)}</Table.Body>
      </Table>
    );
  }
}

export default ReusedTable;
