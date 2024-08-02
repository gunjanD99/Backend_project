import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username:{
        type:string,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,

    },
    fullname:{
        type:string,
        required:true,
        trim:true,
        index:true,

    },
    email:{
        type:string,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,

    },
    password:{
        type:string,
        required:[true, `password is neccessary`],
    },
    refreshToken:{
        type: string,
    }

},{timestamps:true})

userSchema.pre( "save" ,async function (next){
    if(!this.isModified("password")) return next()

    this.password  = await bcrypt.hash(this.password, 10);
})

userSchema.method.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = async function(){
    return jwt.sign({
        id:this.id,
        email:this.email,
        fullname: this.fullname,
        username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn :process.env.ACCESS_TOKEN_EXPIRY,
    }  
)
}

userSchema.method.generateRefreshToken = async function(){
    return jwt.sign({
        id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn :process.env.REFRESH_TOKEN_EXPIRY,
    }  
)
}

export const user = mongoose.model("user", userSchema)