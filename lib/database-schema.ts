// Database Schema Design for Real Estate App
// Google Sheets Structure

export interface DatabaseSchema {
  // Sheet 1: Properties
  Properties: {
    id: string
    title: string
    description: string
    price: number
    currency: string
    property_type: string // apartment, house, villa, etc.
    bedrooms: number
    bathrooms: number
    area: number
    address: string
    district: string
    city: string
    latitude: number
    longitude: number
    direction: string // north, south, east, west
    legal_status: string // red_book, pink_book, etc.
    images: string // JSON array of image URLs
    features: string // JSON array of features
    status: string // available, sold, rented
    created_at: string
    updated_at: string
    owner_id: string
    agent_id: string
    views: number
    is_featured: boolean
    is_urgent: boolean
  }

  // Sheet 2: Users
  Users: {
    id: string
    email: string
    full_name: string
    phone: string
    avatar_url: string
    user_type: string // buyer, seller, agent, admin
    is_vip: boolean
    vip_expires_at: string
    created_at: string
    updated_at: string
    last_login: string
    is_active: boolean
  }

  // Sheet 3: Favorites
  Favorites: {
    id: string
    user_id: string
    property_id: string
    created_at: string
  }

  // Sheet 4: Saved_Filters
  Saved_Filters: {
    id: string
    user_id: string
    name: string
    filters: string // JSON object of filter criteria
    created_at: string
    updated_at: string
  }

  // Sheet 5: Consultations
  Consultations: {
    id: string
    user_id: string
    property_id: string
    consultant_id: string
    full_name: string
    phone: string
    email: string
    message: string
    preferred_time: string
    status: string // pending, contacted, completed, cancelled
    created_at: string
    updated_at: string
  }

  // Sheet 6: News
  News: {
    id: string
    title: string
    content: string
    excerpt: string
    featured_image: string
    category: string
    tags: string // JSON array
    author_id: string
    status: string // draft, published, archived
    published_at: string
    created_at: string
    updated_at: string
    views: number
  }

  // Sheet 7: Projects
  Projects: {
    id: string
    name: string
    description: string
    developer: string
    location: string
    district: string
    city: string
    total_units: number
    available_units: number
    price_from: number
    price_to: number
    images: string // JSON array
    amenities: string // JSON array
    completion_date: string
    status: string // planning, construction, completed
    created_at: string
    updated_at: string
  }

  // Sheet 8: Property_Types
  Property_Types: {
    id: string
    name: string
    icon: string
    description: string
    is_active: boolean
    sort_order: number
  }

  // Sheet 9: Comparisons
  Comparisons: {
    id: string
    user_id: string
    property_ids: string // JSON array of property IDs
    name: string
    created_at: string
    updated_at: string
  }

  // Sheet 10: Property_Views
  Property_Views: {
    id: string
    property_id: string
    user_id: string
    ip_address: string
    user_agent: string
    viewed_at: string
  }
}
