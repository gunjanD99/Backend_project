import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logOutUser,
    changeAccountDetails,
    changePassword,
    RefreshAccessToken,
} from "../controllers/user.js";
import { verifyJWT } from "../middlewares/Auth.js";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(verifyJWT,loginUser)
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/update-info").patch(verifyJWT,changeAccountDetails)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/refresh-Token").post(verifyJWT,RefreshAccessToken)


export default router
