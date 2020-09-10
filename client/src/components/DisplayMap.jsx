import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import GeoJsonLayer from "./GeoJsonLayer";

import L from "leaflet";
import home from "../assets/home.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DisplayMap = (props, ref) => {
  const DEFAULT_POSITION = [14.216464, 120.97084];
  const homeIcon = new L.Icon({
    iconUrl: home,
    iconRetinaUrl: home,
    iconSize: [39, 40],
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    shadowSize: [35, 40],
    shadowAnchor: [7, 21],
  });

  const { data, type } = props;

  return (
    <Map
      center={DEFAULT_POSITION}
      zoom={13}
      ref={ref}
      style={{ width: "100%", height: "500px", zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJsonLayer
        data={data}
        custom={type === "employee" ? homeIcon : false}
      />
      {/* <Marker icon={homeIcon} position={DEFAULT_POSITION}>
        <Popup>
          A pretty CSS3 popup.
          <br />
          Easily customizable.
        </Popup>
      </Marker> */}
    </Map>
  );
};

export default React.forwardRef(DisplayMap);
