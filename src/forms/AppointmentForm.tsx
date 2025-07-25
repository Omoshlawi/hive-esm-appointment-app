import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Appointment, AppointmentFormData } from "../types";
import {
  FieldPath,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Paper, Tabs, Stepper } from "@mantine/core";
import { useAppointmentsApi, useSearchPeople, useSearchUser } from "../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentsValidator } from "../utils/validation";
import { showNotification } from "@mantine/notifications";
import { handleApiErrors } from "@hive/esm-core-api";
import { useMediaQuery } from "@mantine/hooks";
import AppointmentBasicStep from "./steps/AppointmentBasicStep";
import AppointmentRruleStep from "./steps/AppointmentRruleStep";
import AppointmentParticipantsStep from "./steps/AppointmentParticipantsStep";
import AppointmentResourcesStep from "./steps/AppointmentResourcesStep";

type AppointmentFormProps = {
  appointment?: Appointment;
  onSuccess?: (appointment: Appointment) => void;
  onCloseWorkspace?: () => void;
};

type FormSteps = "basic" | "participants" | "resources" | "rrule";

const AppointmentForm: FC<AppointmentFormProps> = ({
  appointment,
  onCloseWorkspace,
  onSuccess,
}) => {
  const { addAppointment, updateAppointment, mutateAppointments } =
    useAppointmentsApi();
  const personSearch = useSearchPeople();

  const form = useForm<AppointmentFormData>({
    defaultValues: {
      //   title: appointment?.title,
      //   description: listing?.description,
      //   expiryDate: listing?.expiryDate,
      //   featured: listing?.featured,
      //   tags: listing?.tags ?? [],
      //   price: listing?.price ? Number(listing.price) : undefined,
      //   type: listing?.type,
    },
    resolver: zodResolver(AppointmentsValidator),
  });

  const navigateToErrorStep = useCallback(() => {
    const fieldSteps: Record<
      FormSteps,
      Array<FieldPath<AppointmentFormData>>
    > = {
      basic: [
        "title",
        "description",
        "appointmentTypeId",
        "startTime",
        "endTime",
        "organizerId",
        "parentId",
        "priority",
      ],
      rrule: ["recurrenceRule"],
      participants: ["participants"],
      resources: ["resources"],
    };

    for (const [step, fields] of Object.entries(fieldSteps)) {
      const hasError = fields.some(
        (field) => form.getFieldState(field as any).invalid
      );

      if (hasError) {
        setActiveTab(step as FormSteps);
        break;
      }
    }
  }, [form]);

  const isMobile = useMediaQuery("(max-width: 48em)");
  const [activeTab, setActiveTab] = useState<FormSteps | null>("basic");

  // Navigate to error step when form errors change
  React.useEffect(() => {
    if (Object.keys(form.formState.errors ?? {}).length > 0) {
      navigateToErrorStep();
    }
  }, [form.formState.errors, navigateToErrorStep]);

  const onSubmit: SubmitHandler<AppointmentFormData> = async (data) => {
    try {
      const res = appointment
        ? await updateAppointment(appointment?.id, data)
        : await addAppointment(data);
      onSuccess?.(res);
      onCloseWorkspace?.();
      mutateAppointments();
      showNotification({
        title: "Success",
        message: `Appointment ${
          appointment ? "updated" : "created"
        } successfully`,
        color: "teal",
      });
    } catch (error) {
      const e = handleApiErrors<AppointmentFormData>(error);
      if (e.detail) {
        showNotification({ title: "Error", message: e.detail, color: "red" });
      } else {
        // Set all backend validation errors
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof AppointmentFormData, { message: val })
        );
        setTimeout(() => {
          // Without setTimeout - runs immediately in same stack:
          navigateToErrorStep();
        }, 0);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Paper p={"md"} flex={1} h={"100%"}>
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            variant="default"
            h={"100%"}
            value={activeTab}
            onChange={(value) => {
              setActiveTab(value as FormSteps);
            }}
          >
            <Tabs.List justify={isMobile ? "space-between" : undefined}>
              <Tabs.Tab p={"lg"} value={"basic"}>
                Basic
              </Tabs.Tab>
              <Tabs.Tab p={"lg"} value={"rrule"}>
                Recurrent rule
              </Tabs.Tab>
              <Tabs.Tab p={"lg"} value={"participants"}>
                Participants
              </Tabs.Tab>
              <Tabs.Tab p={"lg"} value={"resources"}>
                Resources
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={"basic"} p={"sm"}>
              <AppointmentBasicStep
                onCancel={onCloseWorkspace}
                onNext={() => setActiveTab("rrule")}
                personSearchParams={personSearch}
              />
            </Tabs.Panel>
            <Tabs.Panel value={"rrule"} p={"sm"}>
              <AppointmentRruleStep
                onNext={() => setActiveTab("participants")}
                onPrev={() => setActiveTab("basic")}
              />
            </Tabs.Panel>
            <Tabs.Panel value={"participants"} p={"sm"}>
              <AppointmentParticipantsStep
                onNext={() => setActiveTab("resources")}
                onPrev={() => setActiveTab("rrule")}
              />
            </Tabs.Panel>
            <Tabs.Panel value={"resources"} p={"sm"}>
              <AppointmentResourcesStep
                onPrev={() => setActiveTab("participants")}
              />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </form>
    </FormProvider>
  );
};

export default AppointmentForm;
