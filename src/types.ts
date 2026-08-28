export type TabType = 'discover' | 'search' | 'sell' | 'vault';

export type UserRole = 'super_admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  memberSince: string;
  bio?: string;
  totalListings?: number;
  watchedWatchIds?: string[];
  sellerRating?: number; // 0 - 5 star rating from previous buyers
  sellerReviewCount?: number; // total count of buyer reviews
}

export interface SiteContent {
  announcementBar: {
    enabled: boolean;
    text: string;
    badge: string;
  };
  discoverPage: {
    heroTitle: string;
    heroSubtitle: string;
    heroEyebrow: string;
    spotlightTitle: string;
  };
  searchPage: {
    title: string;
    subtitle: string;
  };
  sellPage: {
    title: string;
    subtitle: string;
    guaranteeText: string;
  };
  vaultPage: {
    title: string;
    subtitle: string;
    vaultNote: string;
  };
}

export interface OpticalInspectionDetails {
  dialAndTypography: string;
  logoAndMarkings: string;
  handsAndLume: string;
  bezelAndCaseFinishing: string;
  cyclopsAndDateWheel?: string;
  videoMotion?: string;
}

export interface AiAuthenticityReport {
  id: string;
  watchId?: string;
  scannedAt: string;
  status: 'authentic' | 'suspicious' | 'counterfeit_flagged';
  riskScore: number; // 0 (genuine) to 100 (counterfeit / fake)
  confidence: number; // 0 to 100%
  summary: string;
  findings: string[];
  flaggedReasons: string[];
  opticalInspection: OpticalInspectionDetails;
  flaggedToAdmin: boolean;
  reviewedByAdmin?: boolean;
  adminAction?: 'approved' | 'counterfeit_banned' | 'pending_review' | 'proof_requested';
  adminNotes?: string;
}

export interface Watch {
  id: string;
  brand: string;
  model: string;
  reference: string;
  year: number | string;
  price: number;
  category: 'vintage' | 'modern' | 'diver' | 'dress';
  badge?: string;
  imageUrl: string;
  secondaryImages?: string[];
  description: string;
  caseDiameter: string;
  caseMaterial: string;
  dialColor: string;
  movement: string;
  powerReserve?: string;
  waterResistance?: string;
  condition: 'Mint / Unworn' | 'Exceptional Condition' | 'Very Good' | 'Good (with scratches and signs of wear)' | 'Vintage Patina' | 'Needs Service / Project' | 'Parts Only' | string;
  boxAndPapers: 'Complete Set' | 'Watch & Box' | 'Watch Only';
  consignedBy?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerLocation?: string;
  sellerRating?: number; // 0-5 star rating from previous buyers
  sellerReviewCount?: number; // Total number of reviews/ratings received from previous buyers
  priceType?: 'firm' | 'obo';
  videoUrl?: string;
  featured?: boolean;
  aiAuthenticityReport?: AiAuthenticityReport;
  isFlaggedFake?: boolean;
  isSold?: boolean;
  soldPrice?: number;
  soldToBuyer?: string;
  viewCount?: number;
}

export interface DirectMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

export interface WatchInquiry {
  id: string;
  watch: Watch;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  offerAmount?: number;
  initialMessage: string;
  createdAt: string;
  status: 'active' | 'accepted' | 'declined';
  messages: DirectMessage[];
  sellerContactRevealed?: boolean;
}

export interface FormalOffer {
  id: string;
  watch: Watch;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  offerAmount: number;
  note?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  sellerContactRevealed: boolean;
  sellerDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
    preferredPayment: string[];
  };
  counterPrice?: number;
  sellerComment?: string;
  counteredAt?: string;
}

export interface ConsignmentForm {
  brand: string;
  model: string;
  reference: string;
  year: string;
  condition: string;
  boxAndPapers: string;
  shippingMethod: 'free' | 'buyer';
  shippingRate: number;
  uploadedImages: string[];
  askingPrice?: number;
  priceType?: 'firm' | 'obo';
  includeVideo?: boolean;
  videoUrl?: string;
  expectedPayout?: number;
  authenticityDeclaration?: 'guaranteed_authentic' | 'mod_unauthenticated';
  notes?: string;
  aiScanResult?: AiAuthenticityReport;
}

export interface ValuationResult {
  estimatedLow: number;
  estimatedHigh: number;
  recommendedListing: number;
  serviceFeePercent?: number;
  netEstimatedPayout: number;
  marketDemand: 'Very High' | 'High' | 'Moderate';
  historicalAppreciation: string;
  referenceNotes: string;
  aiAuthenticity?: AiAuthenticityReport;
}

export interface CartItem {
  watch: Watch;
  addedAt: string;
}

export interface VaultItem {
  id: string;
  watch: Watch;
  acquisitionDate: string;
  serialNumber: string;
  digitalCertificateId: string;
  status: 'In Vault' | 'Consigned' | 'Under Valuation' | 'Shipped' | 'Sold / In Vault';
  purchasePrice?: number;
  currentEstimatedValue: number;
  soldDetails?: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone?: string;
    soldPrice: number;
    acceptedAt: string;
  };
}
