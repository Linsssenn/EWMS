const pool = require("../../../bin/databasePool");

class GeoJsonHelper {
  constructor(rows) {
    this.type = "FeatureCollection";
    this.features = this.createFeatures(rows);
  }
  createFeatures(rows) {
    const features = [];
    for (let index = 0; index < rows.length; index++) {
      let { id, name, lat, lon } = rows[index];

      const geometry = {
        type: "Point",
        coordinates: [lon, lat],
      };
      const item = {
        f1: id,
        f2: name,
      };
      const feature = {
        type: "Feature",
        properties: item,
        geometry,
      };

      features.push(feature);
    }

    return features;
  }
}

module.exports = GeoJsonHelper;
