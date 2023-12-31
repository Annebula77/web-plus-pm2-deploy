import { NextFunction, Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  STATUS_SUCCESS,
  STATUS_CREATED,
  VALIDATION_ERROR_MESSAGE,
  WRONG_EMAIL_PASSWORD_MESSAGE,
  USER_EXISTS_MESSAGE,
} from '../utils/consts';
import userUpdateDecorator from '../decorators/userDecorator';
import UnauthorizedError from '../errors/unauthorizedError';
import UserReturnDecorator from '../decorators/userReturnDecorator';
import ValidationError from '../errors/validationError';
import UserExistsError from '../errors/userExists';

export const jwtSecret = process.env.JWT_SECRET as string;

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_SUCCESS).send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = UserReturnDecorator(async (req: Request) => {
  console.log('getUserById req.params:', req.params); // Логируем параметры запроса
  const { _id } = req.params;
  return User.findById(_id);
});

export const getAuthUser = UserReturnDecorator(async (req: Request) => {
  console.log('getAuthUser called with req.user:', req.user);
  const userId = (req.user as { _id: string | ObjectId })._id;
  console.log('getAuthUser req.user:', req.user); // Логируем информацию о пользователе

  return User.findById(userId);
});

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    // можно и без этой проверки, но мне тогда нужно переделать везде выброс ошибок
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new UserExistsError(USER_EXISTS_MESSAGE);
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });

    return res.status(STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = new ValidationError(VALIDATION_ERROR_MESSAGE, error);
      return next(validationError);
    }
    return next(error);
  }
};

export const updateUserInfo = userUpdateDecorator((req: Request) => {
  const { name, about } = req.body;
  return { name, about };
});

export const updateUserAvatar = userUpdateDecorator((req: Request) => {
  const { avatar } = req.body;
  return { avatar };
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true, // если используется HTTPS
      sameSite: 'strict',
    });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};
