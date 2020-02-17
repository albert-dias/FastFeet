import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import CanceledMail from '../jobs/CanceledMail';
import Queue from '../../lib/Queue';

class CanceledDeliveryController {
  async index(req, res) {
    const deliveriesProblem = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.deliveryId,
      },
    });

    return res.json(deliveriesProblem);
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const canceled = await Delivery.findByPk(deliveryId, {
      attributes: ['id', 'product', 'canceled_at'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    await canceled.update({
      canceled_at: new Date(),
    });

    await Queue.add(CanceledMail.key, {
      canceled,
    });

    return res.json(canceled);
  }
}

export default new CanceledDeliveryController();
