const profileInfo = (profileType, data) => {
  try {
    // if (data.phone.length != 10) throw new Error('incorrect phone no') // fix this length
    switch (profileType) {
      case "patient":
        return {
          name: data.name,
          id: data.id,
          phone: data.phone,
        };

      case "doctor":
        return {
          name: data.name,
          degree: data.degree,
          specialisations: data.specialisations,
          phone: data.phone,
        };

      case "diaganostic":
        return {
          name: data.degree,
          degree: data.degree,
          specialisations: data.specialisations,
          phone: data.phone,
        };

      case "hospital":
        return {
          name: data.name,
          address: data.address,
          brochure: data.brochure,
          phone: data.phone,
        };

      case "clinic":
        return {
          name: data.name,
          address: data.address,
          brochure: data.brochure,
          phone: data.phone,
        };

      default:
        return { err: "incorrect profile type" };
    }
  } catch (err) {
    throw new Error("Missing Data Points for profile", err);
  }
};

const profileTypeCheck = (profileType) => {
  switch (profileType) {
    case "patient":
    case "doctor":
    case "diaganostic":
    case "hospital":
    case "clinic":
      return true;

    default:
      return false;
  }
};

module.exports = {
  profileInfo,
  profileTypeCheck,
};
