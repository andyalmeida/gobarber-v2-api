import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const dateWithTheInitialHour = startOfHour(date);

    const existSameDate = await appointmentRepository.findByDate(
      dateWithTheInitialHour,
    );

    if (existSameDate) throw Error('This appointment is already booked.');

    const appointment = appointmentRepository.create({
      provider,
      date: dateWithTheInitialHour,
    });
    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
