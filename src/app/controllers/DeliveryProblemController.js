import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const deliveriesProblem = await DeliveryProblem.findAll();

    return res.json(deliveriesProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const delivery_id = Number(req.params.deliveryId);
    const { description } = req.body;

    if (!(await Delivery.findByPk(delivery_id))) {
      return res.status(400).json({ error: 'Delivery not resgistered' });
    }

    const registerproblem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(registerproblem);
  }
}

export default new DeliveryProblemController();
