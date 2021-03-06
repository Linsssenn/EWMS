import React, { Component } from "react";
import { Link } from "react-router-dom";
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

  generateBody = (data, header, route, redirect, title) =>
    !!data &&
    data.map((value, index) => (
      <Table.Row key={index}>
        {!!header &&
          header.map((header, index) => (
            <Table.Cell key={`${header}${index}`}>{value[header]}</Table.Cell>
          ))}

        <Table.Cell>
          <Button.Group vertical>
            <Button
              icon
              labelPosition="left"
              color="teal"
              onClick={() => this.flyTo(value.lat, value.lon)}
            >
              <Icon name="map marker alternate" /> LOCATE
            </Button>

            {!!route && (
              <Button
                icon
                labelPosition="left"
                color="teal"
                onClick={() => route({ lat: value.lat, lon: value.lon })}
              >
                <Icon name="location arrow" /> DIRECTIONS
              </Button>
            )}
          </Button.Group>
        </Table.Cell>

        {!!redirect && (
          <Table.Cell>
            {" "}
            <Button
              as={Link}
              icon
              labelPosition="left"
              color="teal"
              to={`${redirect}${value.id}`}
            >
              <Icon name="crosshairs" /> Nearest {title}
            </Button>
          </Table.Cell>
        )}
      </Table.Row>
    ));

  flyTo = (lat, lang) => {
    // Forwaded refs
    const map = this.props.mapRef.current;
    console.log(map && lat && lang != null);
    if (map != null) {
      map.leafletElement.setView([lat, lang], 16);
    }
  };

  render() {
    const {
      data,
      header,
      specifiedHeader,
      route,
      redirect,
      title,
    } = this.props;
    console.log(data);
    return (
      <Table celled size="large">
        <Table.Header>
          <Table.Row>
            {!!specifiedHeader
              ? this.generateHeader(specifiedHeader)
              : this.generateHeader(header)}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.generateBody(data, header, route, redirect, title)}
        </Table.Body>
      </Table>
    );
  }
}

export default ReusedTable;
