import { Appointment, AppointmentResource, Resource } from "../types";
export const getPriorityColor = (priority: Appointment["priority"]): string => {
  switch (priority) {
    case "LOW":
      return "#4CAF50"; // Green
    case "MEDIUM":
      return "#FFC107"; // Amber/Yellow
    case "HIGH":
      return "#FF9800"; // Orange
    case "URGENT":
      return "#F44336"; // Red
    default:
      return "#9E9E9E"; // Grey for unknown/default
  }
};

export const getStatusColor = (status: Appointment["status"]): string => {
  switch (status) {
    case "SCHEDULED":
      return "#2196F3"; // Blue - For upcoming appointments
    case "CONFIRMED":
      return "#4CAF50"; // Green - Confirmed and ready
    case "IN_PROGRESS":
      return "#FFC107"; // Amber/Yellow - Currently happening
    case "COMPLETED":
      return "#607D8B"; // Blue-Grey - Finished
    case "CANCELLED":
      return "#F44336"; // Red - Cancelled
    case "NO_SHOW":
      return "#9C27B0"; // Purple - Patient did not show up
    case "RESCHEDULED":
      return "#FF9800"; // Orange - Has been rescheduled
    default:
      return "#9E9E9E"; // Grey for unknown/default status
  }
};

export const getResourceLink = (resource: AppointmentResource) => {
  switch (resource.resourceModel) {
    case "Listing":
      return `/dashboard/listings/${resource.resourceId}`;
    case "Property":
      return `/dashboard/properties/${resource.resourceId}`;
    default:
      return "#";
  }
};
