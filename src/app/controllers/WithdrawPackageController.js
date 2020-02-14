import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class WithdrawPackageController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { start_date } = req.body;
    // const delivery = await Delivery.findByPk(req.params.deliveryId);
    return res.json(start_date);
  }
}

export default new WithdrawPackageController();
