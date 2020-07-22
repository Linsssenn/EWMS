import React, { useState, useEffect, createRef } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

export default function Maps(props) {
  let [location, setLocation] = useState(false);
  let [name, setName] = useState("Default");
  let [latlng, setLatLng] = useState({ lat: 14.216464, lng: 120.97084 });

  const icon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
  });

  const mapRef = createRef();
  const geocoder = L.Control.Geocoder.nominatim();

  const handleClick = (event) => {
    const map = mapRef.current;

    if (map != null) {
      map.leafletElement.locate();
      geocoder.reverse(
        event.latlng,
        map.leafletElement.options.crs.scale(map.leafletElement.getZoom()),
        (results) => {
          console.log(results[0]);
          setName(results[0].name);
        }
      );
      setLocation(true);
      setLatLng(event.latlng);
      // Props from AddModal
      if (!!props.toggleLatLong) {
        props.toggleLatLong({ lat: event.latlng.lat, lon: event.latlng.lng });
      }
    }
  };

  const marker = location ? (
    <Marker icon={icon} position={latlng}>
      <Popup>{name}</Popup>
    </Marker>
  ) : null;

  return (
    <Map
      center={latlng}
      length={4}
      onClick={handleClick}
      ref={mapRef}
      zoom={13}
      style={{ width: "100%", height: "500px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker}
    </Map>
  );
}
