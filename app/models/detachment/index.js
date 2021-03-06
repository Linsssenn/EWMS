const Validator = require("validator");
const isEmpty = require("../helper/is-empty");
class Detachment {
  constructor({ name, address, city, zip, lat, lon }) {
    this.name = name;
    this.address = address;
    this.city = city;
    this.zip = zip;
    this.lat = lat;
    this.lon = lon;
  }

  validDetachment() {
    let errors = {};
    // Check all field if Empty
    Object.entries(this).forEach(([key, value]) => {
      value = !isEmpty(value) ? value : "";
      if (Validator.isEmpty(`${value}`)) {
        errors[key] = `${key} is Required`;
      }
    });
    // Check if lat or long is valid
    if (
      !errors.hasOwnProperty("lat") &&
      !errors.hasOwnProperty("lon") &&
      !Validator.isLatLong(`${this.lat}, ${this.lon}`)
    ) {
      errors["latlong"] = `latlong must be a valid latitude-longitude format`;
    }
    if (isEmpty(errors)) {
      return { success: this };
    }
    return { error: errors };
  }

  // Private method
  excludeFields(excludeKey) {
    // const excludeKey = ["name", "address"];
    const value = Object.keys(this).reduce((result, key) => {
      if (!excludeKey.includes(key) && this[key] !== undefined) {
        result[key] = this[key];
      }
      return result;
    }, {});
    return value;
  }
}

module.exports = Detachment;
