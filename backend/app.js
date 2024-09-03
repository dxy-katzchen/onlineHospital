const express = require("express");
const cors = require("cors");
const joi = require("joi");
const expressJWT = require("express-jwt");
const { jwtSecretKey } = require("./config");
const patientRouter = require("./router/patient");
const doctorRouter = require("./router/doctor");
const adminRouter = require("./router/admin");
const departmentRouter = require("./router/department");
const appointmentRouter = require("./router/appointment");
const medicalHisotoryRouter = require("./router/medical_history");
const drugRouter = require("./router/drug");
const psRouter = require("./router/prescription");
const videoRouter = require("./router/video");
const consultationRouter = require("./router/consultation");
const avatarRouter = require("./router/avatar");
const http = require("http");

const app = express();
const server = http.createServer(app);
const initializeSockets = require("./utils/socket");
initializeSockets(server);

//优化res.send()
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});
app.use(
  expressJWT
    .expressjwt({ secret: jwtSecretKey, algorithms: ["HS256"] })
    .unless({ path: [/^\/user\//] })
  // .unless({ path: [/^\/mmm\/user\//] })
);
// app.use(cors());
app.use(
  cors({
    origin: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use("/user/patient", patientRouter);
app.use("/user/doctor", doctorRouter);
app.use("/user/admin", adminRouter);
app.use("/department", departmentRouter);
app.use("/appointment", appointmentRouter);
app.use("/medicalHistory", medicalHisotoryRouter);
app.use("/drug", drugRouter);
app.use("/prescription", psRouter);
app.use("/videoToken", videoRouter);
app.use("/consultation", consultationRouter);
app.use("/avatar", avatarRouter);

//Define error level middleware at the back of all routes
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败!");

  res.cc(err);
});

server.listen(88, () => {
  console.log("Server is running at http://127.0.0.1:88");
});
