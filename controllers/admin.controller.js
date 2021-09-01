const User = require('../models/user.model');
const Institute = require('../models/admin.model');
const Student = require('../models/student.model');
const Approver = require('../models/approver.model');
const Department = require('../models/department.model');
const External = require('../models/externalUser.model');


//dashbord part

// get total number of students

exports.countUser = (req, res) => {
  User.countDocuments({'role' :'user'})
  .then(user => res.json(user))
  .catch(err => res.status(400).json('Error:' + err));
}

// get total number of approver

exports.countApprover = (req, res) => {
  User.countDocuments({'role':'approver'})
  .then(user => res.json(user))
  .catch(err => res.status(400).json('Error:' + err));

}

//get total number of post
exports.countPost = (req, res) => {
  Post.countDocuments()
  .then(post => res.json(post))
  .catch(err => res.status(400).json('Error:' + err));

}

//create admin profile
exports.createInstituteDetail = async (req, res) => {
  const name = req.params.name;

  const {profilepicture, address, phone, email, under } = req.body;
  if (!address) {
    return res.status(401).json({
      status: 'fail',
      message: 'Please provide address'
    })
    // finish the rest of the validation
  }
  if (!phone) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide phone'
    })
  }

  if (!email) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide email'
    })
  }
  if (!under) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide Region/Under'
    })
  }

  try {
    const user = await User.findOne({ name })
    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'user not found'
      })
    }

    if (user.institute) {
      return res.status(400).json({
        status: 'fail',
        message: 'Profile already existed'
      })
    }

    // 1- create new object
    let newInst = new Institute({ name,profilepicture, address, phone, email, under });

    // 2- maintain 1-1 relationship
    newInst.user = user._id;
    user.institute = newInst._id;

    // 3- save each models
    await user.save();
    await newInst.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile successfully created'
    })
  } catch (err) {
    res.status(500).json({
      err
    })
  }

}

exports.getAdminProfile = async (req, res) => {
  const users = await User.find({'role':'admin'}).populate('admin.model');
  res.json({ users })
}


exports.getUser = (req, res) => {
  
  User.find({'role':'user'})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error:' + err));
}
exports.getApprover = (req, res) => {
  
  User.find({'role':'approver'})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error:' + err));
}


exports.createApproverOrUser = async (req, res) => {
  let { name, username, password, passwordConfirm, role } = req.body;

  if (!username) {
    res.status(400).json({
      status: 'fail',
      message: 'Provide username'
    })
  }
  else if (!name) {
    res.status(400).json({
      status: 'fail',
      message: 'Provide name'
    }) 
  }else if (!password || !passwordConfirm) {
    res.status(400).json({
      status: 'fail',
      message: 'Provide password'
    })
  } else if (!role) {
    res.status(400).json({
      status: 'fail',
      message: 'User type should be specified'
    })
  }


  if (password !== passwordConfirm) {
    res.status(400).json({
      status: 'fail',
      message: "Password should match"
    })
  }

  role = role.toLowerCase();

  if (role === "approver" || role === "user") {

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already registered'
      })
    }

    let newUser = new User({ name,username, password, passwordConfirm, role });

    await newUser.save().then(() => {

      return res.status(200).json({
        status: 'succes',
        message: 'registration successful'

      })

    })
  }

}

exports.getUserById = (req, res) => {
  const _id = req.params._id;
  User.findById(_id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "id not found" + _id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({
          message: "error retriving with id" +
            _id
        });
    });
}

exports.updateUser = (req, res) => {
  const { password, username } = req.body;
  const id = req.params.id;
  const newData = { password, username }

  User.updateOne({ _id: id }, newData).then(
    () => {
      res.status(201).json({
        message: 'updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}
exports.updateProfile = (req, res) => {
  const { name, profilepicture, address, phone, email, under } = req.body;
  const id = req.params.id;
  const newData = { name, profilepicture, address, phone, email, under }

  Institute.updateOne({ _id: id }, newData).then(
    () => {
      res.status(201).json({
        message: 'updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}

exports.deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.id }).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}
exports.deleteProfile = (req, res) => {
  Institute.deleteOne({ _id: req.params.id }).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}


// add department

exports.addDepartment = async (req, res) => {
  const {department}= req.body;

  if (!department) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide phone'
    })
  }

 
  let newDep = new Department({ department});

  

  await newDep.save().then(() => {

    return res.status(200).json({
      status: 'succes',
      message: 'registration successful'

    })

  })
}

exports.GetExternalUser = async (req, res)=> {

  const external = await External.find({})
  res.json(external);

}
// add accepted external user to the system
exports.AddExternal = async (req, res) => {
  const name = req.params.name;
  const { username, password, passwordConfirm,role } = req.body;
  if (!username) {
    res.status(400).json({
      status: 'fail',
      message: 'Provide username'
    })
  }
  
  else if (!password || !passwordConfirm) {
    res.status(400).json({
      status: 'fail',
      message: 'Provide password'
    })
  } else if (!role) {
    res.status(400).json({
      status: 'fail',
      message: 'User type should be specified'
    })
  }


  if (password !== passwordConfirm) {
    res.status(400).json({
      status: 'fail',
      message: "Password should match"
    })
  }

  // role = role.toLowerCase();
 
  if (role === "user") {

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already registered'
      })
    }

    let newUser = new User({ name,username, password, passwordConfirm, role });

    await newUser.save().then(() => {

      return res.status(200).json({
        status: 'succes',
        message: 'registration successful'

      })

    })
  }


}
exports.Logout = async(req, res) =>{
  req.logout();
  res.redirect('/');
};