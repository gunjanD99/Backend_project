import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/User.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessorRefreshToken = async function (userId) {

  try {
    const user = User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
      user.refreshToken= refreshToken
      await user.save({validateBeforeSave: false});
  
      return {accessToken, refreshToken}
  

  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = async function(req, res){

  const {fullname, email, username, password} = req.body

  if([fullname, email, username, password].some.((field)=> field?.trim() == "")
  ){
      throw new ApiError(400, "All field are manadatory")
  }

  const existedUser= await User.findOne({
    $or :[{email} , {username}]
  })
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}

  const user= await User.create({
        email:email,
        username: username,
        password: password,
        fullname: fullname,
  })

  const createdUser = await User.findById(user._id).select("-password  -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "something went wrong")
  }

  return res.status(200).json(
    new ApiResponse(201, createdUser,"registered user Successfully")
  )
}

const loginUser = async function (req,res) {

  const {email, username, password}= req.body
  if(!email && !username){
    throw new ApiError(400, "email or username required")
  }

  const checkUser= await User.findOne({
    $or: [{email} , {username}]
  })
  if(!checkUser){
    throw new ApiError(400, "User not found")
  }

  const checkPassword = await checkUser.isPasswordCorrect(password)
  if(!checkPassword){
    throw new ApiError(401, "password does not match")
  }

  const {accessToken, refreshToken} = await generateAccessorRefreshToken(checkUser._id)
  const loginUser= await User.findById(checkUser._id).select("-password -refreshToken")

 const options = {
  httpOnly: true,
  secure: true
 }
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken",refreshToken, options).json(
    new ApiResponse(2001,{checkUser: loginUser, refreshToken, accessToken} ,"login User Successfully")
  )
}

const logOutUser = async function (req, res) {
  await User.findByIdAndUpdate(req.user._id , 
    {
    $unset : {
      refreshToken : 1;
    }
    },
    {
      new : true
    }
  )
  const options = {
    httpOnly : true,
    secure :true
  }

  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
      new ApiResponse(201, {}, "logout user successfully")
  )}

const changeAccountDetails = async function (req, res){
 const user = await User.findByIdAndUpdate(req.user?._id,
{
    $set: {
      email: email,
      fullname,
    }
}
 ).select("-password")

 return res.status(200).json(
  new ApiResponse(201, user, "Detailed info Updated")
 )
}

const changePassword = async function(req, res){

  const {oldPasssword, newPassword} = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPasssword)

  if(!passwordcheck){
    throw new ApiError(400, "oldpassword is Incorrect")
  }
  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
}

const RefreshAccessToken = async function(req, res){

  const incomingrefreshToken = req.cookie.refreshToken || req.body.refreshToken

  try {
  const decodeToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(decodeToken?._id){
      if(!user){
        throw new ApiError(400, "user Token invalid")
      }
      if(incomingrefreshToken!== user?.refreshToken){
        throw new ApiError(400, "user Token is expired")
      }

      const options = {
        httpOnly:true,
        secure: true
      }

      const{ accessToken , newrefreshToken} =  await generateAccessorRefreshToken(user._id)

      return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
          new ApiResponse(200, {accessToken, refreshToken: newRefreshToken},"Access token refreshed")
      )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

  }
}