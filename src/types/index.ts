import { z } from "zod";
import {
  AppointmentParticipantValidator,
  AppointmentResourceValidator,
  AppointmentsValidator,
  AppointmentTypeValidator,
} from "../utils/validation";
import { PiletApi } from "@hive/esm-shell-app";

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
  category: AppointmentTypeCategory;
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
  status:
    | "SCHEDULED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW"
    | "RESCHEDULED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  appointmentTypeId: string;
  appointmentType?: AppointmentType;
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
  participants?: Array<AppointmentParticipant>;
  resources?: Array<AppointmentResource>;
}

export type AppointmentTypeCategory =
  | "PROPERTY_VIEWING"
  | "INSPECTION"
  | "CONSULTATION"
  | "TRANSACTION"
  | "MAINTENANCE"
  | "TENANT_MANAGEMENT"
  | "PHOTOGRAPHY"
  | "LEGAL"
  | "OTHER";

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

export interface AppointmentParticipant {
  id: string;
  appointmentId: string;
  personId: string;
  person?: any;
  role: "ORGANIZER" | "ATTENDEE" | "OPTIONAL" | "RESOURCE_PERSON";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "TENTATIVE";
  isRequired: boolean;
  respondedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface AppointmentResource {
  id: string;
  appointmentId: string;
  resourceId: string;
  resource?: any;
  resourceModel: "Listing" | "Property";
  notes?: string;
}


export type PropsWithLaunchWorkspace = Pick<PiletApi,"launchWorkspace">