import { PiletApi } from "@hive/esm-shell-app";
import React, { FC } from "react";
import { AppointmentType } from "../types";
import AppointmentTypeForm from "../forms/AppointmentTypeForm";
import { openConfirmModal } from "@mantine/modals";
import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import {
  DashboardPageHeader,
  DataTableColumnHeader,
  StateFullDataTable,
  TablerIcon,
} from "@hive/esm-core-components";
import { useAppointmentTypes } from "../hooks";
type AppointmentTypesPageProps = Pick<PiletApi, "launchWorkspace">;

const AppointmentTypesPage: FC<AppointmentTypesPageProps> = ({
  launchWorkspace,
}) => {
  const appointmentTypesAsync = useAppointmentTypes();
  const handleAddOrupdate = (appointmenttype?: AppointmentType) => {
    const dispose = launchWorkspace(
      <AppointmentTypeForm
        appointmentType={appointmenttype}
        onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      {
        title: appointmenttype
          ? "Update Appointment type"
          : "Add Appointment type",
      }
    );
  };
  const handleDelete = (appointmentType: AppointmentType) => {
    openConfirmModal({
      title: "Delete listing",
      children: (
        <Text>
          Are you sure you want to delete this role.This action is destructive
          and will delete all data related to role
        </Text>
      ),
      labels: { confirm: "Delete Listing", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm() {
        // TODO Implement delete
      },
    });
  };
  return (
    <Stack>
      <Box>
        <DashboardPageHeader
          title="Appointment Types"
          subTitle={"Manage Appointment Types"}
          icon={"calendarCog"}
        />
      </Box>
      <StateFullDataTable
        title="Appointment types"
        onAdd={() => handleAddOrupdate()}
        columns={[
          ...columns,
          {
            id: "actions",
            header: "Actions",
            cell({ row }) {
              const appointmentType = row.original;
              return (
                <Group>
                  <Group>
                    <ActionIcon
                      variant="outline"
                      aria-label="Settings"
                      color="green"
                      onClick={() => handleAddOrupdate(appointmentType)}
                    >
                      <TablerIcon
                        name="edit"
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <ActionIcon
                      variant="outline"
                      aria-label="Settings"
                      color="red"
                      onClick={() => handleDelete(appointmentType)}
                    >
                      <TablerIcon
                        name="trash"
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Group>
                </Group>
              );
            },
          },
        ]}
        {...appointmentTypesAsync}
        data={appointmentTypesAsync.appointmentTypes}
        withColumnViewOptions
      />
    </Stack>
  );
};

export default AppointmentTypesPage;

const columns: ColumnDef<AppointmentType>[] = [
  {
    accessorKey: "name",
    header: "Appointment Type",
  },
  {
    accessorKey: "maxParticipants",
    header: "Max participants",
  },
  {
    accessorKey: "bufferTimeBefore",
    header: "Time Before",
    cell({ getValue }) {
      const time = getValue<number>();
      return `${time} Mins`;
    },
  },
  {
    accessorKey: "bufferTimeAfter",
    header: "Time After",
    cell({ getValue }) {
      const time = getValue<number>();
      return `${time} Mins`;
    },
  },
  {
    accessorKey: "defaultDuration",
    header: "Default Duration",
    cell({ getValue }) {
      const time = getValue<number>();
      return `${time} Mins`;
    },
  },
  {
    accessorKey: "allowOnlineBooking",
    header: "Bookable online",
    cell({ getValue }) {
      const bookable = getValue<boolean>();
      return (
        <TablerIcon
          name={bookable ? "circleCheck" : "circleX"}
          color={bookable ? "teal" : "red"}
        />
      );
    },
  },
  {
    accessorKey: "requiresApproval",
    header: "Require approval",
    cell({ getValue }) {
      const requireApproval = getValue<boolean>();
      return (
        <TablerIcon
          name={requireApproval ? "circleCheck" : "circleX"}
          color={requireApproval ? "teal" : "red"}
        />
      );
    },
  },
  {
    accessorKey: "category",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell({ getValue }) {
      const category = getValue<AppointmentType["category"]>();
      return category.replace("_", " ");
    },
  },
  {
    accessorKey: "createdAt",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Date Created" />;
    },
    cell({ getValue }) {
      const created = getValue<string>();
      return new Date(created).toDateString();
    },
  },
];
