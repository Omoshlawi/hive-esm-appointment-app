import { EmptyState } from "@hive/esm-core-components";
import { Loader, Select, SelectProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  Path,
} from "react-hook-form";
import { useSearchPeople } from "./input-resources";
import { closeModal, openModal } from "@mantine/modals";
import PersonDetailsForm from "./PersonDetailsForm";

type Props<T> = SelectProps & {
  control: Control<T>;
  name: Path<T>;
};
const PersonInput = <T,>({ control, name, ...props }: Props<T>) => {
  const personsearchAsync = useSearchPeople();

  const handleAddPerson = ({ onChange }: ControllerRenderProps<T, Path<T>>) => {
    const id = openModal({
      title: "Add Person",
      children: (
        <PersonDetailsForm
          onClose={() => closeModal(id)}
          onSuccess={(person) => {
            personsearchAsync.searchPeople(person.email);
            onChange(person.id);
          }}
        />
      ),
    });
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Select
          label="Person"
          placeholder="Search ..."
          leftSection={<IconSearch size={16} />}
          rightSection={personsearchAsync.isLoading && <Loader size="xs" />}
          {...props}
          {...field}
          value={field.value as string}
          nothingFoundMessage={
            <EmptyState
              py={0}
              title="Nothing found"
              message="Search ..."
              onAdd={() => handleAddPerson(field)}
            />
          }
          clearable
          searchable
          searchValue={personsearchAsync.peopleSearchValue}
          onSearchChange={personsearchAsync.searchPeople}
          data={personsearchAsync.people.map((person) => ({
            label: person.email,
            value: person.id,
          }))}
          error={error?.message}
        />
      )}
    />
  );
};

export default PersonInput;
