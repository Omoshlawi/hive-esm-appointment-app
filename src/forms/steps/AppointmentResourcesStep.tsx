import React, { FC } from "react";
import { AppointmentFormData } from "../../types";
import { Stack, Title, Group, Button } from "@mantine/core";
import { useFormContext } from "react-hook-form";

type Props = {
  onPrev?: () => void;
};

const AppointmentResourcesStep: FC<Props> = ({  onPrev }) => {
  const form = useFormContext<AppointmentFormData>();

  return (
    <Stack h={"100%"} justify="space-between">
      <Stack gap={"md"}>
        <Title order={4} pt={"lg"}>
          Appointment resources
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
