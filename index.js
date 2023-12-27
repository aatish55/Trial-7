const Express = require("express")
const Mongoose =require("mongoose")
const BodyParser = require("body-parser")
const Cors = require("cors")

const nodemailer = require('nodemailer');
const OtpModel = require('./models/Otp');


const app= new Express()

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:true}))
app.use(Cors())

Mongoose.connect("mongodb+srv://aatish:aatish@cluster0.euclaxo.mongodb.net/otp2db?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true,})

const port = 3001;
const path = require("path")
app.use(Express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});


app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    // Generate a random alphanumeric OTPID
    const otpid = Math.random().toString(36).substr(2, 10);
  
    // Save the OTP and OTPID to MongoDB
    try {
      const newOtp = new OtpModel ({ email, otp, otpid });
      await newOtp.save();
  
      // Configure Nodemailer to send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aatishskumar25@gmail.com',
          pass: 'wlbk hipy reby uofa',
        },
      });
  
      const mailOptions = {
        from: 'aatishskumar25@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send OTP' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'OTP sent successfully', otpid });
        }
      });
    } catch (error) {
      console.error('Error saving OTP to MongoDB:', error);
      res.status(500).json({ error: 'Failed to save OTP' });
    }
  });

// ... (previous code)

app.post('/check-otp', async (req, res) => {
    const { otp, otpid } = req.body;
  
    try {
      // Find the corresponding OTP entry in the database
      const otpEntry = await OtpModel.findOne({ otpid, otp });
  
      if (otpEntry) {
        // OTP matched successfully
        res.status(200).json({ message: 'OTP matched successfully' });
      } else {
        // OTP does not match
        res.status(400).json({ error: 'OTP does not match' });
      }
    } catch (error) {
      console.error('Error checking OTP:', error);
      res.status(500).json({ error: 'Failed to check OTP' });
    }
  });
  
  // ... (remaining code)
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});