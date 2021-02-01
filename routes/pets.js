const express = require('express');
const { ValidationError } = require('../lib/errors');
const Joi = require('@hapi/joi');

const Pet = require('../models/pets');
const { validateBody } = require('../middlewares/route');

const router = express.Router();

router.post(
  '/',
  validateBody(
    Joi.object().keys({
      name: Joi.string().required().description('Pet name'),
      age: Joi.number().integer().required().description('Pet age'),
      colour: Joi.string().required().description('Pet colour')
    }),
    {
      stripUnknown: true
    }
  ),
  async (req, res, next) => {
    try {
      const pt = new Pet(req.body);
      await pt.save();
      res.status(200).json(pt);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const petsData = await Pet.find();
    res.status(200).json(petsData);
  } catch (e) {
    next(e);
  }
});

router.put(
  '/:name',
  validateBody(
    Joi.object().keys({
      name: Joi.string().required().description('Pet name'),
      age: Joi.number().integer().required().description('Pet age'),
      colour: Joi.string().required().description('Pet colour')
    }),
    {
      stripUnknown: true
    }
  ),
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        next(new ValidationError('Required pet name as param'));
        return;
      }
      const name = req.params.name;
      const petsData = await Pet.update({ name }, { ...req.body });
      res.status(200).json(petsData);
    } catch (e) {
      next(e);
    }
  }
);
router.delete('/:name', async (req, res, next) => {
  if (!req.params.name) {
    next(new ValidationError('Required pet name as param'));
    return;
  } else {
    try {
      const name = req.params.name;
      await Pet.findOneAndDelete({ name: name });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
});

module.exports = router;
