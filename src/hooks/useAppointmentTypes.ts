import { apiFetch, APIFetchResponse, mutate } from "@hive/esm-core-api";
import useSWR from "swr";
import { AppointmentFormData, AppointmentType } from "../types";

const addAppointmentType = async (data: AppointmentFormData) => {
  const res = await apiFetch<AppointmentType>("/appointment-types", {
    method: "POST",
    data,
  });
  return res.data;
};

const updateAppointmentType = async (
  id: string,
  data: AppointmentFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  const res = await apiFetch<AppointmentType>(`/appointment-types/${id}`, {
    method: method,
    data,
  });
  return res.data;
};

const deleteAppointmentType = async (
  id: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  const res = await apiFetch<AppointmentType>(`/appointment-types/${id}`, {
    method: method,
  });
  return res.data;
};

export const useAppointmentTypes = () => {
  const url = `/appointment-types`;
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: Array<AppointmentType> }>>(url);
  return {
    isLoading,
    mutate,
    error,
    appointmentTypes: data?.data?.results ?? [],
  };
};

export const useAppointmentTypesApi = () => {
  return {
    addAppointmentType,
    updateAppointmentType,
    deleteAppointmentType,
    mutateAppointmentTypes: () => mutate("/appointment-types"),
  };
};
