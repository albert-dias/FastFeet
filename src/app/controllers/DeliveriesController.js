import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliveriesController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        end_date: { [Op.not]: null },
      },
      attributes: ['id', 'product'],
      include: [
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
      ],
    });
    return res.json(deliveries);
  }
}

export default new DeliveriesController();
