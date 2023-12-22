const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  return res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.send(users);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const userId = Number(req.params.id);
    const user = users.find((user) => user.id === userId);
    return res.json(user);
  })
  .patch((req, res) => {
    const patchId = Number(req.params.id);
    const patchUser = users.find((user) => user.id === patchId);
    const userIndex = users.indexOf(patchUser);
    const updatedUser = Object.assign(patchUser, req.body);
    users[userIndex] = updatedUser;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      res.status(200).json({
        status: "success",
        data: {
          updatedUser,
        },
      });
    });
    return res.json({ status: "success" });
  })
  .delete((req, res) => {
    const delId = Number(req.params.id);
    const delUser = users.find((user) => user.id === delId);
    if (!delUser) {
      return res.status(404).json({
        status: "fail",
        message: "No object with this ID is found",
      });
    }
    const index = users.indexOf(delUser);

    users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      res.status(204).json({
        status: "success",
        data: null,
      });
    });
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}...`));
