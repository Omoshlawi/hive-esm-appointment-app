import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { AppointmentFormData } from "../../types";
import { Stack, Title, Group, Button } from "@mantine/core";
type Props = {
  onNext?: () => void;
  onPrev?: () => void;
};
const AppointmentRruleStep: FC<Props> = ({ onNext, onPrev }) => {
  const form = useFormContext<AppointmentFormData>();

  return (
    <Stack h={"100%"} justify="space-between">
      <Stack gap={"md"}>
        <Title order={4} pt={"lg"}>
          Appointment RRule
        </Title>
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
            const valid = await form.trigger("recurrenceRule");
            if (valid) onNext?.();
          }}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
};

export default AppointmentRruleStep;
