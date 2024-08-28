import {Router} from "express";
import { addMoneyWallet} from "../controllers/payment.js";
import { updateAmount} from "../controllers/payment.js";
import { deleteAmount} from "../controllers/payment.js";
import { verifyJWT } from "../middlewares/Auth.js";


const router = Router()

router.route("/addMoney").post(verifyJWT, addMoneyWallet)
router.route("/:id/updateMoney").patch(verifyJWT,updateAmount)
router.route("/:id/deleteMoney").delete(verifyJWT,deleteAmount)


export default router;