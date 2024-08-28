import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    // console.log("hi 1"); 

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }
    console.log("toke",token);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("hi 2");

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // console.log("hi 3");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    // console.log("hi 4");
    next()
  } 
  
  catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
