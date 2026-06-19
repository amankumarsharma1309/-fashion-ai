const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");
const PendingUser = require("./models/PendingUser");
const express = require("express");
const cors = require("cors");



//"Hey Nodemailer, use my Gmail account to send emails." meaning of the below line
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const connectDB = require("./db");

const getRecommendation = require("./recommendationEngine");
const aiExtractor = require("./aiExtractor");
const aiStylist = require("./aiStylist");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-email", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "rishavrajsharma6@gmail.com",
      subject: "FashionAI Test",
      text: "Testing",
    });

    console.log(info);

    res.send("Email sent!");
  } catch (error) {
    console.log(error);
    res.send("Error sending email!");
  }
});

app.post("/send-otp", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return res.json({
      message: "User already exists!",
    });
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const otp = Math.floor(
    100000 + Math.random() * 900000
  );
  const expiresAt = new Date(
    Date.now() + 2 * 60 * 1000
  );
  await PendingUser.deleteOne({
    email,
  });

  await PendingUser.create({
    name,
    email,
    password: hashedPassword,
    otp,
    expiresAt,
  });

  console.log("EMAIL_USER =", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);
  console.log("Sending OTP to:", email);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FashionAI OTP",
      text: `Your FashionAI OTP is ${otp}`,
    });

    console.log("Mail sent:", info.response);
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return res.status(500).json({
      message: "Failed to send OTP",
      error: err.message,
    });
  }
  res.json({
    message: "OTP sent successfully!",
  });
});
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const pendingUser =
    await PendingUser.findOne({ email });

  if (!pendingUser) {
    return res.json({
      message: "No pending signup found!",
    });
  }

  if (pendingUser.otp !== Number(otp)) {
    return res.json({
      message: "Invalid OTP!",
    });
  }
  if (new Date() > pendingUser.expiresAt) {
    return res.json({
      message: "OTP expired!",
    });
  }
  await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  await PendingUser.deleteOne({
    email,
  });

  res.json({
    message: "Signup successful",
  });



});

app.get("/", (req, res) => {
  res.send("Fashion AI Backend Running");
});

app.get("/recommendation", async (req, res) => {
  const message = req.query.message.toLowerCase();

  const recommendation = await aiStylist(message);

  const str = recommendation;
  const arr = str.split("Reason:");

  const product = arr[0].replace("Product:", "").trim();
  const reason = arr[1].trim();

  res.json({
    product,
    reason,
  });
});

app.post("/fashion-recommendation", async (req, res) => {
  const {
    height,
    weight,
    skinTone,
    occasion,
    style,
  } = req.body;

  const recommendation = await aiStylist({
    height,
    weight,
    skinTone,
    occasion,
    style,
  });

  res.json({
    recommendation,
  });
}
);


//signup starts here!


app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1. Empty fields
    if (!name || !email || !password) {
      return res.json({
        message: "All fields are required!",
      });
    }
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 2. Email format
    if (!emailRegex.test(email)) {
      return res.json({
        message: "Please enter a valid email",
      });
    }

    // 3. Existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        message: "User already exists!",
      });
    }

    // 4. Password length
    if (password.length < 8) {
      return res.json({
        message:
          "Password must be at least 8 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//login starts here!

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.json({
      message:
        "Please enter a valid email",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      message: "User not found!",
    });
  }
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch) {
    return res.json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.json({
    message: "Login successful",
    token,
  });
  // Create a token
  //       ↓
  // Put user's ID inside it
  //       ↓
  // Lock it using JWT_SECRET
});
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  const user = await User.findById(
    decoded.userId
  );

  res.json({
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});