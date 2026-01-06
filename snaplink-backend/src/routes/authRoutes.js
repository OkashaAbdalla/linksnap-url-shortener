import { Router } from "express";
import * as authService from "../services/authService.js";
import { ValidationError, ConflictError } from "../middleware/errorHandler.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }
    
    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters");
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError("Invalid email format");
    }
    
    if (await authService.emailExists(email)) {
      throw new ConflictError("Email already registered");
    }
    
    const user = await authService.createUser(email, password, name);
    const token = authService.generateToken(user.id);
    
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }
    
    const user = await authService.getUserByEmail(email);
    if (!user || !authService.verifyPassword(password, user.password_hash)) {
      throw new ValidationError("Invalid email or password");
    }
    
    const token = authService.generateToken(user.id);
    
    res.json({ 
      user: { id: user.id, email: user.email, created_at: user.created_at },
      token 
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
