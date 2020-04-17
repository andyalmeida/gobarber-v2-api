import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public findByDate(date: Date): Appointment | null {
    const hasAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return hasAppointment || null;
  }

  public create(provider: string, date: Date): Appointment {
    const appointment = new Appointment(provider, date);

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
