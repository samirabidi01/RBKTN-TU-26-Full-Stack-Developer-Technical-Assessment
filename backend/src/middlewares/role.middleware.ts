import type { NextFunction, Request, Response } from "express";

export const roleMiddleware = (...roles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    console.log("Allowed roles:", roles);
    next();
  };
};