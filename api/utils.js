const axios = require("axios");

const loginPhone = async (req, res) => {
    const { phone } = req.body;
    console.log(phone);
    res.status(200).json({ msg: "got phone no." });
};
const loginOtp = async (req, res) => {
    const { otp } = req.body;
    console.log(otp);
    res.status(200).json({ msg: "got otp" });
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