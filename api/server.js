const express = require("express");
const app = express();
const cors = require("cors");
const port = 6969;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/api/login", require("./routes/api.login"));
app.use("/api/dashboard", require("./routes/api.dashboard"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
