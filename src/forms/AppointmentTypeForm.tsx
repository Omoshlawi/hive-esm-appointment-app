import { handleApiErrors, mutate } from "@hive/esm-core-api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppointmentTypesApi } from "../hooks";
import { AppointmentType, AppointmentTypeFormData } from "../types";
import { INPUT_ORDER } from "../utils/constants";
import { AppointmentTypeValidator } from "../utils/validation";

type AppointmentTypeFormProps = {
  appointmentType?: AppointmentType;
  onSuccess?: (appointmentType: AppointmentType) => void;
  onCloseWorkspace?: () => void;
};

const AppointmentTypeForm: FC<AppointmentTypeFormProps> = ({
  onCloseWorkspace,
  appointmentType,
  onSuccess,
}) => {
  const form = useForm<AppointmentTypeFormData>({
    defaultValues: {
      allowOnlineBooking: appointmentType?.allowOnlineBooking ?? true,
      requiresApproval: appointmentType?.requiresApproval ?? false,
      bufferTimeAfter: appointmentType?.bufferTimeAfter,
      bufferTimeBefore: appointmentType?.bufferTimeBefore,
      category: appointmentType?.category,
      defaultDuration: appointmentType.defaultDuration,
      description: appointmentType.description ?? "",
      name: appointmentType.name,
      maxParticipants: appointmentType.maxParticipants,
    },
    resolver: zodResolver(AppointmentTypeValidator),
  });
  const { addAppointmentType, updateAppointmentType, mutateAppointmentTypes } =
    useAppointmentTypesApi();
  const onSubmit: SubmitHandler<AppointmentTypeFormData> = async (data) => {
    try {
      const _property = appointmentType
        ? await updateAppointmentType(appointmentType?.id, data)
        : await addAppointmentType(data);

      onSuccess?.(_property);
      onCloseWorkspace?.();
      showNotification({
        title: "success",
        message: `Appointment type ${
          appointmentType ? "updated" : "created"
        } successfully`,
        color: "teal",
      });
      mutateAppointmentTypes();
    } catch (error) {
      const e = handleApiErrors<AppointmentTypeFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof AppointmentTypeFormData, { message: val })
        );
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack p={"md"} h={"100%"} justify="space-between">
        <Stack gap={"md"}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Appointment type"
                error={fieldState.error?.message}
                placeholder="Enter type name"
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Type description"
                error={fieldState.error?.message}
                placeholder="Description ..."
              />
            )}
          />
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                data={[
                  { label: "Property viewing", value: "PROPERTY_VIEWING" },
                  { label: "Inspection", value: "INSPECTION" },
                  { label: "Consultation", value: "CONSULTATION" },
                  { label: "Transaction", value: "TRANSACTION" },
                  { label: "Maintainance", value: "MAINTENANCE" },
                  { label: "Tenant management", value: "TENANT_MANAGEMENT" },
                  { label: "Photography", value: "PHOTOGRAPHY" },
                  { label: "Legal", value: "LEGAL" },
                  { label: "Other", value: "OTHER" },
                ]}
                label="Category"
                placeholder="Select category"
                error={fieldState.error?.message}
                nothingFoundMessage="Nothing found..."
                searchable
              />
            )}
          />
          <Controller
            control={form.control}
            name="defaultDuration"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Default duration"
                error={fieldState.error?.message}
                placeholder="Default duration"
                inputWrapperOrder={INPUT_ORDER}
                description="In minutes"
              />
            )}
          />
          <Controller
            control={form.control}
            name="bufferTimeBefore"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Preparation Time Before Appointment"
                error={fieldState.error?.message}
                placeholder="Time in minutes"
                inputWrapperOrder={INPUT_ORDER}
                description="Extra time before the appointment starts "
              />
            )}
          />
          <Controller
            control={form.control}
            name="bufferTimeAfter"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Wrap-up Time After Appointment"
                error={fieldState.error?.message}
                placeholder="Time in minutes"
                inputWrapperOrder={INPUT_ORDER}
                description="Extra time reserved after the appointmen"
              />
            )}
          />
          <Controller
            control={form.control}
            name="maxParticipants"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Maximum participants"
                error={fieldState.error?.message}
                placeholder="Participants"
              />
            )}
          />
          <Controller
            control={form.control}
            name={`allowOnlineBooking`}
            render={({ field, fieldState: { error } }) => (
              <Checkbox
                label="Allow online booking ?"
                checked={field.value}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
                error={error?.message}
                ref={field.ref}
                disabled={field.disabled}
                name={field.name}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            control={form.control}
            name={`requiresApproval`}
            render={({ field, fieldState: { error } }) => (
              <Checkbox
                label="Required approval ?"
                checked={field.value}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
                error={error?.message}
                ref={field.ref}
                disabled={field.disabled}
                name={field.name}
                onBlur={field.onBlur}
              />
            )}
          />
        </Stack>
        <Group gap={1}>
          <Button
            flex={1}
            variant="default"
            radius={0}
            onClick={onCloseWorkspace}
          >
            Cancel
          </Button>
          <Button
            radius={0}
            flex={1}
            fullWidth
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AppointmentTypeForm;
