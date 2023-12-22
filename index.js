const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

// Mongoose Connection
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error..", err));
//Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    job_title: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
        ${allDbUsers
          .map((user) => `<li>${user.first_name}--${user.email}</li>`)
          .join("")}
    </ul>
  `;
  return res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  const result = await User.create({
    first_name: body.first_name,
    email: body.email,
    gender: body.gender,
    last_name: body.last_name,
    job_title: body.job_title,
  });
  return res.status(201).json({ msg: "success" });
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const userName = await User.findById(req.params.id);
    if (!userName) return res.status(404).json({ error: "No User found" });
    return res.json(userName);
  })
  .patch(async (req, res) => {
    const pUser = await User.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ status: "success" });
  })
  .delete(async (req, res) => {
    try {
      const delUser = await User.findByIdAndDelete(req.params.id);
      return res.status(204).json({ msg: "success" });
    } catch (error) {
      return res.status(404);
    }
  });

app.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}...`));
