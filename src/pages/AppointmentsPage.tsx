import { PiletApi } from "@hive/esm-shell-app";
import React, { FC, useMemo } from "react";
import { useAppointments } from "../hooks";
import { Appointment } from "../types";
import AppointmentForm from "../forms/AppointmentForm";
import { openConfirmModal } from "@mantine/modals";
import { ActionIcon, getBaseValue, Group, Text } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import {
  DataTableColumnHeader,
  StateFullDataTable,
  TablerIcon,
} from "@hive/esm-core-components";
import { RRule } from "rrule";

type AppointmentsPageProps = Pick<PiletApi, "launchWorkspace">;

const AppointmentsPage: FC<AppointmentsPageProps> = ({ launchWorkspace }) => {
  const appointmentsAsync = useAppointments();
  const handleAddOrupdate = (appointmenttype?: Appointment) => {
    const dispose = launchWorkspace(
      <AppointmentForm
        appointment={appointmenttype}
        onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      {
        title: appointmenttype ? "Update Appointment" : "Add Appointment",
        width: "extra-wide",
        expandable: true,
      }
    );
  };
  const handleDelete = (appointment: Appointment) => {
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
    <StateFullDataTable
      title="Appointments"
      onAdd={() => handleAddOrupdate()}
      columns={[
        ...columns,
        {
          id: "actions",
          header: "Actions",
          cell({ row }) {
            const listing = row.original;
            return (
              <Group>
                <Group>
                  <ActionIcon
                    variant="outline"
                    aria-label="Settings"
                    color="red"
                    onClick={() => handleDelete(listing)}
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
      {...appointmentsAsync}
      data={appointmentsAsync.appointments}
      withColumnViewOptions
    />
  );
};

export default AppointmentsPage;
const columns: ColumnDef<Appointment>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "recurrenceRule",
    header: "Recurrent rule",
    cell({ getValue }) {
      const value = getValue<string>();
      const humanDescription = useMemo(() => {
        try {
          const rule = RRule.fromString(value);
          return rule.toText();
        } catch {
          return "Invalid rule";
        }
      }, [value]);
      return humanDescription;
    },
  },
  {
    accessorKey: "startTime",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Start time" />;
    },
    cell({ getValue }) {
      const created = getValue<string>();
      return new Date(created).toLocaleString();
    },
  },
  {
    accessorKey: "endTime",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="End time" />;
    },
    cell({ getValue }) {
      const created = getValue<string>();
      return new Date(created).toLocaleString();
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
