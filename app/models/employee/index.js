class Employee {
  constructor({ info, address }) {
    (this.info = this.createInfo(info)),
      (this.address = this.createAddress(address));
  }

  createInfo(info) {
    const { name, employmentType, email, homePhone, cellPhone } = info;

    return {
      name: name || "",
      employmentType: employmentType || "",
      email: email || "",
      homePhone: homePhone || null,
      cellPhone: cellPhone || null,
      dateAdded: new Date(),
    };
  }

  createAddress(address) {
    const { city, region, zipCode, lat, lon } = address;

    return {
      city: city || "",
      region: region || "",
      zipCode: zipCode || null,
      lat: lat || null,
      lon: lon || null,
    };
  }
}

module.exports = Employee;
