import {
  apiFetch,
  APIFetchResponse,
  constructUrl,
  mutate,
} from "@hive/esm-core-api";
import useSWR from "swr";
import {
  AppointmentFormData,
  Appointment,
  AppointmentParticipantFormData,
  AppointmentParticipant,
} from "../types";

const addAppointmentParticipant = async (
  appointmentId: string,
  data: AppointmentParticipantFormData
) => {
  const res = await apiFetch<AppointmentParticipant>(
    `/appointments/${appointmentId}/participants`,
    {
      method: "POST",
      data,
    }
  );
  return res.data;
};
const updateAppointmentParticipant = async (
  appointmentId: string,
  particpantId: string,
  data: AppointmentParticipantFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  const res = await apiFetch<AppointmentParticipant>(
    `/appointments/${appointmentId}/participants/${particpantId}`,
    {
      method,
      data,
    }
  );
  return res.data;
};

const deleteAppointmentParticipant = async (
  appointmentId: string,
  particpantId: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  const res = await apiFetch<AppointmentParticipant>(
    `/appointments/${appointmentId}/participants/${particpantId}`,
    {
      method: method,
    }
  );
  return res.data;
};

const addAppointment = async (data: AppointmentFormData) => {
  const res = await apiFetch<Appointment>("/appointments", {
    method: "POST",
    data,
  });
  return res.data;
};

const updateAppointment = async (
  id: string,
  data: AppointmentFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  const res = await apiFetch<Appointment>(`/appointments/${id}`, {
    method: method,
    data,
  });
  return res.data;
};

const deleteAppointment = async (
  id: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  const res = await apiFetch<Appointment>(`/appointments/${id}`, {
    method: method,
  });
  return res.data;
};

export const useAppointments = () => {
  const url = constructUrl(`/appointments`, {
    v: "custom:include(appointmentType,participants,resources,parent,children)",
  });
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: Array<Appointment> }>>(url);
  return {
    isLoading,
    mutate,
    error,
    appointments: data?.data?.results ?? [],
  };
};

export const useAppointmentsApi = () => {
  return {
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addAppointmentParticipant,
    updateAppointmentParticipant,
    deleteAppointmentParticipant,
    mutateAppointments: () => mutate("/appointments"),
  };
};
