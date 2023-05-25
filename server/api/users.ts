import express, { NextFunction, Request, Response } from 'express'
const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try{
    res.send('user route')
  } catch(err) {
    next(err)
  }
})

export default router