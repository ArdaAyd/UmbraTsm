const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, title, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat

    const user = await User.create({
      name,
      email,
      password,
      title,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false, // Başlangıçta false olarak ayarla
    });

    if (user) {
      try {
        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationToken);
        
        if (!emailSent) {
          console.error("Email gönderilemedi");
          return res.status(500).json({ message: "Email gönderilemedi" });
        }

        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          title: user.title,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          message: "Kayıt başarılı. Lütfen email adresinizi doğrulayın.",
        });
      } catch (error) {
        console.error("Email gönderme hatası:", error);
        return res.status(500).json({ message: "Email gönderme hatası" });
      }
    }
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email başarıyla doğrulandı" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isEmailVerified) {
        return res.status(401).json({ 
          message: "Lütfen önce email adresinizi doğrulayın",
          isEmailVerified: false 
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
}; 