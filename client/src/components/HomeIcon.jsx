import L from "leaflet";
import home from "../assets/home.png";

const homeIcon = new L.Icon({
  iconUrl: home,
  iconRetinaUrl: home,
  iconSize: [39, 40],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [35, 40],
  shadowAnchor: [7, 21],
});

export default homeIcon;
