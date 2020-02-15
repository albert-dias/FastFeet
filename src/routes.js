import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveriesController from './app/controllers/DeliveriesController';
import EnterOpenController from './app/controllers/EnterOpenController';
import WithdrawPackageController from './app/controllers/WithdrawPackageController';
import FinalizePackageController from './app/controllers/FinalizePackageController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.get(
  '/deliveryman/:deliverymanId/deliveries',
  DeliveriesController.index
);

routes.get('/deliveryman/:deliverymanId/open', EnterOpenController.index);
routes.put(
  '/deliveryman/:deliverymanId/:deliveryId/withdraw',
  WithdrawPackageController.update
);
routes.put(
  '/deliveryman/:deliverymanId/:deliveryId/finish',
  upload.single('file'),
  FinalizePackageController.update
);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliverymanId', DeliverymanController.update);
routes.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:deliveryId', DeliveryController.update);
routes.delete('/deliveries/:deliveryId', DeliveryController.delete);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

export default routes;
