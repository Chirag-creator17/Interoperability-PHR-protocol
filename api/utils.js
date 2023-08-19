const axios = require("axios");
const jwt = require("jsonwebtoken");
const abha_url_base = "https://healthidsbx.abdm.gov.in/api/";
const loginPhone = async (req, res) => {
  const { phone } = req.body;
  // const url = abha_url_base + "/v2/registration/mobile/login/generateOtp";
  // const data = {
  //   mobile: phone,
  // };
  // const headers = { Authorization: process.env.ABHA_TOKEN }
  // const response = await axios.post(url, data, { headers });
  // if(response.status === 200) {
  //   return res.status(200).json({ msg: "OTP sent" });
  // }
  // else {
  //   return res.status(401).json({ msg: "mobile number not registered" });
  // }
  res.status(200).json({ msg: "OTP sent" });
};
const dummyData = {
  txnid: "25c1b379-984c-4b56-a86f-58c386879149",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  mobileLinkedHid: {
    healthIdNumber: "25-8180-3683-5375",
    healthId: "string",
    name: "priya",
    profilePhoto: "string",
    phrAddress: "string",
  },
};
function randonHealthId() {
  const hid = Math.floor(Math.random() * 100000000).toString();
  return hid;
}
const loginOtp = async (req, res) => {
  const { otp, role, phone } = req.body;
  // const url = abha_url_base + "/v2/registration/mobile/login/verifyOtp";
  // const data = {
  //   otp: otp,
  // };
  // const headers = { Authorization: process.env.ABHA_TOKEN };
  // const response = await axios.post(url, data, { headers });
  // if (response.status === 200) {
  //   const data = response.data;
  //   data.mobileLinkedHid.phone = phone;
  //   data.role = role;
  //   const token = jwt.sign(
  //     { health_id: data.mobileLinkedHid.healthIdNumber },
  //     process.env.TOKEN_KEY,
  //     {
  //       expiresIn: "1h",
  //     }
  //   );
  //   data.auth_token = token;
  //   const user_data = {
  //     info: {
  //       name: data.mobileLinkedHid.name,
  //       id: data.mobileLinkedHid.healthIdNumber,
  //       phone: data.mobileLinkedHid.phone,
  //     },
  //     profileType: data.role,
  //     profileUri: data.mobileLinkedHid.profilePhoto,
  //     data: data.mobileLinkedHid.phrAddress,
  //   };
  //   const createUserUrl =
  //     "http://localhost:6969/api/profile/create/" +
  //     data.mobileLinkedHid.healthIdNumber;
  //   const user_response = await axios.post(createUserUrl, user_data);
  //   if (user_response.status === 202 || user_response.status === 200) {
  //     return res.status(200).json({ msg: "OTP verified", data: data });
  //   }
  // } else{
  //   return res.status(401).json({ msg: "OTP not verified" });
  // }
  if (otp === "123456") {
    dummyData.role = role;
    if (role === "doctor") {
      dummyData.mobileLinkedHid.healthId = "91-3174-8241-0451";
      dummyData.mobileLinkedHid.name = "Dr. chiru";
    } else if (role === "diagnostic") {
      dummyData.mobileLinkedHid.healthId = "81-3274-8241-0451";
      dummyData.mobileLinkedHid.name = "atishay";
    } else if (role === "hospital") {
      dummyData.mobileLinkedHid.healthId = "71-3177-8271-0451";
      dummyData.mobileLinkedHid.name = "rishu hospital";
    } else if (role === "clinic") {
      dummyData.mobileLinkedHid.healthId = "61-3174-8241-0451";
      dummyData.mobileLinkedHid.name = "golu clinic";
    }
    dummyData.mobileLinkedHid.healthId = randonHealthId();
    dummyData.mobileLinkedHid.phone = phone;
    const token = jwt.sign(
      { health_id: dummyData.mobileLinkedHid.healthIdNumber },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    dummyData.auth_token = token;
    const user_data = {
      info: {
        name: dummyData.mobileLinkedHid.name,
        id: dummyData.mobileLinkedHid.healthIdNumber,
        phone: dummyData.mobileLinkedHid.phone,
      },
      profileType: dummyData.role,
      profileUri: dummyData.mobileLinkedHid.profilePhoto,
      data: dummyData.mobileLinkedHid.phrAddress,
    };
    user_data.id = dummyData.mobileLinkedHid.healthIdNumber;
    const createUserUrl = "http://localhost:6969/api/profile/create";
    const user_response = await axios.post(createUserUrl, user_data);
    if (user_response.status === 202 || user_response.status === 200) {
      return res.status(200).json(dummyData);
    }
  } else {
    return res.status(401).json({ msg: "OTP not verified" });
  }
};
const getPHR = async (req, res) => {
  const { abhaID } = req.body;
  console.log(abhaID);
  res.status(200).json({ msg: "got abha ID" });
};
module.exports = {
  loginPhone,
  loginOtp,
  getPHR,
};
