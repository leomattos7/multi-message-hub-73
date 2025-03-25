
import { Appointment } from "@/hooks/use-appointments";

// Helper function to generate time slots based on appointments
export const generateTimeSlots = (appointments: Appointment[] = []) => {
  // Default time range from 8:00 to 18:00
  let startHour = 8;
  let endHour = 18;
  
  // Check if we need to expand the time range based on appointments
  if (appointments.length > 0) {
    appointments.forEach(appointment => {
      // Parse appointment start time
      const appointmentStartHour = parseInt(appointment.time.split(':')[0], 10);
      
      // Parse appointment end time if available
      let appointmentEndHour = endHour;
      if (appointment.end_time) {
        appointmentEndHour = parseInt(appointment.end_time.split(':')[0], 10);
        // Account for appointments that end in the next hour
        if (parseInt(appointment.end_time.split(':')[1], 10) > 0) {
          appointmentEndHour += 1;
        }
      }
      
      // Update start and end hours if needed
      if (appointmentStartHour < startHour) {
        startHour = appointmentStartHour;
      }
      
      if (appointmentEndHour > endHour) {
        endHour = appointmentEndHour;
      }
    });
  }
  
  // Generate time slots based on the expanded range
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    // Optionally add half-hour slots
    if (hour < endHour) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return slots;
};
