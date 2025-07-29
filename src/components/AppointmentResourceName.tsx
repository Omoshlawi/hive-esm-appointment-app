import React, { FC } from "react";
import { AppointmentResource } from "../types";
import { useResource } from "../hooks";
import { Alert, Loader, Title } from "@mantine/core";
import { handleApiErrors } from "@hive/esm-core-api";

type Props = {
  resource: AppointmentResource;
};

const AppointmentResourceName: FC<Props> = ({ resource }) => {
  const {
    error,
    isLoading,
    resource: appResource,
  } = useResource(resource.resourceModel, resource.resourceId);
  if (isLoading) return <Loader size={"sm"} />;
  if (error)
    return (
      <Alert
        color="red"
        variant="light"
        title={"Error getting resource: " + `${handleApiErrors(error)?.detail}`}
      />
    );
  return <Title order={6}>{appResource?.name}</Title>;
};

export default AppointmentResourceName;
