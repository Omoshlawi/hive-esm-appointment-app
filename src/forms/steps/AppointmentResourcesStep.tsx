import { TablerIcon } from "@hive/esm-core-components";
import {
  Button,
  Fieldset,
  Group,
  Select,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppointmentFormData } from "../../types";
import AppointmentResourceFormInput from "./AppointmentResourceFormInput";

type Props = {
  onPrev?: () => void;
};

const AppointmentResourcesStep: FC<Props> = ({ onPrev }) => {
  const form = useFormContext<AppointmentFormData>();
  const resources = form.watch("resources") ?? [];
  return (
    <Stack h={"100%"} justify="space-between">
      <Stack gap={"md"}>
        <Title order={4} pt={"lg"}>
          Appointment resources
        </Title>
        {resources.map((_, index) => (
          <Fieldset legend="Appointment resource" py={"xs"}>
            <Stack flex={1} gap={"xs"}>
              <Controller
                control={form.control}
                name={`resources.${index}.resourceModel`}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    data={[
                      { label: "Listing", value: "Listing" },
                      { label: "Property", value: "Property" },
                    ]}
                    placeholder="Select resource model"
                    label="Resource model"
                    error={error?.message}
                    clearable
                  />
                )}
              />
              <AppointmentResourceFormInput index={index} />
              <Controller
                control={form.control}
                name={`resources.${index}.notes`}
                render={({ field, fieldState: { error } }) => (
                  <Textarea
                    {...field}
                    placeholder="Notes..."
                    label="Notes"
                    error={error?.message}
                  />
                )}
              />

              <Button
                color="red"
                variant="light"
                onClick={() => {
                  const fields = resources.filter((_, i) => i !== index);
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
            form.setValue(`resources.${resources.length}`, {});
          }}
        >
          Add Resource
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
          type={"submit"}
          variant="filled"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default AppointmentResourcesStep;
