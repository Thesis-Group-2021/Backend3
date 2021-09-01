const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
//const gridfs = require("gridfs-stream");
const fs = require('fs');
//const imageRoutes = require('./routes/image');
testAPIRouter = require("./routes/testAPI");

// Bring in the app constants
const { DB, DBL, PORT } = require("./config");

// Initialize the application
const app = exp();


// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());



// User Router Middleware
app.use('/admin', require("./routes/admin.route"));
app.use('/student', require("./routes/student.route"));
app.use("/approver", require("./routes/approver.route"));
app.use("/api/auth", require("./routes/auth"));
app.use("/department", require("./routes/department.route"));
app.use("/superadmin", require("./routes/user.route"));
app.use('/upload', require("./routes/upload.route"));
app.use('/Euser', require("./routes/externalUser.route"));

// admin/register = registers user or approver
//app.use("/admin", require("./routes/user.route"));



app.use("/testAPI",testAPIRouter);

const startApp = async () => {
  try {
    // Connection With DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${DB}`,
      badge: true
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp();