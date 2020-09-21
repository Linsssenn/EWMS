import { MapLayer } from "react-leaflet";
import L from "leaflet";

import { withLeaflet } from "react-leaflet";

// Create custom leaflet element
class Routing extends MapLayer {
  createLeafletElement() {
    const { map } = this.props;
    const mapboxAccessToken =
      "pk.eyJ1IjoibGluc3NlbjIxIiwiYSI6ImNqeGtlcmJpZzIyeWkzb3A2OTZsZzF4ZWEifQ.F14e7oxmLNmrKc135JAGPQ";
    let leafletElement = L.Routing.control({
      createMarker: function () {
        return null;
      },
      lineOptions: {
        addWaypoints: false,
        styles: [{ color: "#0984e3", weight: 7 }],
      },
      router: L.Routing.mapbox(mapboxAccessToken, {
        profile: "mapbox/driving",
        language: "en",
      }),
      show: false,
    }).addTo(map.current.leafletElement);

    return leafletElement.getPlan();
  }

  // componentDidMount() {
  //   console.log(this.leafletElement);
  //   this.leafletElement.setWaypoints([
  //     L.latLng(14.291301, 120.977593),
  //     L.latLng(14.230774065876195, 120.9529495239258),
  //   ]);
  // }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.directions) !==
      JSON.stringify(prevProps.directions)
    ) {
      console.log(prevProps, this.props);
      this.setWayPoint();
    }
  }

  // fires when receive props
  setWayPoint = () => {
    const { directions } = this.props;

    if (directions.length !== 0) {
      this.leafletElement.setWaypoints([
        L.latLng(directions[0].lat, directions[0].lon),
        L.latLng(directions[1].lat, directions[1].lon),
      ]);
    }
  };
}

export default withLeaflet(Routing);
