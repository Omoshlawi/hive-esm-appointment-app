import { apiFetch, APIFetchResponse, mutate } from "@hive/esm-core-api";
import useSWR from "swr";
import { AppointmentFormData, Appointment } from "../types";

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
  const url = `/appointments`;
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
    mutateAppointments: () => mutate("/appointments"),
  };
};
