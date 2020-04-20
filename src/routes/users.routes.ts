import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';
import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.get('/', async (req, res) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();

  return res.json(users);
});

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });
    delete user.password;

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const updateUserAvatarService = new UpdateUserAvatarService();

      const user = await updateUserAvatarService.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      });

      delete user.password;

      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
