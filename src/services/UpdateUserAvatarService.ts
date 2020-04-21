import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: user_id } });
    if (!user) throw new AppError('User does not exist', 404);

    if (user.avatar) {
      const avatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const avatarFileExists = fs.existsSync(avatarFilePath);
      if (avatarFileExists) await fs.promises.unlink(avatarFilePath);
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);

    return user;
  }
}
