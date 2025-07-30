import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PersonFormData } from "./input-resources";
import { zodResolver } from "@hookform/resolvers/zod";
import { Personvalidator } from "./input-resources";
import { handleApiErrors, Person } from "@hive/esm-core-api";
import { showNotification } from "@mantine/notifications";
import { usePersonApi } from "./input-resources";
import { Button, Group, Select, Stack, TextInput } from "@mantine/core";

type Props = {
  person?: Person;
  onSuccess?: (person: Person) => void;
  onClose?: () => void;
};

const PersonDetailsForm: FC<Props> = ({ person, onSuccess, onClose }) => {
  const form = useForm<PersonFormData>({
    defaultValues: {
      email: person?.email ?? "",
      phoneNumber: person?.phoneNumber ?? "",
      firstName: person?.firstName ?? "",
      lastName: person?.lastName ?? "",
      surname: person?.surname ?? "",
      gender: person?.gender as any,
    },
    resolver: zodResolver(Personvalidator),
  });
  const { addPerson, updatePerson, mutatePerson } = usePersonApi();
  const onSubmit: SubmitHandler<PersonFormData> = async (data) => {
    try {
      const _property = person
        ? await updatePerson(person?.id, data)
        : await addPerson(data);

      onSuccess?.(_property);
      onClose?.();
      showNotification({
        title: "success",
        message: `Person ${person ? "updated" : "created"} successfully`,
        color: "teal",
      });
      mutatePerson();
    } catch (error) {
      const e = handleApiErrors<PersonFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof PersonFormData, { message: val })
        );
    }
  };
  return (
    <Stack component={"form"} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="firstName"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            withAsterisk
            label="First name"
            placeholder="e.g Hohn"
            error={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="lastName"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            withAsterisk
            label="Last name"
            placeholder="e.g Doe"
            error={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="surname"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label="Surname"
            placeholder="Enter surname"
            error={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label="Email"
            type="email"
            withAsterisk
            placeholder="e.g johndoe@hive.co.ke"
            error={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="phoneNumber"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            label="Phone number"
            withAsterisk
            placeholder="e.g 25412345678"
            error={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="gender"
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            label="Gender"
            placeholder="Select gender"
            data={["Male", "Female"]}
            error={error?.message}
          />
        )}
      />
      <Group justify="flex-end">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default PersonDetailsForm;
