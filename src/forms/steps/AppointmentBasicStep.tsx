import { handleApiErrors } from "@hive/esm-core-api";
import { InputSkeleton, When } from "@hive/esm-core-components";
import {
  Alert,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useAppointmentTypes, useSearchPeople } from "../../hooks";
import { AppointmentFormData } from "../../types";
import { INPUT_ORDER } from "../../utils/constants";

type AppointmentBasicsStepProps = {
  onNext?: () => void;
  onCancel?: () => void;
  personSearchParams: ReturnType<typeof useSearchPeople>;
};

const AppointmentBasicStep: FC<AppointmentBasicsStepProps> = ({
  onCancel,
  onNext,
  personSearchParams,
}) => {
  const form = useFormContext<AppointmentFormData>();
  const appointmentTypeAsync = useAppointmentTypes();
  return (
    <Stack h={"100%"} justify="space-between">
      <Stack gap={"md"}>
        <Title order={4} pt={"lg"}>
          Basic Information
        </Title>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Title"
              inputWrapperOrder={INPUT_ORDER}
              description="Should be descriptive"
              error={fieldState.error?.message}
              placeholder="Title"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              value={field.value as string}
              placeholder="Description ..."
              label="Description"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="priority"
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              data={[
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
                { label: "Urgent", value: "URGENT" },
              ]}
              placeholder="Select priority"
              limit={10}
              label="Priotity"
              searchable
              error={error?.message}
              nothingFoundMessage="Nothing found..."
              clearable
            />
          )}
        />
        <Controller
          control={form.control}
          name="appointmentTypeId"
          render={({ field, fieldState: { error } }) => (
            <When
              asyncState={{
                ...appointmentTypeAsync,
                data: appointmentTypeAsync.appointmentTypes,
              }}
              loading={() => <InputSkeleton />}
              error={(e) => (
                <Alert color="red" title="Error loading types">
                  {handleApiErrors(e).detail}
                </Alert>
              )}
              success={(types) => (
                <Select
                  {...field}
                  data={types.map((t) => ({ label: t.name, value: t.id }))}
                  placeholder="Select type"
                  limit={10}
                  label="Appointment type"
                  searchable
                  error={error?.message}
                  nothingFoundMessage="Nothing found..."
                  clearable
                />
              )}
            />
          )}
        />
        <Controller
          control={form.control}
          name="organizerId"
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              data={personSearchParams.people.map((p) => ({
                label: p.email ?? "",
                value: p.id,
              }))}
              placeholder="Search user"
              limit={10}
              rightSection={
                personSearchParams.isLoading && <Loader size={"xs"} />
              }
              label="Organizer"
              
              searchable
              searchValue={personSearchParams.peopleSearchValue}
              onSearchChange={personSearchParams.searchPeople}
              error={error?.message}
              nothingFoundMessage="Nothing found..."
              clearable
            />
          )}
        />
        <Controller
          control={form.control}
          name="startTime"
          render={({ field, fieldState }) => (
            <DateTimePicker
              {...field}
              label="Start time"
              description="Must be a future time"
              inputWrapperOrder={INPUT_ORDER}
              error={fieldState.error?.message}
              placeholder="dd/mm/yyyy"
            />
          )}
        />
        <Controller
          control={form.control}
          name="endTime"
          render={({ field, fieldState }) => (
            <DateTimePicker
              {...field}
              label="End time"
              description="Must be a future time and greater than start time"
              inputWrapperOrder={INPUT_ORDER}
              error={fieldState.error?.message}
              placeholder="dd/mm/yyyy"
            />
          )}
        />
      </Stack>
      <Group gap={1}>
        <Button flex={1} variant="default" radius={0} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          radius={0}
          flex={1}
          fullWidth
          type={"button"}
          variant="filled"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
          onClick={async () => {
            const valid = await form.trigger([
              "title",
              "description",
              "appointmentTypeId",
              "startTime",
              "endTime",
              "organizerId",
              "parentId",
              "priority",
            ]);
            if (valid) onNext?.();
          }}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
};

export default AppointmentBasicStep;
