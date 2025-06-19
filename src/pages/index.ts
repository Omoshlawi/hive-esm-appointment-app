import { withUserAccess } from "@hive/esm-core-components";
import AppointmentTypesPage from "./AppointmentTypesPage";
import AppointmentsPage from "./AppointmentsPage";

export const AppointmentTypes = withUserAccess(AppointmentTypesPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const Appointments = withUserAccess(AppointmentsPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
