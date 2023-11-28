import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../errors/notfoundError';
import {
  STATUS_SUCCESS,
  CARD_NOT_FOUND_MESSAGE,
} from '../utils/consts';

const modifyCardLikes = (operation: '$addToSet' | '$pull') => async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { cardId } = req.params;

    if (!req.user) {
      throw new Error('Пользователь не аутентифицирован');
    }
    const userId = (req.user as { _id: string | ObjectId })._id;
    console.log(userId)

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { [operation]: { likes: userId } },
      { new: true },
    )
      .populate(['owner', 'likes']);

    if (!updatedCard) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    res.status(STATUS_SUCCESS).send(updatedCard);
  } catch (error) {
    next(error);
  }
};

export default modifyCardLikes;
