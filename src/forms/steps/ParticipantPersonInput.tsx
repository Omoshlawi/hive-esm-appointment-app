import { Select, Loader } from "@mantine/core";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSearchPeople } from "../../hooks";
import { AppointmentFormData } from "../../types";

type Props = {
  index: number;
};

const ParticipantPersonInput: FC<Props> = ({ index }) => {
  const form = useFormContext<AppointmentFormData>();
  const peopleSearch = useSearchPeople();
  return (
    <Controller
      control={form.control}
      name={`participants.${index}.personId`}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          data={peopleSearch.people.map((person) => ({
            label: person?.email ?? "",
            value: person.id,
          }))}
          searchable
          nothingFoundMessage="No people found"
          onSearchChange={peopleSearch.searchPeople}
          searchValue={peopleSearch.peopleSearchValue ?? ""}
          rightSection={peopleSearch.isLoading ? <Loader size={"xs"} /> : null}
          placeholder="Search people"
          label="Person"
          error={error?.message}
        />
      )}
    />
  );
};

export default ParticipantPersonInput;
