import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const dateWithTheInitialHour = startOfHour(date);

    const existSameDate = await appointmentRepository.findByDate(
      dateWithTheInitialHour,
    );

    if (existSameDate)
      throw new AppError('This appointment is already booked.');

    const appointment = appointmentRepository.create({
      provider_id,
      date: dateWithTheInitialHour,
    });
    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
