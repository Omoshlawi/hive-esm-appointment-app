import {
  Button,
  Paper,
  Stack,
  Title,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import React, { FC } from "react";
import InquiryForm from "../forms/InquiryForm";

type Props = {
  listingId: string;
};

const PublicListingBookAppointment: FC<Props> = ({ listingId }) => {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor];
  const gradientFrom = primaryColor[6];
  const gradientTo = primaryColor[8];

  const handleOpenInquaryDialog = () => {
    openModal({ title: "Send Inquiry", size: "md", children: <InquiryForm /> });
  };
  return (
    <Paper
      p="lg"
      radius="md"
      shadow="sm"
      style={{
        background: `linear-gradient(45deg, ${primaryColor[6]}10, ${primaryColor[8]}10)`,
        border: `1px solid ${primaryColor[6]}30`,
      }}
    >
      <Stack gap="md" align="center">
        <Title order={4} ta="center">
          Schedule a Viewing
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          See this property in person
        </Text>
        <Button
          fullWidth
          variant="gradient"
          gradient={{ from: gradientFrom, to: gradientTo }}
          onClick={handleOpenInquaryDialog}
        >
          Book Viewing
        </Button>
      </Stack>
    </Paper>
  );
};

export default PublicListingBookAppointment;
