export interface MarketplaceItem {
  id?: string;             // Firestore document ID (string)
  salesChannel: string;    // Primary column, unique & mandatory
  marketplaceId: string;   // Auto-generated code (e.g., MKT-1001), unique & mandatory
  notes: string;           // Text area notes
  createdAt?: string;      // ISO string date or formatted string
}
