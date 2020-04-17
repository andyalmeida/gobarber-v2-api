import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository: AppointmentRepository = new AppointmentRepository();

appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const hasSameDate = appointmentRepository.findByDate(parsedDate);

  if (hasSameDate)
    res.status(400).json({ error: 'This appointment is already booked.' });

  const appointment = appointmentRepository.create(provider, parsedDate);

  res.json(appointment);
});

export default appointmentsRouter;
