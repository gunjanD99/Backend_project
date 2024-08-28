import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {Payment} from "../models/payment.model.js";
import {ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const addMoneyWallet = asyncHandler(async (req, res)=>{

      const {amount} = req.body;
      if(amount < 5000){
        throw new ApiError(400, "amount should be greater than 5000") 
      }

      if(amount >= 5000){
      const money =  await Payment.create({
        amount: amount,
        owner : req.user?._id,
      });

      // console.log(" money owner",money.owner)
      // console.log("  owner",req.user)
      
      if (!money) {
        throw new ApiError(500, "failed to add please try again");
    }
    

    return res.status(200).json( 
    new ApiResponse(201, money ,"Add money successfully")
    )
  }
})

const updateAmount = asyncHandler(async (req, res)=>{

  const {amount} = req.body;
  const {id} = req.params;
  if(!amount){
    throw new ApiError(400, "amount is empty");
  }

const money = await Payment.findById(id);
if (!money) {
  throw new ApiError(400, "amount not found");
}

if (money?.owner.toString() !== req.user?._id.toString()) {
  throw new ApiError(400, "only owner can edit thier money");
}
  const updateAmount = await Payment.findByIdAndUpdate(id,
    {
      $set : {
        amount,
      }
    },
    {new: true}
  );

  if (!updateAmount) {
    throw new ApiError(500, "Failed to edit amount please try again");
}
return res.status(200).json(
  new ApiResponse(200, updateAmount, "Amount updated successfully"));
});


const deleteAmount = asyncHandler(async (req, res)=>{

  const {id} = req.params;
  
// console.log("not found",id)   user ki new id banti hai particular amount ke liye
  if(!id){
    throw new ApiError(400, "amount Id is required")
  }


const money = await Payment.findById(id);
// console.log("money ",money)  user ki new id and owner Id,amount ata hai  // addmoney wali details
// console.log("money found 1",money?.owner.toString())  esme owner means login user ki id
// console.log("money found 2",req.user?._id.toString()) esme login user ki id

if(!money){
  throw new ApiError(400, "no founnd amount id")
}

if (money?.owner.toString() !== req.user?._id.toString()) {
  throw new ApiError(400, "only owner can edit thier money");
}

await Payment.findByIdAndDelete(id);

return res.status(200).json(
  new ApiResponse(200, {id}, "Amount delete successfully"));

})
export {
    addMoneyWallet,
    updateAmount,
    deleteAmount
}



