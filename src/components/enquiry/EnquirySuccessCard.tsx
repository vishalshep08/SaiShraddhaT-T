import React from "react";
import { CheckCircle2, MessageSquare, Phone, MapPin, Calendar, Users, Car, RotateCcw } from "lucide-react";
import { EnquirySubmissionResult } from "@/types/enquiry";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EnquirySuccessCardProps {
  result: EnquirySubmissionResult;
  onReset?: () => void;
}

export function EnquirySuccessCard({ result, onReset }: EnquirySuccessCardProps) {
  const ramesh = BUSINESS_CONFIG.contacts[0];
  const data = result.submittedData;

  const whatsappMessage = `Hello ${BUSINESS_CONFIG.name}, I just submitted an enquiry on your website. My enquiry reference is ${result.referenceNumber}. Please share vehicle availability and quotation.`;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200/80 shadow-md space-y-6 text-center max-w-xl mx-auto">
      {/* Success Icon & Header */}
      <div className="space-y-2">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <Badge variant="green" size="md" className="font-bold">
          Enquiry Received
        </Badge>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Thank You, {data?.customerName || "Devotee"}!
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
          Your travel details have been received securely. Ramesh Shep (Owner) from our Shirdi office will contact you shortly to confirm vehicle availability and discuss fares.
        </p>
      </div>

      {/* Reference Box */}
      <div className="bg-brand-ivory-100/90 p-4 rounded-xl border border-brand-ivory-300 space-y-1">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          Your Enquiry Reference Number
        </span>
        <div className="text-xl sm:text-2xl font-mono font-extrabold text-brand-maroon tracking-wider">
          {result.referenceNumber}
        </div>
        <p className="text-[11px] text-stone-500">
          Please mention this reference code when speaking with our team.
        </p>
      </div>

      {/* Journey Summary */}
      {data && (
        <div className="text-left bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
          <div className="font-bold text-brand-charcoal-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
            <span>Enquiry Summary</span>
            <span className="capitalize font-semibold text-brand-maroon">
              {data.requestIntent.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span className="truncate">
                <strong>Route:</strong> {data.pickupLocation} → {data.destination}
              </span>
            </div>

            {data.travelDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                <span>
                  <strong>Date:</strong> {data.travelDate}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span>
                <strong>Passengers:</strong> {data.passengerCount}
              </span>
            </div>

            {data.vehiclePreference && (
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                <span className="truncate">
                  <strong>Vehicle:</strong> {data.vehiclePreference}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Immediate CTAs */}
      <div className="space-y-3 pt-2">
        <a
          href={buildWhatsAppLink({
            customMessage: whatsappMessage,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="lg"
            variant="primary"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            leftIcon={<MessageSquare className="w-5 h-5 text-emerald-200" />}
          >
            Continue on WhatsApp Now
          </Button>
        </a>

        <div>
          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline" className="w-full text-xs" leftIcon={<Phone className="w-3.5 h-3.5 text-brand-maroon" />}>
              Call Ramesh Shep (Owner): {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>

      {onReset && (
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-stone-500 hover:text-brand-maroon flex items-center justify-center gap-1 mx-auto font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Submit Another Enquiry
          </button>
        </div>
      )}
    </div>
  );
}
