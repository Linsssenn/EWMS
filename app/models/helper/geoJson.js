class GeoJsonHelper {
  constructor(rows) {
    this.type = "FeatureCollection";
    this.features = this.createFeatures(rows);
  }

  // On2 bad implementation
  createFeatures(rows) {
    const features = [];
    // Loop 1
    for (let index = 0; index < rows.length; index++) {
      let { lat, lon } = rows[index];

      const geometry = {
        type: "Point",
        coordinates: [lon, lat],
      };

      const excludeFields = ["lon", "lat"];
      const items = { ...rows[index] };
      // Loop 2
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
