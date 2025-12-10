// User & Authentication Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email_verified: boolean;
  status: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: string;
    };
  };
  message?: string;
}

// Property Listing Types
export interface PropertyListing {
  id: number;
  app_id: number;
  user_id: number;
  title: string;
  description: string;
  property_type: PropertyType;
  address_line1?: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests_max: number;
  square_feet?: number;
  price_per_night: string;
  currency: string;
  cleaning_fee?: string;
  service_fee_percentage?: number;
  min_nights: number;
  max_nights: number;
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy: CancellationPolicy;
  house_rules?: string;
  additional_info?: string;
  instant_book: boolean;
  status: ListingStatus;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  host_first_name?: string;
  host_last_name?: string;
  host_email?: string;
  primary_image?: string;
  image_count?: number;
  amenities?: string;
  // Related arrays
  images?: PropertyImage[];
  videos?: PropertyVideo[];
}

export interface PropertyImage {
  id: number;
  listing_id: number;
  image_url: string;
  caption?: string;
  is_primary?: boolean;
  display_order?: number;
  media_type?: string;
}

export interface PropertyVideo {
  id: number;
  listing_id: number;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  duration?: number;
  display_order?: number;
}

export type PropertyType = 
  | 'house'
  | 'apartment'
  | 'condo'
  | 'villa'
  | 'cabin'
  | 'cottage'
  | 'townhouse'
  | 'loft'
  | 'other';

export type CancellationPolicy = 
  | 'flexible'
  | 'moderate'
  | 'strict'
  | 'super_strict';

export type ListingStatus = 
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'inactive'
  | 'suspended';

// Amenity Types
export interface Amenity {
  id: number;
  name: string;
  category: string;
  icon?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    listings: T[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

// Search/Filter Types
export interface ListingsFilter {
  search?: string;
  city?: string;
  country?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  guests?: number;
  status?: ListingStatus;
  user_id?: number;
  page?: number;
  per_page?: number;
}
