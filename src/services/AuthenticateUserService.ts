import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw Error('Invalid email/password combination.');

    const validPassord = await compare(password, user.password);
    if (!validPassord) throw Error('Invalid email/password combination.');

    const token = sign({}, '63c8cca64affe38c814f9f212089385d', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}
