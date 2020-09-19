import React, { useEffect } from "react";
import { Map, TileLayer } from "react-leaflet";
import GeoJsonLayerMapCluster from "./GeoJsonLayerMapCluster";

import L from "leaflet";
import homeIcon from "./HomeIcon";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DisplayMap = (props, ref) => {
  const DEFAULT_POSITION = [14.216464, 120.97084];

  const { data, type, cluster } = props;

  return (
    <Map
      center={DEFAULT_POSITION}
      zoom={13}
      ref={ref}
      style={{ width: "100%", height: "600px", zIndex: 0 }}
      className="markercluster-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJsonLayerMapCluster
        data={data}
        custom={type === "employee" ? homeIcon : false}
        cluster={cluster ? true : false}
      />
      {props.children}
    </Map>
  );
};

export default React.forwardRef(DisplayMap);
