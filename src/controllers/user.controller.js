import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from user
  const { fullName, email, password, username } = req.body;
  console.log("email: ", email);

  //validation: like if the fields are empty,isEmail
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are compulsory");
  }

  //if the user already exist: checked using email or username
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError("409", "User with email and username already exist");
  }
  //check for images or avtar
  const avatarLocalPath = req.files?.avatar?.path;
  const CoverImageLocalPath = req.files?.coverImage?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is Required");
  }

  //upload the images or avtar to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(CoverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar File is Required");
  }

  //create user object -send it to the DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from the response
  //check for user creation
  const createdUser = User.findById(user._id).select("-password -refreshToken");

  //return res
  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registered sucessfully")
  )
});

export { registerUser };
