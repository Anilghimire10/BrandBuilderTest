import User from "../model/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, position } = req.body;

    const users = await User.findOne({ email });
    if (users) {
      return res.status(404).json({ message: "Users already exists" });
    }

    const maxPosition = await User.findOne().sort({ position: -1 });

    let newPosition = 1;
    if (maxPosition) {
      newPosition = maxPosition.position + 1;
    }

    const newUser = new User({
      name,
      email,
      position: newPosition,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getalluser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { position, name, email } = req.body;

    const users = await User.findOne({ email });
    if (users) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    let userToUpdate = await User.findById(userId).select(
      "name email position"
    );

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      position !== undefined &&
      (typeof position !== "number" || isNaN(position) || position < 1)
    ) {
      return res.status(400).json({ message: "Invalid position value" });
    }

    userToUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { name, email },
      { new: true }
    );

    if (position !== undefined) {
      const currentPosition = userToUpdate.position;

      const totalUsersCount = await User.countDocuments();

      let newPosition = Math.min(position, totalUsersCount);
      newPosition = Math.max(newPosition, 1);

      if (currentPosition !== newPosition) {
        if (newPosition < currentPosition) {
          await User.updateMany(
            { position: { $gte: newPosition, $lt: currentPosition } },
            { $inc: { position: 1 } }
          );
        } else {
          await User.updateMany(
            { position: { $gt: currentPosition, $lte: newPosition } },
            { $inc: { position: -1 } }
          );
        }

        userToUpdate.position = newPosition;
      }
    }

    await userToUpdate.save();

    res.status(200).json({
      success: true,
      userToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedPosition = user.position;
    // console.log(deletedPosition);

    await User.findByIdAndDelete(userId);
    await User.updateMany(
      { position: { $gt: deletedPosition } },
      { $inc: { position: -1 } }
    );
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
