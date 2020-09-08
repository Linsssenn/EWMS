class GeoJsonHelper {
  constructor(rows) {
    this.type = "FeatureCollection";
    this.features = this.createFeatures(rows);
  }

  createFeatures(rows) {
    const features = [];
    for (let index = 0; index < rows.length; index++) {
      let { lat, lon } = rows[index];

      const geometry = {
        type: "Point",
        coordinates: [lon, lat],
      };

      const excludeFields = ["lon", "lat"];
      const items = { ...rows[index] };
      excludeFields.forEach((element) => delete items[element]);

      const feature = {
        type: "Feature",
        properties: items,
        geometry,
      };

      features.push(feature);
    }

    return features;
  }
}

module.exports = GeoJsonHelper;
