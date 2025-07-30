import { PiletApi } from "@hive/esm-shell-app";
import React, { FC, useMemo } from "react";
import { useAppointments } from "../hooks";
import { Appointment } from "../types";
import AppointmentForm from "../forms/AppointmentForm";
import { openConfirmModal } from "@mantine/modals";
import {
  ActionIcon,
  Badge,
  Box,
  getBaseValue,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import {
  DashboardPageHeader,
  DataTableColumnHeader,
  StateFullDataTable,
  TablerIcon,
} from "@hive/esm-core-components";
import { RRule } from "rrule";
import AppointmentExpandedRow from "../components/AppointmentExpandedRow";
import { getPriorityColor, getStatusColor } from "../utils/helpers";
import AppointmentParticipantForm from "../forms/AppointmentParticipantForm";

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

  const handleAddParticipants = (appointment: Appointment) => {
    const dispose = launchWorkspace(
      <AppointmentParticipantForm
        appointmentId={appointment.id}
        onCloseWorkspace={() => dispose()}
      />,
      {
        title: "Add Appointment Participants",
      }
    );
  };

  return (
    <Stack>
      <Box>
        <DashboardPageHeader
          title="Appointments"
          subTitle={"Manage Appointments"}
          icon={"calendar"}
        />
      </Box>
      <StateFullDataTable
        title="Appointments"
        onAdd={() => handleAddOrupdate()}
        columns={[
          ...columns,
          {
            id: "actions",
            header: "Actions",
            cell({ row }) {
              const appointment = row.original;
              return (
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle" aria-label="Settings">
                      <TablerIcon
                        name="dotsVertical"
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<TablerIcon name="edit" size={14} />}
                      onClick={() => handleAddOrupdate(appointment)}
                    >
                      Edit Appointment
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="userPlus" size={14} />}
                      onClick={() => handleAddParticipants(appointment)}
                    >
                      Add Participant
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="databasePlus" size={14} />}
                    >
                      Add resource
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="trash" size={14} />}
                      onClick={() => handleDelete(appointment)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              );
            },
          },
        ]}
        {...appointmentsAsync}
        data={appointmentsAsync.appointments}
        withColumnViewOptions
        renderExpandedRow={({ original: appointment }) => (
          <AppointmentExpandedRow
            appointment={appointment}
            launchWorkspace={launchWorkspace}
          />
        )}
      />
    </Stack>
  );
};

export default AppointmentsPage;
const columns: ColumnDef<Appointment>[] = [
  {
    id: "expand",
    size: 0,
    header: ({ table }) => {
      const allRowsExpanded = table.getIsAllRowsExpanded();
      //   const someRowsExpanded = table.getIsSomeRowsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => table.toggleAllRowsExpanded(!allRowsExpanded)}
          style={{ cursor: "pointer" }}
          aria-label="Expand all"
        >
          <TablerIcon
            name={allRowsExpanded ? "chevronUp" : "chevronDown"}
            size={16}
          />
        </ActionIcon>
      );
    },
    cell: ({ row }) => {
      const rowExpanded = row.getIsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => row.toggleExpanded(!rowExpanded)}
          style={{ cursor: "pointer" }}
          aria-label="Expand Row"
        >
          <TablerIcon
            name={rowExpanded ? "chevronUp" : "chevronDown"}
            size={16}
          />
        </ActionIcon>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "appointmentType.name", header: "Type" },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell({ getValue }) {
      const value = getValue<Appointment["priority"]>();
      return (
        <Badge color={getPriorityColor(value)} variant="light">
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell({ getValue }) {
      const value = getValue<Appointment["status"]>();
      return (
        <Badge color={getStatusColor(value)} variant="light">
          {value.replace("_", " ")}
        </Badge>
      );
    },
  },
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
