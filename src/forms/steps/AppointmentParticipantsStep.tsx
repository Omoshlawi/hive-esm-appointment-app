import {
  Stack,
  Title,
  Group,
  Button,
  Fieldset,
  Select,
  Textarea,
  TextInput,
  Checkbox,
  Loader,
} from "@mantine/core";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppointmentFormData } from "../../types";
import { TablerIcon } from "@hive/esm-core-components";
import { useSearchPeople } from "../../hooks";
import ParticipantPersonInput from "./ParticipantPersonInput";

type Props = {
  onNext?: () => void;
  onPrev?: () => void;
};
const AppointmentParticipantsStep: FC<Props> = ({ onNext, onPrev }) => {
  const form = useFormContext<AppointmentFormData>();
  const participants = form.watch("participants") ?? [];
  return (
    <Stack h={"100%"} justify="space-between">
      <Stack gap={"md"}>
        <Title order={4} pt={"lg"}>
          Appointment Participants
        </Title>
        {participants.map((_, index) => (
          <Fieldset legend="Appointment participant" py={"xs"} key={index}>
            <Stack flex={1} gap={"xs"}>
              <ParticipantPersonInput index={index}/>
              <Controller
                control={form.control}
                name={`participants.${index}.role`}
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
                name={`participants.${index}.notes`}
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
                name={`participants.${index}.isRequired`}
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
              <Button
                color="red"
                variant="light"
                onClick={() => {
                  const fields = participants.filter((_, i) => i !== index);
                  form.setValue(`resources`, fields);
                }}
                leftSection={<TablerIcon name="trash" size={16} />}
              >
                Delete
              </Button>
            </Stack>
          </Fieldset>
        ))}
        <Button
          variant="outline"
          leftSection={<TablerIcon name="plus" />}
          onClick={() => {
            form.setValue(`participants.${participants.length}`, {});
          }}
        >
          Add Participant
        </Button>
      </Stack>
      <Group gap={1}>
        <Button flex={1} variant="default" radius={0} onClick={onPrev}>
          Previous
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
            const valid = await form.trigger("participants");
            if (valid) onNext?.();
          }}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
};

export default AppointmentParticipantsStep;
