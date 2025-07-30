import { handleApiErrors } from "@hive/esm-core-api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PersonInput } from "../components/input";
import { useAppointmentsApi } from "../hooks";
import {
  AppointmentParticipant,
  AppointmentParticipantFormData,
} from "../types";
import { AppointmentParticipantValidator } from "../utils/validation";

type Props = {
  appointmentId: string;
  participant?: AppointmentParticipant;
  onCloseWorkspace?: () => void;
  onSuccess?: (participant: AppointmentParticipant) => void;
};

const AppointmentParticipantForm: FC<Props> = ({
  appointmentId,
  onCloseWorkspace,
  onSuccess,
  participant,
}) => {
  const {
    addAppointmentParticipant,
    updateAppointmentParticipant,
    mutateAppointments,
  } = useAppointmentsApi();
  const form = useForm<AppointmentParticipantFormData>({
    defaultValues: {
      appointmentId: appointmentId,
      isRequired: participant?.isRequired,
      notes: participant?.notes ?? undefined,
      personId: participant?.personId,
      role: participant?.role,
    },
    resolver: zodResolver(AppointmentParticipantValidator),
  });

  const onSubmit: SubmitHandler<AppointmentParticipantFormData> = async (
    data
  ) => {
    try {
      const res = participant
        ? await updateAppointmentParticipant(
            appointmentId,
            participant?.id,
            data
          )
        : await addAppointmentParticipant(appointmentId, data);

      onSuccess?.(res);
      onCloseWorkspace?.();
      showNotification({
        title: "succes",
        message: `participnant ${
          participant ? "updated" : "created"
        } succesfull`,
        color: "teal",
      });
      mutateAppointments();
    } catch (error) {
      const e = handleApiErrors<AppointmentParticipantFormData>(error);
      console.log("Error->", e);

      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof AppointmentParticipantFormData, {
            message: val,
          })
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
          <PersonInput control={form.control} name="personId" />
          <Controller
            control={form.control}
            name={`role`}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                data={[
                  { label: "Organizer", value: "ORGANIZER" },
                  { label: "Attendee", value: "ATTENDEE" },
                  { label: "Optional", value: "OPTIONAL" },
                  { label: "Resource person", value: "RESOURCE_PERSON" },
                ]}
                placeholder="Select role"
                label="Role"
                error={error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name={`notes`}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                {...field}
                placeholder="Notes"
                label="Notes..."
                error={error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name={`isRequired`}
            render={({ field, fieldState: { error } }) => (
              <Checkbox
                label="Mandatory?"
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

export default AppointmentParticipantForm;
