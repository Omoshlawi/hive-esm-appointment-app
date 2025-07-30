import {
  Badge,
  Card,
  Group,
  Paper,
  Stack,
  Table,
  Tabs,
  ThemeIcon,
  Title,
  Text,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconCalendar,
  IconDatabase,
  IconEdit,
  IconExternalLink,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import React, { FC, useMemo } from "react";
import {
  Appointment,
  AppointmentParticipant,
  PropsWithLaunchWorkspace,
} from "../types";
import {
  getPriorityColor,
  getResourceLink,
  getStatusColor,
} from "../utils/helpers";
import { RRule } from "rrule";
import { Link } from "react-router-dom";
import AppointmentResourceName from "./AppointmentResourceName";
import AppointmentParticipantForm from "../forms/AppointmentParticipantForm";
type Props = PropsWithLaunchWorkspace & {
  appointment: Appointment;
};

const AppointmentExpandedRow: FC<Props> = ({
  appointment,
  launchWorkspace,
}) => {
  const humanDescription = useMemo(() => {
    try {
      const rule = RRule.fromString(appointment.recurrenceRule);
      return rule.toText();
    } catch {
      return "Invalid rule";
    }
  }, [appointment]);

  const handleAddParticipants = (participant: AppointmentParticipant) => {
    const dispose = launchWorkspace(
      <AppointmentParticipantForm
        appointmentId={appointment.id}
        onCloseWorkspace={() => dispose()}
        participant={participant}
      />,
      {
        title: "Add Appointment Participants",
      }
    );
  };
  return (
    <Tabs defaultValue="appointment" orientation="vertical" variant="default">
      <Tabs.List>
        <Tabs.Tab value="appointment" leftSection={<IconCalendar size={12} />}>
          Appointment
        </Tabs.Tab>
        <Tabs.Tab value="resources" leftSection={<IconDatabase size={12} />}>
          Resources
        </Tabs.Tab>
        <Tabs.Tab value="participants" leftSection={<IconUsers size={12} />}>
          Participants
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="appointment">
        <Paper>
          <Table variant="vertical" layout="fixed" withTableBorder>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={160}>Title</Table.Th>
                <Table.Td>{appointment.title}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Td>{appointment.appointmentType?.name ?? "--"}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>Priority</Table.Th>
                <Table.Td>
                  <Badge
                    size="xs"
                    variant="light"
                    color={getPriorityColor(appointment.priority)}
                  >
                    {appointment.priority}
                  </Badge>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Status</Table.Th>
                <Table.Td>
                  <Badge
                    size="xs"
                    variant="light"
                    color={getStatusColor(appointment.status)}
                  >
                    {appointment.status.replace("_", " ")}
                  </Badge>
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>Recurrent Rule</Table.Th>
                <Table.Td>{humanDescription}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>Start Time</Table.Th>
                <Table.Td>
                  {new Date(appointment.startTime).toLocaleString()}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>End Time</Table.Th>
                <Table.Td>
                  {new Date(appointment.endTime).toLocaleString()}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="resources">
        <Stack p={"xs"} gap={"xs"}>
          {(appointment.resources ?? []).map((resource) => (
            <React.Fragment key={resource.id}>
              <Group>
                <ThemeIcon variant="light" radius={"xl"} size={"xl"}>
                  <IconDatabase />
                </ThemeIcon>
                <Stack gap={"xs"} flex={1}>
                  <Group>
                    <AppointmentResourceName resource={resource} />
                    <Badge variant="light" size="sm">
                      {resource.resourceModel}
                    </Badge>
                  </Group>
                  <Text c={"dimmed"}>
                    {resource?.notes ? resource.notes : "No notes attached"}
                  </Text>
                </Stack>
                <Group>
                  <ActionIcon
                    variant="transparent"
                    component={Link}
                    to={getResourceLink(resource)}
                  >
                    <IconExternalLink />
                  </ActionIcon>
                </Group>
              </Group>
              <Divider />
            </React.Fragment>
          ))}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="participants">
        <Table
          striped
          withTableBorder
          data={{
            head: ["Participant", "Role", "Status", "Responded at", "Actions"],
            body: (appointment.participants ?? []).map((participant) => [
              participant.personId,
              participant.role,
              participant.status,
              participant.respondedAt ?? "--",
              <Group>
                <ActionIcon
                  variant={"light"}
                  color="green"
                  onClick={() => handleAddParticipants(participant)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon variant={"light"} color="red">
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>,
            ]),
          }}
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default AppointmentExpandedRow;
