import { Request, Response, NextFunction } from 'express';
import { User } from "../models/userModel";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check if user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }
    
    // 2. Check if the logged-in user has the 'admin' role
    const user = req.user as User;
    if (user.role === 'admin') {
        return next();
    }
    
    // 3. If not admin, redirect to dashboard
    return res.redirect("/dashboard");
}