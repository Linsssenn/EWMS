import React, { Component } from "react";
import { GeoJSON, FeatureGroup, Popup, Tooltip } from "react-leaflet";

import L from "leaflet";
import GeoJsonHelper from "../util/geoJson";

class GeoJsonLayer extends Component {
  render() {
    const { data, custom } = this.props;
    const geoJson = new GeoJsonHelper(data);

    return (
      <FeatureGroup>
        {geoJson.features.map((value, index) => {
          return (
            <GeoJSON
              key={`${value.id}${index}`}
              data={value}
              pointToLayer={(feature, latlng) => {
                if (custom) {
                  return L.marker(latlng, { icon: custom });
                }
                return L.marker(latlng);
              }}
            >
              <Popup>
                {Object.entries(value.properties).map(([key, value], index) => (
                  <div key={index}>
                    <span>{key}: </span>
                    {value}
                  </div>
                ))}
                coordinates:
                {Object.values(value.geometry.coordinates).map(
                  (value, index) => (
                    <div key={index}>{value}</div>
                  )
                )}
              </Popup>

              <Tooltip>{value.properties.name}</Tooltip>
            </GeoJSON>
          );
        })}
      </FeatureGroup>
    );
  }
}

export default GeoJsonLayer;
