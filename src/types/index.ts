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

export interface Property {
  id: string;
  name: string;
}

export interface Listing {
  id: string;
  title: string;
}

export interface Resource {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: any;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  priority: string;
  appointmentTypeId: string;
  organizerId: string;
  organizer: Organizer;
  organizationId: string;
  organization: any;
  metadata: any;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  recurrenceRule: string;
  parentId: any;
  cancelledAt: any;
  cancellationReason: any;
  rescheduledFrom: any;
}

export interface Organizer {
  id: string;
  name: any;
  email: string;
  gender: string;
  userId: string;
  voided: boolean;
  surname: any;
  lastName: any;
  avatarUrl: any;
  createdAt: string;
  firstName: any;
  updatedAt: string;
  phoneNumber: string;
}
