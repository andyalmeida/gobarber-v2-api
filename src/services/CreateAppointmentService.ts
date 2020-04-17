import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const dateWithTheInitialHour = startOfHour(date);

    const existSameDate = this.appointmentRepository.findByDate(
      dateWithTheInitialHour,
    );

    if (existSameDate) throw Error('This appointment is already booked.');

    const appointment = this.appointmentRepository.create({
      provider,
      date: dateWithTheInitialHour,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
