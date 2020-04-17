import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository: AppointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (req, res) => {
  const appointments = appointmentRepository.all();

  return res.json(appointments);
});

appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const hasSameDate = appointmentRepository.findByDate(parsedDate);

  if (hasSameDate)
    return res
      .status(400)
      .json({ error: 'This appointment is already booked.' });

  const appointment = appointmentRepository.create(provider, parsedDate);

  return res.json(appointment);
});

export default appointmentsRouter;
