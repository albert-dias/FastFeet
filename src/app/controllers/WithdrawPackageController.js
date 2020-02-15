import { getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class WithdrawPackageController {
  async update(req, res) {
    const { start_date } = req.query;

    const { deliveryId, deliverymanId } = req.params;

    const date = Number(start_date);
    const delivery = await Delivery.findByPk(deliveryId);
    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!start_date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    if (delivery.start_date !== null) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been withdrawn ' });
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Invalid deliveryman' });
    }

    const hours = getHours(new Date(date));

    if (hours < 8 || hours > 18) {
      return res.status(400).json({ error: 'Invalid hour' });
    }

    const count = await Delivery.count({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (count >= 5) {
      return res
        .status(400)
        .json({ error: 'Deliveryman has reached the withdrawal limit' });
    }

    await delivery.update({ start_date: date });
    return res.json(delivery);
  }
}

export default new WithdrawPackageController();
