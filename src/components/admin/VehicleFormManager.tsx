"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  Car,
  AlertCircle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { VehicleItem, VehicleStatus, VehicleOwnerType } from "@/types/booking";
import { saveVehicleAction, toggleVehicleStatusAction } from "@/actions/bookingActions";
import { VehicleImageUploader } from "@/components/admin/VehicleImageUploader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface VehicleFormManagerProps {
  vehicle: VehicleItem | null;
}

export function VehicleFormManager({ vehicle }: VehicleFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isNew = !vehicle || vehicle.id === "new";

  const [name, setName] = useState(vehicle?.name || "");
  const [displayName, setDisplayName] = useState(vehicle?.displayName || "");
  const [registrationNumber, setRegistrationNumber] = useState(vehicle?.registrationNumber || "");
  const [categoryName, setCategoryName] = useState(vehicle?.categoryName || "");
  const [seatingCapacity, setSeatingCapacity] = useState<number>(vehicle?.seatingCapacity || 7);
  const [ownerType, setOwnerType] = useState<VehicleOwnerType>(vehicle?.ownerType || "owned");
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status || "available");
  const [fuelType, setFuelType] = useState(vehicle?.fuelType || "Diesel");
  const [acType, setAcType] = useState(vehicle?.acType || "AC");
  const [description, setDescription] = useState(vehicle?.description || "");
  const [notes, setNotes] = useState(vehicle?.notes || "");
  const [showInHero, setShowInHero] = useState<boolean>(vehicle?.showInHero ?? true);
  const [displayOrder, setDisplayOrder] = useState<number>(vehicle?.displayOrder || 0);
  const [images, setImages] = useState(vehicle?.images || []);
  const [isActive, setIsActive] = useState<boolean>(vehicle?.isActive ?? true);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: "error", text: "Vehicle model/name is required." });
      return;
    }

    startTransition(async () => {
      const primaryImage = images.length > 0 ? images[0].url : vehicle?.imageUrl;
      const primaryAlt = images.length > 0 ? images[0].altText : vehicle?.altText;

      const res = await saveVehicleAction({
        id: vehicle?.id,
        name: name.trim(),
        displayName: displayName.trim() || undefined,
        registrationNumber: registrationNumber.trim() || undefined,
        categoryName: categoryName.trim() || undefined,
        seatingCapacity: Number(seatingCapacity) || 6,
        ownerType,
        status,
        fuelType: fuelType.trim() || undefined,
        acType: acType.trim() || undefined,
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
        imageUrl: primaryImage,
        images: images,
        altText: primaryAlt || `${name.trim()} taxi for Shirdi pilgrimage`,
        showInHero,
        displayOrder: Number(displayOrder) || 0,
        isActive,
      });

      if (res.success) {
        setMessage({
          type: "success",
          text: isNew ? "Vehicle created successfully." : "Vehicle updated successfully.",
        });
        if (isNew && res.id) {
          router.push(`/admin/vehicles/${res.id}`);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save vehicle." });
      }
    });
  };

  const handleToggleActive = () => {
    if (!vehicle?.id || isNew) return;
    setMessage(null);

    startTransition(async () => {
      const newActive = !isActive;
      const res = await toggleVehicleStatusAction({
        id: vehicle.id,
        isActive: newActive,
      });

      if (res.success) {
        setIsActive(newActive);
        if (!newActive) setStatus("inactive");
        else if (status === "inactive") setStatus("available");
        setMessage({
          type: "success",
          text: `Vehicle marked as ${newActive ? "Active" : "Inactive"}.`,
        });
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to toggle status." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-brand-maroon" />
              Vehicle Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Vehicle Model / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maruti Suzuki Ertiga"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Display Name (Admin Identifier)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ertiga — Vehicle 01"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
                <p className="text-[11px] text-stone-400">
                  Short friendly name shown in assignment dropdowns.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. MH-15-XX-1234"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono uppercase rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
                <p className="text-[11px] text-stone-400">
                  Optional. Add when exact number is verified.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Seating Capacity (Pax) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
                <p className="text-[11px] text-stone-400">
                  Excluding driver (e.g. 6 for Ertiga, 7/8 for Tavera).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Fuel Type
                </label>
                <input
                  type="text"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  placeholder="e.g. Diesel / CNG / Petrol"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Air Conditioning
                </label>
                <input
                  type="text"
                  value={acType}
                  onChange={(e) => setAcType(e.target.value)}
                  placeholder="e.g. AC / Dual AC"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Public Overview / Short Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Pristine cleanliness, dual AC, pushback seats, ideal for family pilgrimage."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
              <p className="text-[11px] text-stone-400">
                Appears on website fleet showcases and vehicle cards.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Internal Operational Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Owned vehicle, regular serviced at Shirdi hub, good for long journeys."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>
          </div>

          {/* Vehicle Photos & Supabase Storage */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-brand-charcoal-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-maroon" />
                <span>Vehicle Photos &amp; Hero Showcase Media</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload real photos of this vehicle. The first photo is automatically used in the Homepage Hero showcase.
              </p>
            </div>

            <VehicleImageUploader
              vehicleId={vehicle?.id || "temp"}
              images={images}
              onChange={setImages}
            />
          </div>
        </div>

        {/* Operational / Status Sidebar */}
        <div className="space-y-6">
          {/* Hero Showcase Settings */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Homepage Hero Showcase
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInHero}
                  onChange={(e) => setShowInHero(e.target.checked)}
                  className="mt-0.5 rounded text-brand-maroon focus:ring-brand-maroon/30 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Show in Homepage Hero Carousel
                  </span>
                  <span className="text-[11px] text-stone-500 block leading-tight">
                    When active, this vehicle appears in the automatic scrolling showcase on the homepage.
                  </span>
                </div>
              </label>

              <div className="space-y-1 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-700">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
                <p className="text-[10px] text-stone-400">Lower numbers appear first.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Fleet Ownership & Status
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Ownership Type
                </label>
                <select
                  value={ownerType}
                  onChange={(e) => setOwnerType(e.target.value as VehicleOwnerType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="owned">Owned Fleet (Sai Shraddha)</option>
                  <option value="partner_network">Partner / Network Vehicle</option>
                </select>
                <p className="text-[11px] text-stone-400">
                  {ownerType === "owned"
                    ? "Owned vehicles are part of the core family fleet (3 Ertiga, 1 Tavera)."
                    : "Partner vehicles are arranged from trusted local network for peak/special trips."}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="available">Available for Trip Assignment</option>
                  <option value="assigned">Currently Assigned</option>
                  <option value="on_trip">On Trip</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="inactive">Inactive / Decommissioned</option>
                </select>
              </div>

              {!isNew && (
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-800">Active in Fleet</p>
                    <p className="text-[11px] text-stone-400">
                      Inactive vehicles are hidden from assignment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    disabled={isPending}
                    className="text-stone-600 hover:text-brand-charcoal-900 transition-colors"
                  >
                    {isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-stone-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isPending}
                className="w-full font-bold flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isNew ? "Create Vehicle" : "Save Changes"}</span>
                  </>
                )}
              </Button>

              <Link
                href="/admin/vehicles"
                className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-brand-charcoal-900 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
