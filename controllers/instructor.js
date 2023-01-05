import User from "../models/User.js";

export const makeInstructor = async (req, res) => {
  console.log(req.user._id);
  const { discord, instagram, expertise, summary } = req.body;
  try {
    const user = await User.findById(req.user._id).exec();
    if (user) {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { role: "Instructor" },
          discord,
          instagram,
          expertise,
          summary,
        },
        { new: true }
      )
        .select("-password")
        .exec();
    }
    res.status(200).json({ ok: true, data: statusUpdated });
  } catch (error) {
    console.log(error);
  }
};
