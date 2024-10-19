import { Router } from "express";
import { LoginDto } from "../dto/login.dto";
import { validateDto } from "../../middlewares/validate-dto";
import { login } from "../controller/auth.controller";

const router = Router();

router.post('/login', validateDto(LoginDto),login ); // Apply DTO validation middleware

export default router;
