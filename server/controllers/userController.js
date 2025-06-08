import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

// POST request - login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    createJWT(res, user._id);

    user.password = undefined;

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      role: user.role,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

// POST - Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, role, title } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists" });
  }

  // 6 haneli doğrulama kodu üret
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: role === "admin",
    role,
    title,
    isEmailVerified: false,
    emailVerificationCode: verificationCode,
    emailVerificationCodeExpires: verificationCodeExpires,
  });

  if (user) {
    try {
      // 6 haneli kodu e-posta ile gönder
      const emailSent = await sendVerificationEmail(email, verificationCode);
      if (!emailSent) {
        console.error("Email gönderilemedi");
        return res.status(500).json({
          status: false,
          message: "Email gönderilemedi"
        });
      }
    user.password = undefined;
      res.status(201).json({
        status: true,
        message: "Registration successful. Please check your email for the verification code.",
        user
      });
    } catch (error) {
      console.error("Email gönderme hatası:", error);
      return res.status(500).json({
        status: false,
        message: "Email gönderme hatası"
      });
    }
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }
});

// POST -  Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @GET -   Get user profile
// const getUserProfile = asyncHandler(async (req, res) => {
//   const { userId } = req.user;

//   const user = await User.findById(userId);

//   user.password = undefined;

//   if (user) {
//     res.json({ ...user });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  const user = await User.find(query).select("name title role email isActive");

  res.status(201).json(user);
});

// @GET  - get user notifications
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notice = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(200).json(notice);
});

// @GET  - get user task status
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const tasks = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(tasks);
});

// @GET  - get user notifications
const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }
    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
  }
});

// PUT - Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id =
    isAdmin && userId === _id
      ? userId
      : isAdmin && userId !== _id
      ? _id
      : userId;

  const user = await User.findById(id);

  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    // Email ve role alanlarının güncellenmesini engelliyoruz
    // user.email = req.body.email || user.email;
    // user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - active/disactivate user profile
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `User account has been ${
        user?.isActive ? "activated" : "disabled"
      }`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // Remove this condition
  if (userId === "65ff94c7bb2de638d0c73f63") {
    return res.status(404).json({
      status: false,
      message: "This is a test user. You can not chnage password. Thank you!!!",
    });
  }

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `Password chnaged successfully.`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// DELETE - delete user account
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

// GET - Verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Resend API'sini kullanarak token'ı doğrula
    const response = await fetch(`https://api.resend.com/verify-email/${token}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        status: false,
        message: "Geçersiz veya süresi dolmuş doğrulama linki"
      });
    }

    // Token geçerliyse kullanıcıyı bul ve güncelle
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Kullanıcıya JWT token oluştur
    createJWT(res, user._id);

    res.status(200).json({
      status: true,
      message: "Email başarıyla doğrulandı",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        role: user.role,
        isEmailVerified: true
      }
    });
  } catch (error) {
    console.error('Email doğrulama hatası:', error);
    res.status(500).json({
      status: false,
      message: "Email doğrulama işlemi sırasında bir hata oluştu"
    });
  }
});

// 6 HANELİ KOD İLE E-POSTA DOĞRULAMA
const verifyCode = asyncHandler(async (req, res) => {
  console.log("GELEN İSTEK:", req.body);
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      status: false,
      message: "E-posta ve doğrulama kodu gereklidir."
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "Kullanıcı bulunamadı."
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      status: false,
      message: "E-posta zaten doğrulanmış."
    });
  }

  if (
    !user.emailVerificationCode ||
    user.emailVerificationCode !== code ||
    !user.emailVerificationCodeExpires ||
    user.emailVerificationCodeExpires < Date.now()
  ) {
    return res.status(400).json({
      status: false,
      message: "Kod hatalı veya süresi dolmuş."
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;
  await user.save();

  // Otomatik login için JWT oluştur
  createJWT(res, user._id);

  res.status(200).json({
    status: true,
    message: "E-posta başarıyla doğrulandı.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      role: user.role,
      isEmailVerified: true
    }
  });
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  verifyEmail,
  verifyCode
};
