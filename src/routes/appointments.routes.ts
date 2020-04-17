import { Router } from 'express';
import { parseISO, startOfHour, isEqual } from 'date-fns';
import { uuid } from 'uuidv4';

const appointmentsRouter = Router();

interface Appointments {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Appointments[] = [];

appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const hasSameDate = appointments.find(appointment =>
    isEqual(appointment.date, parsedDate),
  );

  if (hasSameDate)
    res.status(400).json({ error: 'This appointment is already booked.' });

  const appointment = {
    id: uuid(),
    provider,
    date: parsedDate,
  };

  appointments.push(appointment);

  res.json(appointment);
});

export default appointmentsRouter;
