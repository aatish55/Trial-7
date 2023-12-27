const Mongoose = require("mongoose")
const OtpSchema = Mongoose.Schema({
    email: String,
    otp: String,
    otpid: String
})
const OtpModel = Mongoose.model("Otp",OtpSchema);
module.exports = OtpModel;