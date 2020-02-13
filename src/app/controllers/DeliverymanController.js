import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const deliverymanMail = await Deliveryman.findOne({ where: { email } });

    if (deliverymanMail) {
      return res.status(401).json({ error: 'Deliveryman already registered' });
    }

    const deliveryman = await Deliveryman.create(req.body);
    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      oldEmail: Yup.string(),
      email: Yup.string()
        .min(6)
        .when('oldEmail', (oldEmail, field) =>
          oldEmail ? field.required() : field
        ),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { oldEmail } = req.body;
    const deliId = req.params.deliverymanId;

    const deliveryman = await Deliveryman.findByPk(deliId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman is not registered' });
    }

    if (oldEmail) {
      if (await Deliveryman.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ error: 'Mail already registered' });
      }
    }

    const { id, name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const deliId = req.params.deliverymanId;

    const deliveryman = await Deliveryman.findByPk(deliId);
    const avatarDel = await File.findByPk(deliveryman.avatar_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman is not registered' });
    }

    if (avatarDel) {
      await File.destroy({
        where: {
          id: deliveryman.avatar_id,
        },
      });
    }

    await Deliveryman.destroy({
      where: {
        id: deliId,
      },
    });
    return res.json();
  }
}

export default new DeliverymanController();
