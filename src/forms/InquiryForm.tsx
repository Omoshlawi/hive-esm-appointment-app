import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import React from "react";

const InquiryForm = () => {
  return (
    <Stack gap="md">
      <TextInput label="Your Name" placeholder="Enter your name" required />
      <TextInput
        label="Email"
        placeholder="Enter your email"
        type="email"
        required
      />
      <TextInput label="Phone" placeholder="Enter your phone number" />
      <Group grow>
        <TextInput label="Preferred Visit Date" type="date" />
        <Select
          label="Preferred Time"
          placeholder="Select time"
          data={[
            { value: "09:00", label: "9:00 AM" },
            { value: "10:00", label: "10:00 AM" },
            { value: "11:00", label: "11:00 AM" },
            { value: "14:00", label: "2:00 PM" },
            { value: "15:00", label: "3:00 PM" },
            { value: "16:00", label: "4:00 PM" },
          ]}
        />
      </Group>
      <Textarea
        label="Message"
        placeholder="Tell us about your requirements..."
        rows={4}
      />
      <Group justify="flex-end" gap="xs">
        <Button variant="outline">Cancel</Button>
        <Button leftSection={<IconSend size={16} />}>Send Inquiry</Button>
      </Group>
    </Stack>
  );
};

export default InquiryForm;
