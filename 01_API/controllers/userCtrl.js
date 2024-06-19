const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMe = require("../middleware/authMe");

const userCtrl = {
  // register: async (req, res) => {
  //   try {
  //     const { name, email, password } = req.body;

  //     const user = await Users.findOne({ email });

  //     if (user)
  //       return res.status(400).json({ msg: 'The email already exists.' });

  //     if (password.length < 6)
  //       return res
  //         .status(400)
  //         .json({ msg: 'Password is at least 6 characters long.' });
  //     // Password Encryption
  //     const passwordHash = await bcrypt.hash(password, 10);
  //     const newUser = new Users({
  //       name,
  //       email,
  //       password: passwordHash,
  //     });
  //     // Save mongodb
  //     await newUser.save();
  //     // Then create jsonwebtoken to authentication
  //     const accesstoken = createAccessToken({ id: newUser._id });
  //     const refreshtoken = createRefreshToken({ id: newUser._id });

  //     res.cookie('refreshtoken', refreshtoken, {
  //       httpOnly: true,
  //       path: '/user/refresh_token',
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  //     });
  //     res.json({ accesstoken });
  //   } catch (err) {
  //     console.log(err.message);
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  ////register test
  register: async (req, res) => {
    try {
      const { name, phone, email, password } = req.body;

      const user = await Users.findOne({ email });

      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });
      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        phone,
        email,
        password: passwordHash,
      });
      // Save mongodb
      await newUser.save();
      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.json({ accesstoken });
    } catch (err) {
      console.log(err.message, "12222");
      return res.status(500).json({ msg: err.message });
    }
  },
  //////////// edit

  editTT: async (req, res) => {
    const userId = req.params.userId;
    const { name, phone, email } = req.body;

    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await Users.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Cập nhật thông tin người dùng
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.email = email || user.email;

      // Lưu vào cơ sở dữ liệu
      await user.save();
      console.log("Edited user information in the database:", {
        userId,
        name,
        phone,
        email,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error editing user information in the database:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  ////////////
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "User does not existtt." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      // console.log(req.cookies.refreshtoken,'rể')
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Registeraaaaa" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Registerbbbbb" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const userID = await authMe(req);
      const user = await Users.findById(userID).select("-password");
      if (!user)
        return res.status(400).json({ msg: "User does not existttt." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserName: async (req, res) => {
    try {
      // Tìm user trong bảng User dựa trên ID
      const user = await Users.find();
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user); // Trả về thông tin user
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userID = await authMe(req);
      const { pet, avatar, birthday, sex, fullName, phone, address } = req.body;
      const user = await Users.findById(userID);
      if (!user)
        return res.status(400).json({ message: "User does not exist." });
      if (pet) user.pet = pet;
      if (avatar) user.avatar = avatar;
      if (birthday) user.birthday = birthday;
      if (sex) user.sex = sex;
      if (fullName) user.fullName = fullName;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      await user.save();
      res.json(user);
    } catch (err) {
      console.log(err, "user 228");
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(userId);

      // Kiểm tra xem người dùng có tồn tại không
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      // Xóa người dùng
      await Users.findByIdAndDelete(userId);

      res.status(200).json({ msg: "User deleted successfully." });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
