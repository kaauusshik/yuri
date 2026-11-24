/**
 * VIRTUWEAR AI — Global Type Definitions
 * Complete TypeScript types for the entire application
 */

// ═══════════════════════════════════════════════════════════
//  ENUMS
// ═══════════════════════════════════════════════════════════

export enum Category {
  Tops = 'tops',
  Bottoms = 'bottoms',
  Dresses = 'dresses',
  Jackets = 'jackets',
  Footwear = 'footwear',
  Accessories = 'accessories',
}

export enum Subcategory {
  // Tops
  TShirt = 't-shirt',
  Shirt = 'shirt',
  Blouse = 'blouse',
  Sweater = 'sweater',
  Hoodie = 'hoodie',
  Tank = 'tank',
  Polo = 'polo',
  Crop = 'crop-top',
  // Bottoms
  Jeans = 'jeans',
  Trousers = 'trousers',
  Shorts = 'shorts',
  Skirt = 'skirt',
  Leggings = 'leggings',
  Joggers = 'joggers',
  // Dresses
  MiniDress = 'mini-dress',
  MidiDress = 'midi-dress',
  MaxiDress = 'maxi-dress',
  Gown = 'gown',
  // Jackets
  Blazer = 'blazer',
  Coat = 'coat',
  Bomber = 'bomber',
  Denim = 'denim-jacket',
  Leather = 'leather-jacket',
  Windbreaker = 'windbreaker',
  // Footwear
  Sneakers = 'sneakers',
  Boots = 'boots',
  Heels = 'heels',
  Sandals = 'sandals',
  Loafers = 'loafers',
  Flats = 'flats',
  // Accessories
  Bag = 'bag',
  Hat = 'hat',
  Scarf = 'scarf',
  Belt = 'belt',
  Jewelry = 'jewelry',
  Watch = 'watch',
  Sunglasses = 'sunglasses',
}

export enum Occasion {
  Casual = 'casual',
  Formal = 'formal',
  Business = 'business',
  Party = 'party',
  Date = 'date',
  Wedding = 'wedding',
  Workout = 'workout',
  Beach = 'beach',
  Travel = 'travel',
  Festival = 'festival',
  Streetwear = 'streetwear',
  Brunch = 'brunch',
}

export enum ColorName {
  Black = 'black',
  White = 'white',
  Navy = 'navy',
  Grey = 'grey',
  Beige = 'beige',
  Brown = 'brown',
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  Pink = 'pink',
  Purple = 'purple',
  Orange = 'orange',
  Teal = 'teal',
  Maroon = 'maroon',
  Olive = 'olive',
  Coral = 'coral',
  Cream = 'cream',
  Multicolor = 'multicolor',
}

export enum Pattern {
  Solid = 'solid',
  Striped = 'striped',
  Plaid = 'plaid',
  Floral = 'floral',
  Polka = 'polka-dot',
  Geometric = 'geometric',
  Abstract = 'abstract',
  Camo = 'camo',
  Animal = 'animal-print',
  Tie_Dye = 'tie-dye',
  Graphic = 'graphic',
  Paisley = 'paisley',
}

export enum Material {
  Cotton = 'cotton',
  Polyester = 'polyester',
  Silk = 'silk',
  Linen = 'linen',
  Wool = 'wool',
  Denim = 'denim',
  Leather = 'leather',
  Suede = 'suede',
  Nylon = 'nylon',
  Cashmere = 'cashmere',
  Velvet = 'velvet',
  Satin = 'satin',
  Chiffon = 'chiffon',
  Rayon = 'rayon',
  Knit = 'knit',
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter',
  AllSeason = 'all-season',
}

// ═══════════════════════════════════════════════════════════
//  USER & PROFILE
// ═══════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  bodyProfile?: BodyProfile;
  styleProfile?: StyleProfile;
  subscription: Subscription;
  creditsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface BodyProfile {
  gender: 'male' | 'female' | 'non-binary';
  height?: number; // cm
  weight?: number; // kg
  bodyType?: 'slim' | 'athletic' | 'average' | 'curvy' | 'plus-size';
  skinTone?:
    | 'very-fair'
    | 'fair'
    | 'light'
    | 'medium'
    | 'olive'
    | 'tan'
    | 'brown'
    | 'dark'
    | 'deep';
  shirtSize?: string;
  pantSize?: string;
  shoeSize?: number;
  referencePhotoUrl?: string;
}

export interface StyleProfile {
  favoriteCategories: Category[];
  preferredColors: ColorName[];
  preferredOccasions: Occasion[];
  stylePersonality: string[]; // e.g. ["minimalist", "streetwear", "classic"]
  avoidPatterns: Pattern[];
  budgetRange: { min: number; max: number; currency: string };
  preferredBrands: string[];
}

// ═══════════════════════════════════════════════════════════
//  WARDROBE
// ═══════════════════════════════════════════════════════════

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: Category;
  subcategory: Subcategory;
  colour: ColorName;
  pattern: Pattern;
  material: Material;
  brand?: string;
  size?: string;
  season: Season[];
  occasions: Occasion[];
  imagePath: string;
  thumbnailPath?: string;
  isFavorite: boolean;
  wearCount: number;
  lastWornAt?: string;
  purchasedAt?: string;
  purchasePrice?: number;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════
//  OUTFITS
// ═══════════════════════════════════════════════════════════

export interface OutfitItem {
  wardrobeItemId: string;
  category: Category;
  zIndex: number; // layering order
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  items: OutfitItem[];
  occasion?: Occasion;
  season?: Season;
  coverImagePath?: string;
  isFavorite: boolean;
  isAiGenerated: boolean;
  rating?: number; // 1-5
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════
//  TRY-ON & VIDEO JOBS
// ═══════════════════════════════════════════════════════════

export type JobStatus =
  | 'queued'
  | 'validating'
  | 'processing'
  | 'completed'
  | 'failed';

export interface TryOnJob {
  id: string;
  userId: string;
  status: JobStatus;
  provider: 'fashn' | 'klingai' | 'internal';
  inputPersonPath: string;
  inputGarmentPath: string;
  outputPath?: string;
  thumbnailPath?: string;
  creditsUsed: number;
  progress: number; // 0–100
  errorMessage?: string;
  metadata?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoJob {
  id: string;
  userId: string;
  status: JobStatus;
  provider: 'klingai' | 'runway' | 'internal';
  inputImagePath: string;
  outputVideoPath?: string;
  thumbnailPath?: string;
  durationSeconds?: number;
  creditsUsed: number;
  progress: number; // 0–100
  errorMessage?: string;
  metadata?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════
//  LIVE SESSION
// ═══════════════════════════════════════════════════════════

export interface LiveSession {
  id: string;
  userId: string;
  isActive: boolean;
  garmentId?: string;
  garmentImagePath?: string;
  lastFrameAt?: string;
  framesProcessed: number;
  creditsUsed: number;
  createdAt: string;
  endedAt?: string;
}

// ═══════════════════════════════════════════════════════════
//  SHOPPING / PRODUCTS
// ═══════════════════════════════════════════════════════════

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: ColorName;
  size?: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  sku?: string;
}

export interface Retailer {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl: string;
  isPartner: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  subcategory?: Subcategory;
  brand: string;
  retailer: Retailer;
  images: ProductImage[];
  variants: ProductVariant[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  url: string;
  isTryOnEligible: boolean;
  tags: string[];
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: string;
  notifyOnSale: boolean;
  notes?: string;
}

// ═══════════════════════════════════════════════════════════
//  SUBSCRIPTION & CREDITS
// ═══════════════════════════════════════════════════════════

export type PlanTier = 'free' | 'plus' | 'pro' | 'annual_pro';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing' | 'expired';

export interface Subscription {
  id: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  creditsPerMonth: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
}

export interface CreditLedger {
  id: string;
  userId: string;
  amount: number; // positive = credit, negative = debit
  balance: number;
  type: 'subscription' | 'purchase' | 'try_on' | 'video' | 'live' | 'bonus' | 'refund';
  description: string;
  referenceId?: string; // jobId, etc.
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'job_complete'
    | 'job_failed'
    | 'credits_low'
    | 'subscription'
    | 'promo'
    | 'system'
    | 'style_tip';
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  isRead: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════
//  AI STYLIST
// ═══════════════════════════════════════════════════════════

export interface OutfitSuggestion {
  id: string;
  wardrobeItemIds: string[];
  productSuggestions?: Product[];
  occasion: Occasion;
  reasoning: string;
  coverImageUrl?: string;
  confidence: number; // 0–1
}

export interface StyleRecommendation {
  id: string;
  userId: string;
  type: 'outfit' | 'product' | 'tip' | 'trend';
  title: string;
  description: string;
  outfitSuggestion?: OutfitSuggestion;
  products?: Product[];
  imageUrl?: string;
  createdAt: string;
}

export interface StylistMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  outfitSuggestion?: OutfitSuggestion;
  imageUrl?: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════
//  NAVIGATION / UI HELPERS
// ═══════════════════════════════════════════════════════════

export interface TabRoute {
  name: string;
  title: string;
  icon: string;
  iconFocused: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}
