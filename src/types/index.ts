import { z } from "zod";
import {
  AppointmentParticipantValidator,
  AppointmentResourceValidator,
  AppointmentsValidator,
  AppointmentTypeValidator,
} from "../utils/validation";

export type AppointmentParticipantFormData = z.infer<
  typeof AppointmentParticipantValidator
>;
export type AppointmentResourceFormData = z.infer<
  typeof AppointmentResourceValidator
>;
export type AppointmentFormData = z.infer<typeof AppointmentsValidator>;
export type AppointmentTypeFormData = z.infer<typeof AppointmentTypeValidator>;
export interface Appointment {
  id: string;
}
export interface AppointmentType {
  id: string;
  name: string;
  description: any;
  category:
    | "PROPERTY_VIEWING"
    | "INSPECTION"
    | "CONSULTATION"
    | "TRANSACTION"
    | "MAINTENANCE"
    | "TENANT_MANAGEMENT"
    | "PHOTOGRAPHY"
    | "LEGAL"
    | "OTHER";
  defaultDuration: number;
  bufferTimeBefore: number;
  bufferTimeAfter: number;
  allowOnlineBooking: boolean;
  requiresApproval: boolean;
  maxParticipants: number;
  availabilityRules: any;
  requiredFields: any;
  baseCost: any;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}
