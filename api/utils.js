const axios = require("axios");
const jwt = require("jsonwebtoken");

const loginPhone = async (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  res.status(200).json({ otp: "965723" });
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
  const { otp, role } = req.body;
  if (otp) {
    dummyData.role = role;
    dummyData.mobileLinkedHid.healthId = randonHealthId();
    const token = jwt.sign(
      { health_id: dummyData.mobileLinkedHid.healthIdNumber },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    dummyData.auth_token = token;
    if (role === "user") {
      return res.status(200).json(dummyData);
    } else {
      dummyData.mobileLinkedHid.healthIdNumber = "25-8000-3683-6969";
      return res.status(200).json(dummyData);
    }
  } else {
    return res.status(400).json({ msg: "Invalid OTP" });
  }
  //   console.log(otp, role);
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
