import { supabase, getAuthHeader } from './supabase';

// ============================================================
// TYPES
// ============================================================

export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  subcategory?: string;
  color: string;
  brand?: string;
  image_url: string;
  thumbnail_url?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  occasion?: string;
  items: WardrobeItem[];
  item_ids: string[];
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TryOnJob {
  id: string;
  user_id: string;
  person_media_id: string;
  garment_media_id: string;
  category: 'upper_body' | 'lower_body' | 'full_body' | 'dress';
  quality: 'standard' | 'hd';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error_message?: string;
  credits_used: number;
  created_at: string;
  completed_at?: string;
}

export interface VideoJob {
  id: string;
  user_id: string;
  video_url: string;
  garment_url: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error_message?: string;
  progress: number;
  created_at: string;
  completed_at?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  retailer: string;
  price: number;
  original_price?: number;
  currency: string;
  category: string;
  subcategory?: string;
  image_url: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  review_count: number;
  url: string;
  in_stock: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  added_at: string;
}

export interface UserMedia {
  id: string;
  user_id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  credits_remaining: number;
  credits_total: number;
  renews_at?: string;
  created_at: string;
}

export interface CreditBalance {
  available: number;
  total: number;
  used: number;
  plan: string;
  next_refresh?: string;
}

export interface StylistMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  retailer?: string;
  min_price?: number;
  max_price?: number;
  color?: string;
  size?: string;
  sort_by?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ============================================================
// CUSTOM ERROR CLASS
// ============================================================

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'UNKNOWN_ERROR',
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static fromResponse(status: number, body: Record<string, unknown>): ApiError {
    return new ApiError(
      (body.message as string) || 'An unexpected error occurred',
      status,
      (body.code as string) || 'API_ERROR',
      body.details
    );
  }

  static unauthorized(message: string = 'Not authenticated'): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static badRequest(message: string = 'Invalid request'): ApiError {
    return new ApiError(message, 400, 'BAD_REQUEST');
  }

  static insufficientCredits(): ApiError {
    return new ApiError('Insufficient credits', 402, 'INSUFFICIENT_CREDITS');
  }
}

// ============================================================
// API SERVICE
// ============================================================

// Replace with your actual backend API base URL
const API_BASE_URL = 'https://api.yuri.ai/v1';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // ---- Internal request helper ----

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authHeader = await getAuthHeader();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw ApiError.fromResponse(response.status, body);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err instanceof Error ? err.message : 'Network request failed',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // ---- Media Upload ----

  async uploadMedia(
    uri: string,
    type: 'photo' | 'video' = 'photo'
  ): Promise<UserMedia> {
    // MOCK: In production, this uploads to Supabase Storage or S3
    console.log('[API] uploadMedia called with:', { uri, type });

    return {
      id: `media_${Date.now()}`,
      user_id: 'mock-user-id',
      type,
      url: uri,
      thumbnail_url: uri,
      created_at: new Date().toISOString(),
    };
  }

  // ---- Wardrobe ----

  async getWardrobe(): Promise<WardrobeItem[]> {
    // MOCK: Returns sample wardrobe items
    console.log('[API] getWardrobe called');
    return MOCK_WARDROBE_ITEMS;
  }

  async addWardrobeItem(item: {
    name: string;
    category: string;
    color: string;
    brand?: string;
    image_url: string;
    tags?: string[];
  }): Promise<WardrobeItem> {
    console.log('[API] addWardrobeItem called with:', item);

    return {
      id: `item_${Date.now()}`,
      user_id: 'mock-user-id',
      name: item.name,
      category: item.category,
      color: item.color,
      brand: item.brand,
      image_url: item.image_url,
      tags: item.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async deleteWardrobeItem(id: string): Promise<void> {
    console.log('[API] deleteWardrobeItem called with id:', id);
    // MOCK: No-op
  }

  // ---- Outfits ----

  async createOutfit(params: {
    name: string;
    item_ids: string[];
    occasion?: string;
  }): Promise<Outfit> {
    console.log('[API] createOutfit called with:', params);

    return {
      id: `outfit_${Date.now()}`,
      user_id: 'mock-user-id',
      name: params.name,
      occasion: params.occasion,
      items: [],
      item_ids: params.item_ids,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // ---- Try-On ----

  async startTryOnJob(params: {
    person_media_id: string;
    garment_media_id: string;
    category: TryOnJob['category'];
    quality: TryOnJob['quality'];
  }): Promise<TryOnJob> {
    console.log('[API] startTryOnJob called with:', params);

    return {
      id: `tryon_${Date.now()}`,
      user_id: 'mock-user-id',
      person_media_id: params.person_media_id,
      garment_media_id: params.garment_media_id,
      category: params.category,
      quality: params.quality,
      status: 'queued',
      credits_used: params.quality === 'hd' ? 3 : 1,
      created_at: new Date().toISOString(),
    };
  }

  async getTryOnJob(jobId: string): Promise<TryOnJob> {
    console.log('[API] getTryOnJob called with id:', jobId);

    // MOCK: Simulate job progressing
    return {
      id: jobId,
      user_id: 'mock-user-id',
      person_media_id: 'mock-person',
      garment_media_id: 'mock-garment',
      category: 'upper_body',
      quality: 'standard',
      status: 'completed',
      result_url: 'https://placehold.co/512x768/1A1B23/C8B4FF?text=Try-On+Result',
      credits_used: 1,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };
  }

  async getTryOnHistory(): Promise<TryOnJob[]> {
    console.log('[API] getTryOnHistory called');

    return [
      {
        id: 'tryon_hist_1',
        user_id: 'mock-user-id',
        person_media_id: 'person_1',
        garment_media_id: 'garment_1',
        category: 'upper_body',
        quality: 'hd',
        status: 'completed',
        result_url: 'https://placehold.co/512x768/1A1B23/C8B4FF?text=Try-On+1',
        credits_used: 3,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86300000).toISOString(),
      },
      {
        id: 'tryon_hist_2',
        user_id: 'mock-user-id',
        person_media_id: 'person_2',
        garment_media_id: 'garment_2',
        category: 'full_body',
        quality: 'standard',
        status: 'completed',
        result_url: 'https://placehold.co/512x768/1A1B23/A4C9B2?text=Try-On+2',
        credits_used: 1,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        completed_at: new Date(Date.now() - 172700000).toISOString(),
      },
      {
        id: 'tryon_hist_3',
        user_id: 'mock-user-id',
        person_media_id: 'person_3',
        garment_media_id: 'garment_3',
        category: 'lower_body',
        quality: 'standard',
        status: 'failed',
        error_message: 'Garment detection failed. Please use a clearer image.',
        credits_used: 0,
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
  }

  // ---- Video Try-On ----

  async startVideoJob(params: {
    video_url: string;
    garment_url: string;
  }): Promise<VideoJob> {
    console.log('[API] startVideoJob called with:', params);

    return {
      id: `video_${Date.now()}`,
      user_id: 'mock-user-id',
      video_url: params.video_url,
      garment_url: params.garment_url,
      status: 'queued',
      progress: 0,
      created_at: new Date().toISOString(),
    };
  }

  // ---- AI Stylist ----

  async sendStylistMessage(params: {
    messages: StylistMessage[];
    context?: {
      wardrobe_items?: string[];
      occasion?: string;
      budget?: number;
    };
  }): Promise<StylistMessage> {
    console.log('[API] sendStylistMessage called');

    // MOCK: Simulated AI response
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lastMessage = params.messages[params.messages.length - 1];
    const responseContent = generateMockStylistResponse(lastMessage?.content || '');

    return {
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Product Search / Shopping ----

  async searchProducts(
    query: string,
    filters: SearchFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    console.log('[API] searchProducts called with:', { query, filters });

    let filtered = [...MOCK_PRODUCTS];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }
    if (filters.retailer) {
      filtered = filtered.filter((p) => p.retailer === filters.retailer);
    }
    if (filters.min_price !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.max_price!);
    }

    if (filters.sort_by === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort_by === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort_by === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      page_size: 20,
      has_more: false,
    };
  }

  async getProduct(id: string): Promise<Product | null> {
    console.log('[API] getProduct called with id:', id);
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }

  // ---- Wishlist ----

  async addToWishlist(productId: string): Promise<WishlistItem> {
    console.log('[API] addToWishlist called with productId:', productId);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);

    return {
      id: `wish_${Date.now()}`,
      user_id: 'mock-user-id',
      product_id: productId,
      product: product || MOCK_PRODUCTS[0],
      added_at: new Date().toISOString(),
    };
  }

  async getWishlist(): Promise<WishlistItem[]> {
    console.log('[API] getWishlist called');
    return MOCK_PRODUCTS.slice(0, 3).map((product, index) => ({
      id: `wish_${index + 1}`,
      user_id: 'mock-user-id',
      product_id: product.id,
      product,
      added_at: new Date(Date.now() - index * 86400000).toISOString(),
    }));
  }

  async removeFromWishlist(itemId: string): Promise<void> {
    console.log('[API] removeFromWishlist called with id:', itemId);
    // MOCK: No-op
  }

  // ---- Subscription / Credits ----

  async getSubscription(): Promise<Subscription> {
    console.log('[API] getSubscription called');

    return {
      id: 'sub_mock_1',
      user_id: 'mock-user-id',
      plan: 'pro',
      status: 'active',
      credits_remaining: 42,
      credits_total: 100,
      renews_at: new Date(Date.now() + 15 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    };
  }

  async getCreditBalance(): Promise<CreditBalance> {
    console.log('[API] getCreditBalance called');

    return {
      available: 42,
      total: 100,
      used: 58,
      plan: 'pro',
      next_refresh: new Date(Date.now() + 15 * 86400000).toISOString(),
    };
  }
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'w1',
    user_id: 'mock-user-id',
    name: 'Classic White Oxford Shirt',
    category: 'tops',
    subcategory: 'shirts',
    color: 'White',
    brand: 'Allen Solly',
    image_url: 'https://placehold.co/400x500/F3F0EA/111318?text=Oxford+Shirt',
    tags: ['formal', 'office', 'classic'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w2',
    user_id: 'mock-user-id',
    name: 'Slim Fit Navy Blazer',
    category: 'tops',
    subcategory: 'blazers',
    color: 'Navy',
    brand: 'Van Heusen',
    image_url: 'https://placehold.co/400x500/1A1B4B/F3F0EA?text=Navy+Blazer',
    tags: ['formal', 'office', 'evening'],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'w3',
    user_id: 'mock-user-id',
    name: 'Black Skinny Jeans',
    category: 'bottoms',
    subcategory: 'jeans',
    color: 'Black',
    brand: 'Levi\'s',
    image_url: 'https://placehold.co/400x500/111318/F3F0EA?text=Black+Jeans',
    tags: ['casual', 'versatile', 'everyday'],
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'w4',
    user_id: 'mock-user-id',
    name: 'Olive Cargo Trousers',
    category: 'bottoms',
    subcategory: 'trousers',
    color: 'Olive',
    brand: 'Roadster',
    image_url: 'https://placehold.co/400x500/4A5C3B/F3F0EA?text=Cargo+Trousers',
    tags: ['casual', 'streetwear', 'utility'],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'w5',
    user_id: 'mock-user-id',
    name: 'Lavender Midi Dress',
    category: 'dresses',
    subcategory: 'midi',
    color: 'Lavender',
    brand: 'H&M',
    image_url: 'https://placehold.co/400x500/C8B4FF/111318?text=Midi+Dress',
    tags: ['date-night', 'elegant', 'summer'],
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
  },
  {
    id: 'w6',
    user_id: 'mock-user-id',
    name: 'Oversized Graphic Tee',
    category: 'tops',
    subcategory: 't-shirts',
    color: 'Charcoal',
    brand: 'HRX',
    image_url: 'https://placehold.co/400x500/333333/F3F0EA?text=Graphic+Tee',
    tags: ['casual', 'streetwear', 'weekend'],
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'w7',
    user_id: 'mock-user-id',
    name: 'White Leather Sneakers',
    category: 'footwear',
    subcategory: 'sneakers',
    color: 'White',
    brand: 'Nike',
    image_url: 'https://placehold.co/400x500/F0F0F0/111318?text=White+Sneakers',
    tags: ['casual', 'versatile', 'everyday'],
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'w8',
    user_id: 'mock-user-id',
    name: 'Gold Chain Necklace',
    category: 'accessories',
    subcategory: 'jewelry',
    color: 'Gold',
    brand: 'Tanishq',
    image_url: 'https://placehold.co/400x500/D4A556/111318?text=Gold+Necklace',
    tags: ['jewelry', 'elegant', 'statement'],
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: 'w9',
    user_id: 'mock-user-id',
    name: 'Sage Green Kurta',
    category: 'tops',
    subcategory: 'ethnic',
    color: 'Sage',
    brand: 'FabIndia',
    image_url: 'https://placehold.co/400x500/A4C9B2/111318?text=Sage+Kurta',
    tags: ['ethnic', 'festive', 'casual'],
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-04-01T10:00:00Z',
  },
  {
    id: 'w10',
    user_id: 'mock-user-id',
    name: 'Brown Chelsea Boots',
    category: 'footwear',
    subcategory: 'boots',
    color: 'Brown',
    brand: 'Clarks',
    image_url: 'https://placehold.co/400x500/6B4226/F3F0EA?text=Chelsea+Boots',
    tags: ['smart-casual', 'winter', 'versatile'],
    created_at: '2024-04-10T10:00:00Z',
    updated_at: '2024-04-10T10:00:00Z',
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Slim Fit Casual Shirt',
    brand: 'Allen Solly',
    retailer: 'Myntra',
    price: 1299,
    original_price: 1999,
    currency: 'INR',
    category: 'tops',
    subcategory: 'shirts',
    image_url: 'https://placehold.co/400x500/4A90D9/FFFFFF?text=Allen+Solly',
    images: [],
    description: 'A classic slim fit casual shirt in soft cotton fabric. Perfect for office and weekend outings.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'White', 'Pink'],
    rating: 4.3,
    review_count: 1256,
    url: 'https://www.myntra.com/allen-solly-shirt',
    in_stock: true,
  },
  {
    id: 'prod_2',
    name: 'Ultra Slim Fit Formal Trousers',
    brand: 'Van Heusen',
    retailer: 'AJIO',
    price: 1799,
    original_price: 2499,
    currency: 'INR',
    category: 'bottoms',
    subcategory: 'trousers',
    image_url: 'https://placehold.co/400x500/2C3E50/FFFFFF?text=Van+Heusen',
    images: [],
    description: 'Premium ultra slim fit formal trousers with a comfortable stretch fabric.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Navy', 'Charcoal', 'Black'],
    rating: 4.1,
    review_count: 845,
    url: 'https://www.ajio.com/van-heusen-trousers',
    in_stock: true,
  },
  {
    id: 'prod_3',
    name: 'Ribbed Crop Top',
    brand: 'H&M',
    retailer: 'H&M',
    price: 799,
    original_price: 999,
    currency: 'INR',
    category: 'tops',
    subcategory: 't-shirts',
    image_url: 'https://placehold.co/400x500/E91E63/FFFFFF?text=H%26M+Crop',
    images: [],
    description: 'Trendy ribbed crop top in a body-hugging fit. Made from soft organic cotton.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'White', 'Dusty Rose'],
    rating: 4.5,
    review_count: 2130,
    url: 'https://www.hm.com/crop-top',
    in_stock: true,
  },
  {
    id: 'prod_4',
    name: 'Oversized Graphic Print T-Shirt',
    brand: 'Roadster',
    retailer: 'Myntra',
    price: 599,
    original_price: 899,
    currency: 'INR',
    category: 'tops',
    subcategory: 't-shirts',
    image_url: 'https://placehold.co/400x500/333333/FFFFFF?text=Roadster+Tee',
    images: [],
    description: 'Oversized graphic print t-shirt with drop shoulders. Urban streetwear essential.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey Melange', 'Olive'],
    rating: 4.2,
    review_count: 3421,
    url: 'https://www.myntra.com/roadster-tee',
    in_stock: true,
  },
  {
    id: 'prod_5',
    name: 'High Waist Wide Leg Jeans',
    brand: 'Zara',
    retailer: 'Myntra',
    price: 2999,
    original_price: 3990,
    currency: 'INR',
    category: 'bottoms',
    subcategory: 'jeans',
    image_url: 'https://placehold.co/400x500/6B8CC2/FFFFFF?text=Zara+Jeans',
    images: [],
    description: 'High waist wide leg jeans in premium denim. Relaxed 90s-inspired silhouette.',
    sizes: ['24', '26', '28', '30', '32'],
    colors: ['Light Blue', 'Indigo'],
    rating: 4.4,
    review_count: 678,
    url: 'https://www.myntra.com/zara-jeans',
    in_stock: true,
  },
  {
    id: 'prod_6',
    name: 'Active Sport Joggers',
    brand: 'HRX',
    retailer: 'Myntra',
    price: 1099,
    original_price: 1599,
    currency: 'INR',
    category: 'bottoms',
    subcategory: 'joggers',
    image_url: 'https://placehold.co/400x500/1B5E20/FFFFFF?text=HRX+Joggers',
    images: [],
    description: 'Lightweight active sport joggers with moisture-wicking technology. Ideal for gym and casual wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Grey'],
    rating: 4.3,
    review_count: 5678,
    url: 'https://www.myntra.com/hrx-joggers',
    in_stock: true,
  },
  {
    id: 'prod_7',
    name: 'Floral Wrap Midi Dress',
    brand: 'Zara',
    retailer: 'AJIO',
    price: 3499,
    original_price: 4999,
    currency: 'INR',
    category: 'dresses',
    subcategory: 'midi',
    image_url: 'https://placehold.co/400x500/B388FF/111318?text=Zara+Dress',
    images: [],
    description: 'Elegant floral wrap midi dress. Perfect for brunch dates and summer evenings.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Blue', 'Floral Pink'],
    rating: 4.6,
    review_count: 432,
    url: 'https://www.ajio.com/zara-dress',
    in_stock: true,
  },
  {
    id: 'prod_8',
    name: 'Classic Leather Belt',
    brand: 'Allen Solly',
    retailer: 'Amazon',
    price: 899,
    original_price: 1299,
    currency: 'INR',
    category: 'accessories',
    subcategory: 'belts',
    image_url: 'https://placehold.co/400x500/5D4037/F3F0EA?text=Leather+Belt',
    images: [],
    description: 'Genuine leather belt with a polished buckle. A wardrobe essential for every man.',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Brown', 'Black'],
    rating: 4.0,
    review_count: 2200,
    url: 'https://www.amazon.in/allen-solly-belt',
    in_stock: true,
  },
  {
    id: 'prod_9',
    name: 'Retro Runner Sneakers',
    brand: 'HRX',
    retailer: 'Myntra',
    price: 1999,
    original_price: 2799,
    currency: 'INR',
    category: 'footwear',
    subcategory: 'sneakers',
    image_url: 'https://placehold.co/400x500/E0E0E0/111318?text=HRX+Sneakers',
    images: [],
    description: 'Retro-inspired runner sneakers with lightweight cushioning. Effortless street style.',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White/Blue', 'White/Red', 'All Black'],
    rating: 4.4,
    review_count: 3890,
    url: 'https://www.myntra.com/hrx-sneakers',
    in_stock: true,
  },
  {
    id: 'prod_10',
    name: 'Printed Ethnic Kurta Set',
    brand: 'FabIndia',
    retailer: 'AJIO',
    price: 2499,
    original_price: 3299,
    currency: 'INR',
    category: 'tops',
    subcategory: 'ethnic',
    image_url: 'https://placehold.co/400x500/A4C9B2/111318?text=FabIndia+Kurta',
    images: [],
    description: 'Hand-block printed ethnic kurta set in natural fabrics. Festive wear with artisanal charm.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage Green', 'Indigo', 'Maroon'],
    rating: 4.5,
    review_count: 1120,
    url: 'https://www.ajio.com/fabindia-kurta',
    in_stock: true,
  },
  {
    id: 'prod_11',
    name: 'Structured Tote Bag',
    brand: 'H&M',
    retailer: 'H&M',
    price: 1499,
    original_price: 1999,
    currency: 'INR',
    category: 'accessories',
    subcategory: 'bags',
    image_url: 'https://placehold.co/400x500/8D6E63/FFFFFF?text=H%26M+Tote',
    images: [],
    description: 'Structured faux leather tote bag with interior organizer pockets. Work-to-weekend versatility.',
    sizes: ['One Size'],
    colors: ['Tan', 'Black', 'Cream'],
    rating: 4.2,
    review_count: 567,
    url: 'https://www.hm.com/tote-bag',
    in_stock: true,
  },
  {
    id: 'prod_12',
    name: 'Relaxed Fit Linen Shirt',
    brand: 'Roadster',
    retailer: 'Amazon',
    price: 1199,
    original_price: 1799,
    currency: 'INR',
    category: 'tops',
    subcategory: 'shirts',
    image_url: 'https://placehold.co/400x500/F3F0EA/111318?text=Linen+Shirt',
    images: [],
    description: 'Breathable relaxed fit linen shirt. The ultimate summer wardrobe staple.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Sky Blue', 'Beige'],
    rating: 4.1,
    review_count: 2340,
    url: 'https://www.amazon.in/roadster-linen',
    in_stock: true,
  },
  {
    id: 'prod_13',
    name: 'Chelsea Ankle Boots',
    brand: 'Van Heusen',
    retailer: 'Myntra',
    price: 3999,
    original_price: 4999,
    currency: 'INR',
    category: 'footwear',
    subcategory: 'boots',
    image_url: 'https://placehold.co/400x500/3E2723/F3F0EA?text=Chelsea+Boots',
    images: [],
    description: 'Premium leather Chelsea ankle boots. Sleek profile for smart-casual and formal occasions.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Tan', 'Black'],
    rating: 4.3,
    review_count: 456,
    url: 'https://www.myntra.com/van-heusen-boots',
    in_stock: true,
  },
];

function generateMockStylistResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('office') || lowerMessage.includes('work') || lowerMessage.includes('formal')) {
    return "For a polished office look, I'd recommend pairing your **Classic White Oxford Shirt** with the **Van Heusen Ultra Slim Fit Trousers** in Navy. Complete the look with your **Brown Chelsea Boots** for a touch of sophistication. 💼\n\nIf you want to add a layer, your **Slim Fit Navy Blazer** would elevate this instantly. Would you like me to create a virtual try-on with this combination?";
  }

  if (lowerMessage.includes('date') || lowerMessage.includes('evening') || lowerMessage.includes('dinner')) {
    return "For a date night, the **Lavender Midi Dress** is a stunning choice — it flatters beautifully and the colour is very on-trend. ✨\n\nPair it with the **Gold Chain Necklace** for subtle elegance and your **White Leather Sneakers** for a modern, relaxed vibe — or swap to heels for a dressier feel.\n\nShall I set up a try-on to visualise this?";
  }

  if (lowerMessage.includes('casual') || lowerMessage.includes('weekend')) {
    return "Weekend casual? Here's my pick: 🌿\n\n1. **Oversized Graphic Tee** (charcoal) — effortlessly cool\n2. **Olive Cargo Trousers** — utility meets style\n3. **White Leather Sneakers** — clean finish\n\nThis gives you that relaxed streetwear aesthetic. You could also throw on a crossbody bag for a complete look. Want to try it on virtually?";
  }

  if (lowerMessage.includes('festive') || lowerMessage.includes('traditional') || lowerMessage.includes('ethnic')) {
    return "For a festive occasion, your **Sage Green Kurta** is perfect! 🪷\n\nI'd suggest pairing it with the **FabIndia Printed Ethnic Kurta Set** pants if you want to go full ethnic, or style it with **Black Skinny Jeans** for a fusion look.\n\nThe **Gold Chain Necklace** adds a gorgeous finishing touch. Would you like to see how this looks together?";
  }

  return "Great question! Based on your wardrobe, I see some wonderful possibilities. 🎨\n\nYou have a versatile collection spanning casual streetwear to elegant evening options. Here are three outfit ideas I'd recommend:\n\n1. **Smart Casual**: White Oxford + Black Skinny Jeans + Chelsea Boots\n2. **Weekend Chic**: Graphic Tee + Cargo Trousers + White Sneakers\n3. **Elevated Evening**: Lavender Midi Dress + Gold Necklace\n\nWhich style direction interests you? I can also help you find new pieces to fill any gaps in your wardrobe!";
}

// ============================================================
// EXPORT SINGLETON
// ============================================================

export const api = new ApiService();
export default api;
