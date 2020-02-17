import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CanceledMail {
  get key() {
    return 'CanceledMail';
  }

  async handle({ data }) {
    const { canceled } = data;

    await Mail.sendMail({
      to: `${canceled.deliveryman.name} <${canceled.deliveryman.email}>`,
      subject: 'Testando envio de email',
      template: 'cancellation',
      context: {
        deliveryman: canceled.deliveryman.name,
        delivery_id: canceled.id,
        product: canceled.product,
        date: format(new Date(), "'dia' dd 'de' MMMM", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CanceledMail();
