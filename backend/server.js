const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const AdminModel = require("./models/Admin");
const UserModel = require("./models/User");
const FeedModel = require("./models/Feed");
const OwnerModel = require("./models/Owner");
const ApartmentModel = require("./models/Apartment");
const PaymentModel = require("./models/Payment");

const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

mongoose.connect("mongodb://127.0.0.1:27017/Flat_Rental");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "The token was not available" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Token is wrong" });
      }
      console.log("Decoded Token:", decoded);
      req.role = decoded.role;
      req.id = decoded.id;
      req.username = decoded.username;
      req.active = decoded.active;
      next();
    });
  }
};

app.get("/home", verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    role: req.role,
    id: req.id,
    username: req.username,
    active: req.active,
  });
});

app.post("/admin_login", (req, res) => {
  const { username, password } = req.body;

  AdminModel.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (password !== user.password) {
        return res.status(401).json({ error: "Incorrect password." });
      }

      const token = jwt.sign(
        {
          role: "admin",
          id: user._id,
          email: user.email,
          username: user.username,
        },
        "jwt-secret-key",
        { expiresIn: "1d" }
      );

      res.cookie("token", token);

      res.json({ message: "Login successful", username: user.username });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Database error." });
    });
});

app.post("/user_register", upload.single("adharImage"), (req, res) => {
  const {
    username,
    address,
    contactNo,
    email,
    password,
    aadharNo,
    question,
    answer,
    gender,
  } = req.body;

  UserModel.findOne({ $or: [{ email: email }] })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with the same email already exists." });
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => {
          const adharImage = req.file ? req.file.filename : null; // Get the adharImage filename

          const newUser = new UserModel({
            username,
            address,
            contactNo,
            email,
            password: hash,
            aadharNo,
            question,
            answer,
            adharImage,
            gender,
          });

          newUser
            .save()
            .then((savedUser) => {
              res.json(savedUser);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "User registration failed." });
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "User registration failed." });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "User registration failed." });
    });
});

app.post(
  "/owner_register",
  upload.fields([
    { name: "adharImage", maxCount: 1 },
    { name: "billImage", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      username,
      address,
      contactNo,
      email,
      password,
      question,
      answer,
      gender,
    } = req.body;

    OwnerModel.findOne({ $or: [{ email: email }] })
      .then((existingOwner) => {
        if (existingOwner) {
          return res
            .status(400)
            .json({ error: "Owner with the same email already exists." });
        }

        bcrypt
          .hash(password, 10)
          .then((hash) => {
            const adharImage = req.files["adharImage"]
              ? req.files["adharImage"][0].filename
              : null;
            const billImage = req.files["billImage"]
              ? req.files["billImage"][0].filename
              : null;

            const newOwner = new OwnerModel({
              username,
              address,
              contactNo,
              email,
              password: hash,
              billImage,
              question,
              answer,
              adharImage,
              gender,
            });

            newOwner
              .save()
              .then((savedOwner) => {
                res.json(savedOwner);
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Owner registration failed." });
              });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Owner registration failed." });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Owner registration failed." });
      });
  }
);

app.post("/userLogin", (req, res) => {
  const { email, password } = req.body;

  // Check in the UserModel
  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // If user not found, check in OwnerModel
        return OwnerModel.findOne({ email: email });
      }

      return user;
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Password comparison failed." });
        }

        if (!result) {
          return res.status(401).json({ error: "Incorrect password." });
        }

        const token = jwt.sign(
          {
            role: user instanceof UserModel ? "user" : "owner",
            id: user._id,
            email: user.email,
            username: user.username,
            active: user.active,
          },
          "jwt-secret-key",
          { expiresIn: "1d" }
        );

        res.cookie("token", token);

        res.json({ message: "Login successful", username: user.username });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Database error." });
    });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Logout successful" });
});

// Admin Code Start

app.get("/userList", (req, res) => {
  UserModel.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve User data" });
    });
});

app.get("/ownerList", (req, res) => {
  OwnerModel.find()
    .then((owner) => {
      res.json(owner);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Owner data" });
    });
});

app.get("/feedbackList", (req, res) => {
  FeedModel.find()
    .populate("userId", ["username", "email", "contactNo", "gender"]) // Populate the 'userId' field with the specified fields from the 'User' model
    .then((feed) => {
      res.json(feed);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Feed data" });
    });
});

app.post(
  "/addApartment",
  verifyUser,
  upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        address,
        city,
        state,
        furnish,
        atype,
        ebill,
        extra,
        gender,
        rent,
      } = req.body;
      const ownerId = req.id;

      const pic1 = req.files["pic1"] ? req.files["pic1"][0].filename : null;
      const pic2 = req.files["pic2"] ? req.files["pic2"][0].filename : null;
      const pic3 = req.files["pic3"] ? req.files["pic3"][0].filename : null;
      const pic4 = req.files["pic4"] ? req.files["pic4"][0].filename : null;

      const newApartment = new ApartmentModel({
        name,
        address,
        city,
        state,
        furnish,
        atype,
        ebill,
        extra,
        gender,
        rent,
        pic1,
        pic2,
        pic3,
        pic4,
        ownerId,
      });

      const savedApartment = await newApartment.save();
      res.json(savedApartment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Apartment registration failed." });
    }
  }
);

app.get("/apartmentList", (req, res) => {
  ApartmentModel.find()
    .populate("ownerId", ["username", "contactNo"]) // Populate the 'userId' field with the specified fields from the 'User' model
    .then((apartment) => {
      res.json(apartment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Apartment data" });
    });
});

app.get("/apartmentListO", verifyUser, (req, res) => {
  const ownerId = req.id;  // Use the owner's ID from the token
  console.log("Owner ID:", ownerId);
  ApartmentModel.find({ ownerId: ownerId })
    .populate("ownerId", ["username"])  // Populate the 'userId' field with the specified fields from the 'User' model
    .then((apartment) => {
      res.json(apartment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Apartment data" });
    });
});

app.get("/apartmentDetails/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const apartment = await ApartmentModel.findById(id).populate("ownerId", [
      "username",
      "email",
      "contactNo",
      "gender",
    ]); // Replace with the fields you want to retrieve from OwnerModel

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found." });
    }

    res.json(apartment);
  } catch (error) {
    console.error("Error fetching apartment details:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.delete('/deleteApartment/:id', async (req, res) => {
  const apartmentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
    return res.status(400).json({ error: 'Invalid apartment ID.' });
  }

  try {

    await PaymentModel.deleteMany({ apid: apartmentId });

    const deletedApartment = await ApartmentModel.findByIdAndDelete(apartmentId);

    if (!deletedApartment) {
      return res.status(404).json({ error: 'Apartment not found.' });
    }

    res.status(200).json({ Status: 'Success', message: 'Apartment, associated bookings, and cart items deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete apartment, items.' });
  }
});

app.get("/userDetails/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "user not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.put("/toggleUserStatus/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    user.active = !user.active; // Toggle the 'active' field
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/ownerDetails/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const owner = await OwnerModel.findById(id);
    if (!owner) {
      return res.status(404).json({ error: "owner not found." });
    }

    res.json(owner);
  } catch (error) {
    console.error("Error fetching owner details:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.put("/toggleOwnerStatus/:id", async (req, res) => {
  const ownerId = req.params.id;

  try {
    const owner = await OwnerModel.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found." });
    }
    owner.active = !owner.active; // Toggle the 'active' field
    const updatedOwner = await owner.save();

    res.json(updatedOwner);
  } catch (error) {
    console.error("Error toggling owner status:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.put("/toggleApartmentStatus/:id", async (req, res) => {
  const apartmentId = req.params.id;

  try {
    const apartment = await ApartmentModel.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: "apartment not found." });
    }
    apartment.active = !apartment.active; // Toggle the 'active' field
    const updatedApartment = await apartment.save();

    res.json(updatedApartment);
  } catch (error) {
    console.error("Error toggling apartment status:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});
// Admin Code End

app.get("/cprofile", verifyUser, async (req, res) => {
  const userId = req.id;
  try {
    const user = await UserModel.findOne({ _id: userId });
    res.json({ Status: "Success", Result: user });
  } catch (error) {
    res.status(500).json({ Status: "Error", Error: error.message });
  }
});

app.get("/oprofile", verifyUser, async (req, res) => {
  const ownerId = req.id;
  try {
    const owner = await OwnerModel.findOne({ _id: ownerId });
    res.json({ Status: "Success", Result: owner });
  } catch (error) {
    res.status(500).json({ Status: "Error", Error: error.message });
  }
});

app.post("/addFeedback", verifyUser, (req, res) => {
  const { description } = req.body;
  const userId = req.id;
  FeedModel.create({
    description,
    userId: userId,
  })
    .then((feedback) => {
      res.json(feedback);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to add feedback." });
    });
});

app.post("/payment", verifyUser, async (req, res) => {
  try {
    const { apid, cardno, nameoncard, amount } = req.body;
    const userId = req.id;

    // Check if there is a previous payment (including canceled payments) for the specified apartment
    const existingPayment = await PaymentModel.findOne({ apid, userId });

    if (existingPayment) {
      // If the previous payment was canceled, update its status and details
      if (existingPayment.status === "Canceled") {
        existingPayment.cardno = cardno;
        existingPayment.nameoncard = nameoncard;
        existingPayment.amount = amount;

        // Check if the status is "Booked," and return an error
        if (existingPayment.status === "Booked") {
          return res
            .status(400)
            .json({ status: "Error", error: "Apartment is already booked" });
        }

        existingPayment.status = "Booked"; // Assuming 'Booked' is the status for a booked apartment
        await existingPayment.save();

        return res
          .status(200)
          .json({
            status: "Success",
            message: "Payment details updated successfully",
            payment: existingPayment,
          });
      } else {
        // If there is an active payment, return an error
        return res
          .status(400)
          .json({
            status: "Error",
            error: "Payment already made for this apartment",
          });
      }
    }

    // If there is no existing payment, create a new payment
    const payment = await PaymentModel.create({
      apid,
      cardno,
      nameoncard,
      amount,
      userId,
    });

    res
      .status(200)
      .json({ status: "Success", message: "Payment successful", payment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "Error", error: "Failed to process payment." });
  }
});

app.get("/userBooking", verifyUser, (req, res) => {
  const userId = req.id;
  PaymentModel.find({ userId: userId })
    .populate({
      path: "apid",
      select: "name ownerId address city rent", // Add the fields you want to select
      populate: {
        path: "ownerId",
        select: "username",
      },
    })
    .then((apartment) => {
      res.json(apartment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Apartment data" });
    });
});

app.get("/ownerBooking", verifyUser, (req, res) => {
  const ownerId = req.id;

  ApartmentModel.findOne({ ownerId: ownerId }) // Use findOne instead of find
    .then((apartment) => {
      if (!apartment) {
        return res.status(404).json({ error: "Apartment not found." });
      }

      PaymentModel.find({ apid: apartment._id })
        .populate({
          path: "userId",
          select: "username address gender email",
        })
        .populate({
          path: "apid",
          select: "name status rent",
        })
        .then((payments) => {
          res.json(payments);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Failed to retrieve payment data" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Apartment data" });
    });
});

app.put("/cancelBooking/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    const updatedBooking = await PaymentModel.findByIdAndUpdate(
      bookingId,
      { status: "Cancelled" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling booking" });
  }
});

app.put("/bookedBooking/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    const updatedBooking = await PaymentModel.findByIdAndUpdate(
      bookingId,
      { status: "Booked" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling booking" });
  }
});

app.get("/bookingUserList/:id", (req, res) => {
  const apartmentId = req.params.id;
  PaymentModel.find({ apid: apartmentId })
    .populate({
      path: "userId",
      select: "username gender address contactNo",
    })
    .then((apartment) => {
      res.json(apartment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve Apartment data" });
    });
});

app.put('/user_changePassword', verifyUser, (req, res) => {
  const userId = req.id;
  const { currentPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      bcrypt.compare(currentPassword, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Password comparison failed.' });
        }

        if (!result) {
          return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        bcrypt.hash(newPassword, 10, (hashErr, hash) => {
          if (hashErr) {
            return res.status(500).json({ error: 'Password hashing failed.' });
          }

          user.password = hash;
          user.save()
            .then((updatedUser) => {
              // Password changed successfully
              res.status(200).json({ message: 'Password changed successfully' });
            })
            .catch((saveErr) => {
              console.error(saveErr);
              res.status(500).json({ error: 'User update failed.' });
            });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Password change failed.' });
    });
});

app.put('/owner_changePassword', verifyUser, (req, res) => {
  const userId = req.id;
  const { currentPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  OwnerModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      bcrypt.compare(currentPassword, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Password comparison failed.' });
        }

        if (!result) {
          return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        bcrypt.hash(newPassword, 10, (hashErr, hash) => {
          if (hashErr) {
            return res.status(500).json({ error: 'Password hashing failed.' });
          }

          user.password = hash;
          user.save()
            .then((updatedUser) => {
              // Password changed successfully
              res.status(200).json({ message: 'Password changed successfully' });
            })
            .catch((saveErr) => {
              console.error(saveErr);
              res.status(500).json({ error: 'User update failed.' });
            });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Password change failed.' });
    });
});

app.get('/search', async (req, res) => {
  try {
    const { gender, atype, furnish } = req.query;

    const searchQuery = {};
    if (gender && gender !== 'All') {
      searchQuery.gender = gender;
    }
    if (atype && atype !== 'All') {
      searchQuery.atype = atype;
    }
    if (furnish && furnish !== 'All') {
      searchQuery.furnish = furnish;
    }

    const searchResults = await ApartmentModel.find(searchQuery).populate("ownerId", ["username", "contactNo"]);;

    if (searchResults.length > 0) {
      res.json({ status: 'Success', results: searchResults });
    } else {
      res.json({ status: 'NoResults', message: 'Search No Data Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
});

app.put('/admin-change', verifyUser, (req, res) => {
  const userId = req.id;
  const { currentPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  AdminModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Compare the provided current password with the stored password (not recommended)
      if (currentPassword !== user.password) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }

      // Update the user's password with the new password (not recommended)
      user.password = newPassword;
      user.save()
        .then((updatedUser) => {
          // Password changed successfully
          res.status(200).json({ message: 'Password changed successfully' });
        })
        .catch((saveErr) => {
          console.error(saveErr);
          res.status(500).json({ error: 'User update failed.' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Password change failed.' });
    });
});

app.post("/reset", async (req, res) => {
  const { email, question, answer, pwd, confirmPwd } = req.body;

  try {
    // Check against UserModel
    let user = await UserModel.findOne({ email, question });

    // If user not found in UserModel, check against OwnerModel
    if (!user) {
      user = await OwnerModel.findOne({ email, question });

      if (!user) {
        return res.status(404).json({ error: "User not found or security question does not match." });
      }
    }

    if (answer !== user.answer) {
      return res.status(400).json({ error: "Incorrect answer to security question." });
    }

    if (pwd !== confirmPwd) {
      return res.status(400).json({ error: "New password and confirm password do not match." });
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password. Please try again later." });
  }
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
