import { ReasonPhrases } from "./../enums/reason-phrases";
import { StatusCodes } from "../enums";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core";
import catchAsyncError from "../middleware/catchAsyncError";
import { UserService } from "../services";
import {
  ForgotPassworInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
} from "./../interface/User.dto";

class UserController {
  register = catchAsyncError(
    async (req: Request, res: Response, _next: NextFunction) => {
      const createInput = <RegisterUserInput>req.body;
      const data = await UserService.register(createInput, res);
      new SuccessResponse({
        message: "create success",
        statusCode: StatusCodes.CREATED,
        metadata: data,
        reasonStatusCode: ReasonPhrases.CREATED,
      });
    }
  );

  login = catchAsyncError(
    async (req: Request, res: Response, _next: NextFunction) => {
      const loginInput = <LoginUserInput>req.body;
      const data = await UserService.login(loginInput, res);
      new SuccessResponse({
        message: "login success",
        statusCode: StatusCodes.OK,
        metadata: data,
        reasonStatusCode: ReasonPhrases.OK,
      });
    }
  );

  logout = catchAsyncError(
    async (_req: Request, res: Response, _next: NextFunction) => {
      await UserService.logout(res);
      new SuccessResponse({
        message: "logout success",
        statusCode: StatusCodes.OK,
        reasonStatusCode: ReasonPhrases.OK,
      }).send(res);
    }
  );

  forgotPassword = catchAsyncError(
    async (req: Request, res: Response, _next: NextFunction) => {
      const forgotPasswordInput = <ForgotPassworInput>req.body;
      const data = await UserService.forgotPassword(forgotPasswordInput);
      new SuccessResponse({
        message: "logout success",
        statusCode: StatusCodes.OK,
        reasonStatusCode: ReasonPhrases.OK,
        metadata: data,
      }).send(res);
    }
  );

  resetPassword = catchAsyncError(
    async (req: Request, res: Response, _next: NextFunction) => {
      const resetPasswordInput = <ResetPasswordInput>req.body;
      const data = await UserService.resetPassowrd(
        resetPasswordInput,
        res,
        req.params.token
      );
      new SuccessResponse({
        message: "logout success",
        statusCode: StatusCodes.OK,
        reasonStatusCode: ReasonPhrases.OK,
        metadata: data,
      });
    }
  );
}

export const userController = new UserController();