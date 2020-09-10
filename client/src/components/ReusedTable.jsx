import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

class ReusedTable extends Component {
  generateHeader = (header) => {
    let result = [];

    for (let index = 0; index < header.length; index++) {
      result.push(
        <Table.HeaderCell key={index}>
          {/* Convert first letter to uppercase */}
          {header[index].charAt(0).toUpperCase() + header[index].slice(1)}
        </Table.HeaderCell>
      );
    }
    return result;
  };

  generateBody = (data, header, locate) =>
    !!data &&
    data.map((value, index) => (
      <Table.Row key={index}>
        {!!header &&
          header.map((header, index) => (
            <Table.Cell key={`${header}${index}`}>{value[header]}</Table.Cell>
          ))}

        <Table.Cell>
          <Button
            icon
            labelPosition="left"
            color="teal"
            onClick={() => this.flyTo(value.lat, value.lon)}
          >
            <Icon name="location arrow" /> LOCATE
          </Button>
        </Table.Cell>
      </Table.Row>
    ));

  flyTo = (lat, lang) => {
    // Forwaded refs
    const map = this.props.mapRef.current;

    if (map && lat && lang != null) {
      map.leafletElement.flyTo([lat, lang], 16);
    }
  };

  render() {
    const { data, header } = this.props;

    return (
      <Table celled size="large">
        <Table.Header>
          <Table.Row>{this.generateHeader(header)}</Table.Row>
        </Table.Header>

        <Table.Body>{this.generateBody(data, header)}</Table.Body>
      </Table>
    );
  }
}

export default ReusedTable;
