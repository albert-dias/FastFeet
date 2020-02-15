import File from '../models/File';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class FinalizePackageController {
  async update(req, res) {
    const { end_date } = req.query;
    const { originalname: name, filename: path } = req.file;
    const { deliveryId, deliverymanId } = req.params;

    const date = Number(end_date);
    const delivery = await Delivery.findByPk(deliveryId);
    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!end_date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    if (delivery.end_date !== null) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been delivered ' });
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Invalid deliveryman' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Invalid file' });
    }

    const file = await File.create({
      name,
      path,
    });
    await delivery.update({
      end_date: date,
      signature_id: file.id,
    });

    return res.json(delivery);
  }
}

export default new FinalizePackageController();
