import { Request, Response } from 'express';

class AuthController {
  public async signUp(req: Request, res: Response) {}
  public async signIn(req: Request, res: Response) {}
  public async getMe(req: Request, res: Response) {}
  public async updateMe(req: Request, res: Response) {}
}

export default new AuthController();
