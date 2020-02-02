import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (await Recipient.findOne({ where: { name: req.body.name } })) {
      return res.status(400).json({ error: 'Recipient already registered' });
    }
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      oldName: Yup.string(),
      name: Yup.string()
        .min(6)
        .when('oldName', (oldName, field) =>
          oldName ? field.required() : field
        ),
      street: Yup.string().required(),
      number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    const { oldName } = req.body;

    const recipient = await Recipient.findOne({
      where: { name: oldName ? req.body.oldName : req.body.name },
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (oldName) {
      if (await Recipient.findOne({ where: { name: req.body.name } })) {
        return res.status(400).json({ error: 'Recipient already registered' });
      }
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);
    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
