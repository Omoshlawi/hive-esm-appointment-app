import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppointmentFormData } from "../../types";
import { Stack, Title, Group, Button } from "@mantine/core";
import { RecurrentRuleInput } from "../../components/RRule/RecurrentRuleInput";
import dayjs from "dayjs";
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
        {/* // With Day.js */}
        <Controller
          control={form.control}
          name="recurrenceRule"
          render={({ field, fieldState }) => (
            <RecurrentRuleInput
              value={field.value}
              onChange={field.onChange}
              startDate={dayjs()}
              maxUntil={dayjs().add(1, "year")}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* // With native Date (still supported) */}
        {/* <RecurrentRuleInput
          //   value={rrule}
          //   onChange={setRrule}
          startDate={new Date()}
          maxUntil={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
        /> */}
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
