export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingStatus =
  | 'enquiry'
  | 'contacted'
  | 'quoted'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'vehicle_assigned'
  | 'driver_assigned'
  | 'driver_on_way'
  | 'passenger_picked_up'
  | 'trip_started'
  | 'trip_completed'
  | 'cancelled';

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'converted'
  | 'cancelled'
  | 'spam';

export type TripType =
  | 'one_way'
  | 'round_trip'
  | 'local_sightseeing'
  | 'custom_package';

export type VehicleOwnerType = 'owned' | 'partner_network';

export type VehicleStatus =
  | 'available'
  | 'assigned'
  | 'on_trip'
  | 'maintenance'
  | 'inactive';

export type DriverStatus =
  | 'available'
  | 'assigned'
  | 'on_trip'
  | 'inactive';

export type LeadSource =
  | 'google_search'
  | 'google_maps'
  | 'website'
  | 'whatsapp'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'referral'
  | 'existing_customer'
  | 'other';

export interface Database {
  public: {
    Tables: {
      vehicle_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          seating_capacity: string;
          min_passengers: number;
          max_passengers: number;
          luggage_capacity: string | null;
          ideal_for: string | null;
          starting_per_km: number | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vehicle_categories']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['vehicle_categories']['Insert']>;
      };
      vehicles: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          registration_number: string | null;
          seating_capacity: number;
          owner_type: VehicleOwnerType;
          status: VehicleStatus;
          fuel_type: string | null;
          ac_type: string | null;
          notes: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
      };
      drivers: {
        Row: {
          id: string;
          name: string;
          mobile_number: string;
          license_number: string | null;
          status: DriverStatus;
          assigned_vehicle_id: string | null;
          internal_rating: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          icon_name: string | null;
          featured_image_url: string | null;
          is_published: boolean;
          display_order: number;
          seo_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          origin: string;
          distance_km: number | null;
          approx_travel_time: string | null;
          starting_fare: number | null;
          short_description: string;
          long_description: string | null;
          highlights: string[] | null;
          is_popular: boolean;
          is_published: boolean;
          display_order: number;
          seo_title: string | null;
          meta_description: string | null;
          keywords: string[] | null;
          faq: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>;
      };
      packages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          duration: string;
          destinations: string[] | null;
          starting_fare: number | null;
          short_description: string;
          itinerary: Json | null;
          inclusions: string[] | null;
          exclusions: string[] | null;
          is_published: boolean;
          display_order: number;
          seo_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['packages']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          mobile: string;
          whatsapp: string | null;
          email: string | null;
          city: string | null;
          total_bookings: number;
          total_spend: number;
          lead_source: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      enquiries: {
        Row: {
          id: string;
          enquiry_code: string | null;
          customer_name: string;
          customer_mobile: string;
          customer_whatsapp: string | null;
          customer_email: string | null;
          pickup_location: string;
          drop_location: string;
          travel_date: string;
          pickup_time: string | null;
          passenger_count: number;
          trip_type: TripType;
          vehicle_category_id: string | null;
          preferred_vehicle: string | null;
          lead_source: LeadSource;
          status: EnquiryStatus;
          estimated_fare: number | null;
          quoted_fare: number | null;
          customer_notes: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['enquiries']['Row'], 'id' | 'enquiry_code' | 'created_at' | 'updated_at'> & {
          id?: string;
          enquiry_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enquiries']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string | null;
          enquiry_id: string | null;
          customer_id: string | null;
          customer_name: string;
          customer_mobile: string;
          customer_whatsapp: string | null;
          pickup_location: string;
          drop_location: string;
          travel_date: string;
          pickup_time: string | null;
          return_date: string | null;
          passenger_count: number;
          trip_type: string;
          vehicle_category_id: string | null;
          vehicle_id: string | null;
          driver_id: string | null;
          status: BookingStatus;
          quoted_fare: number | null;
          advance_amount: number | null;
          final_fare: number | null;
          payment_status: 'pending' | 'partial' | 'paid';
          lead_source: string | null;
          customer_notes: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'booking_code' | 'created_at' | 'updated_at'> & {
          id?: string;
          booking_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          customer_name: string;
          customer_city: string | null;
          rating: number;
          route_or_service: string;
          review_text: string;
          travel_date: string | null;
          is_verified: boolean;
          is_featured: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      business_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['business_settings']['Row'], 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['business_settings']['Insert']>;
      };
    };
  };
}
