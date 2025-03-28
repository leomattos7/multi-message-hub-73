
import { Appointment } from "@/hooks/use-appointments";

// Generate all possible time slots from 00:00 to 23:30 in 30-minute intervals
export const generateAllTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// Helper function to generate time slots based on appointments
export const generateTimeSlots = (appointments: Appointment[] = []) => {
  // Default time range from 00:00 to 23:30
  let startHour = 0;
  let endHour = 24;
  
  // Check if we need to expand the time range based on appointments
  if (appointments.length > 0) {
    appointments.forEach(appointment => {
      // Parse appointment start time
      const appointmentStartHour = parseInt(appointment.time.split(':')[0], 10);
      
      // Parse appointment end time if available
      let appointmentEndHour = appointmentStartHour + 1; // Default 1 hour duration
      if (appointment.end_time) {
        appointmentEndHour = parseInt(appointment.end_time.split(':')[0], 10);
        // Account for appointments that end exactly at the hour
        const appointmentEndMinutes = parseInt(appointment.end_time.split(':')[1], 10);
        if (appointmentEndMinutes === 0 && appointmentEndHour > 0) {
          // If appointment ends at HH:00, we use that hour as is
        } else {
          // If appointment ends at HH:MM (MM > 0), we need to include the next hour
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
  
  return generateAllTimeSlots();
};
