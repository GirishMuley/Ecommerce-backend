const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = await User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //this is just temporary, we will use strong password auth
    console.log({ user });
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      //TODO: We will make addresses independent of login
      res
        .status(200)
        .json({
          id: user.id,
          email: user.email,
          name: user.name,
          addresses: user.addresses,
        });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
