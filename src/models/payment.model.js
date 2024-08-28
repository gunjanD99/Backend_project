import mongoose, {Schema} from "mongoose"


const paymentSchema = new Schema({

    amount:{
        type:String,
        required:[true, `amount is required`],
        trim:true,
        
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

export const Payment = mongoose.model("Payment", paymentSchema);
