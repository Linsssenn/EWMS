import React, { Component } from "react";
import { GeoJSON, FeatureGroup, Popup, Tooltip, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import L from "leaflet";
import GeoJsonHelper from "../util/geoJson";

class GeoJsonLayerMapCluster extends Component {
  render() {
    const { data, custom, cluster } = this.props;
    const geoJson = new GeoJsonHelper(data);

    const GroupComponent = cluster ? MarkerClusterGroup : FeatureGroup;

    const defaultIcon = new L.Icon({
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
    });

    const icon = custom ? custom : defaultIcon;
    return (
      <GroupComponent>
        {geoJson.features.map((value, index) => {
          return (
            // GeoJSON does not work for weird reason
            // <GeoJSON
            //   key={`${value.id}${index}`}
            //   data={value}
            //   pointToLayer={(feature, latlng) => {
            //     if (custom) {
            //       return L.marker(latlng, { icon: custom });
            //     }
            //     return L.marker(latlng);
            //   }}
            // >
            <React.Fragment key={`features${index}`}>
              {!value.geometry.coordinates.includes(null) && (
                <Marker
                  key={JSON.stringify(value.properties)}
                  position={value.geometry.coordinates.reverse()}
                  icon={icon}
                >
                  <Popup>
                    {Object.entries(value.properties).map(
                      ([key, value], index) => (
                        <div key={index}>
                          <span>{key}: </span>
                          {value}
                        </div>
                      )
                    )}
                    coordinates:
                    {Object.values(value.geometry.coordinates).map(
                      (value, index) => (
                        <div key={index}>{value}</div>
                      )
                    )}
                  </Popup>

                  <Tooltip>{value.properties.name}</Tooltip>
                </Marker>
              )}
            </React.Fragment>
            // </GeoJSON>
          );
        })}
      </GroupComponent>
    );
  }
}

export default GeoJsonLayerMapCluster;
