import { Loader, Select, Text } from "@mantine/core";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AppointmentFormData } from "../../types";
import { useResources } from "../../hooks";

type Props = {
  index: number;
};
const AppointmentResourceFormInput: FC<Props> = ({ index }) => {
  const form = useFormContext<AppointmentFormData>();
  const model = form.watch(`resources.${index}.resourceModel`);
  const resourcesAsync = useResources(model);

  return (
    <Controller
      control={form.control}
      name={`resources.${index}.resourceId`}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          data={resourcesAsync.resources?.map((resource) => ({
            label: resource.name,
            value: resource.id,
          }))}
          disabled={!model}
          searchable
          nothingFoundMessage="No resources found"
          onSearchChange={resourcesAsync.searchResources}
          searchValue={resourcesAsync.resourcesSearchValue ?? ""}
          rightSection={resourcesAsync.isLoading && <Loader size={"xs"} />}
          placeholder="Search Resource"
          label="Resource"
          error={error?.message}
        />
      )}
    />
  );
};

export default AppointmentResourceFormInput;
