import { BookingItem, DriverItem, VehicleItem } from "./booking";

export type AssignmentFilterType =
  | "all"
  | "fully_assigned"
  | "vehicle_missing"
  | "driver_missing"
  | "both_missing";

export interface DailyOperationsFilter {
  assignment?: AssignmentFilterType;
  status?: string;
  vehicleId?: string;
  driverId?: string;
  search?: string;
}

export interface OperationalSummaryMetrics {
  totalTrips: number;
  unassignedVehiclesCount: number;
  unassignedDriversCount: number;
  availableVehiclesCount: number;
  vehiclesOnTripCount: number;
  vehiclesMaintenanceCount: number;
  availableDriversCount: number;
  inProgressCount: number;
  completedCount: number;
}

export interface VehicleAvailabilityItem {
  vehicle: VehicleItem;
  availabilityStatus: "available" | "assigned" | "on_trip" | "maintenance" | "inactive";
  statusReason?: string;
  currentTrip?: BookingItem;
  dayTrips: BookingItem[];
}

export interface DriverAvailabilityItem {
  driver: DriverItem;
  availabilityStatus: "available" | "assigned" | "on_trip" | "inactive";
  statusReason?: string;
  currentTrip?: BookingItem;
  dayTrips: BookingItem[];
}

export interface DailyOperationsData {
  date: string; // YYYY-MM-DD in Asia/Kolkata
  formattedDate: string; // e.g. "Wednesday, 26 August 2026"
  isToday: boolean;
  isTomorrow: boolean;
  metrics: OperationalSummaryMetrics;
  trips: BookingItem[];
  attentionTrips: BookingItem[]; // trips missing vehicle or driver or both
  cancelledTrips: BookingItem[];
  vehicles: VehicleAvailabilityItem[];
  drivers: DriverAvailabilityItem[];
  allDriversList: DriverItem[];
  allVehiclesList: VehicleItem[];
}
