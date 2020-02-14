import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      // where: { user_id: req.userId, canceled_at: null },
      order: ['created_at'],
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'city',
            'state',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not registered' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not registered' });
    }

    const { id, product } = await Delivery.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Testando envio de email',
      text: 'Vai um teste ai gente',
    });

    return res.json({ id, product, recipient_id, deliveryman_id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      product,
      deliveryman_id,
      recipient_id,
      start_date,
      end_date,
    } = req.body;

    const delivery = await Delivery.findByPk(req.params.deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery is not registered' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman is not registered' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient is not registered' });
    }

    const { id } = await delivery.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery is not registered' });
    }

    if (delivery.start_date !== null) {
      return res
        .status(400)
        .json({ error: 'Delivery picked up by deliveryman' });
    }

    if (delivery.end_date !== null) {
      return res.status(400).json({ error: 'Delivered to the recipient' });
    }

    await Delivery.destroy({
      where: {
        id: deliveryId,
      },
    });
    return res.json();
  }
}

export default new DeliveryController();
