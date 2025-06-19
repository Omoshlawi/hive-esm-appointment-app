import { PiletApi } from "@hive/esm-shell-app";
import React, { FC } from "react";

type AppointmentsPageProps = Pick<PiletApi, "launchWorkspace">;

const AppointmentsPage: FC<AppointmentsPageProps> = ({ launchWorkspace }) => {
  return <div>AppointmentsPage</div>;
};

export default AppointmentsPage;
