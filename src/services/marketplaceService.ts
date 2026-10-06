import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import type { MarketplaceItem } from "../types/marketplace";

const COLLECTION_NAME = "marketplaces";

// Initial seed data if collection is brand new / empty
const SEED_MARKETPLACES: Omit<MarketplaceItem, "id">[] = [
  {
    salesChannel: "Amazon US Store",
    marketplaceId: "MKT-80101",
    notes: "Primary North American retail channel. Automated FBA fulfillment sync enabled with 2-hour inventory refresh interval.",
    createdAt: new Date().toISOString()
  },
  {
    salesChannel: "Shopify Direct Web",
    marketplaceId: "MKT-80102",
    notes: "Official brand storefront. Integrated with Stripe payment gateway and custom order tracking webhooks.",
    createdAt: new Date().toISOString()
  },
  {
    salesChannel: "Walmart Marketplace",
    marketplaceId: "MKT-80103",
    notes: "Secondary US online marketplace. Requires specific GTIN and UPC code sync for high-volume jewelry and apparel.",
    createdAt: new Date().toISOString()
  },
  {
    salesChannel: "eBay Global Outlet",
    marketplaceId: "MKT-80104",
    notes: "International refurb & overstock auction channel with multi-currency pricing support.",
    createdAt: new Date().toISOString()
  }
];

/**
 * Generate a unique Marketplace ID with prefix MKT-
 * E.g., MKT-94821
 */
export function generateMarketplaceId(existingItems: MarketplaceItem[]): string {
  let isUnique = false;
  let code = "";
  let counter = existingItems.length + 101;
  
  while (!isUnique) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    code = `MKT-${counter}${randomSuffix.toString().slice(0, 2)}`;
    const exists = existingItems.some(item => item.marketplaceId.toLowerCase() === code.toLowerCase());
    if (!exists) {
      isUnique = true;
    } else {
      counter++;
    }
  }
  return code;
}

/**
 * Check if a Sales Channel name is unique (case-insensitive)
 */
export function isSalesChannelUnique(salesChannel: string, existingItems: MarketplaceItem[], excludeId?: string): boolean {
  const normalized = salesChannel.trim().toLowerCase();
  return !existingItems.some(item => 
    item.salesChannel.trim().toLowerCase() === normalized && item.id !== excludeId
  );
}

/**
 * Subscribe to real-time updates from Firestore 'marketplaces' collection.
 * If empty, seeds initial marketplace entries so DB is populated.
 */
export function subscribeMarketplaces(onData: (items: MarketplaceItem[]) => void, onError?: (err: Error) => void) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    
    return onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed default data if database is empty
          console.log("Marketplace collection empty. Seeding initial data...");
          try {
            for (const item of SEED_MARKETPLACES) {
              await addDoc(collection(db, COLLECTION_NAME), {
                ...item,
                createdAt: serverTimestamp()
              });
            }
          } catch (seedErr) {
            console.error("Error seeding initial marketplace data:", seedErr);
          }
          return;
        }

        const items: MarketplaceItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let createdAtStr = new Date().toISOString();
          if (data.createdAt?.toDate) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAtStr = data.createdAt;
          }

          return {
            id: docSnap.id,
            salesChannel: data.salesChannel || "",
            marketplaceId: data.marketplaceId || "",
            notes: data.notes || "",
            createdAt: createdAtStr
          };
        });

        onData(items);
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup marketplace listener:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Add a new marketplace entry to Firestore
 */
export async function addMarketplaceToDb(item: Omit<MarketplaceItem, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    salesChannel: item.salesChannel.trim(),
    marketplaceId: item.marketplaceId.trim(),
    notes: item.notes.trim(),
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Delete a marketplace entry from Firestore
 */
export async function deleteMarketplaceFromDb(id: string): Promise<void> {
  if (!id) throw new Error("Document ID is required for deletion");
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Update an existing marketplace entry in Firestore
 */
export async function updateMarketplaceInDb(id: string, item: Partial<MarketplaceItem>): Promise<void> {
  if (!id) throw new Error("Document ID is required for update");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    salesChannel: item.salesChannel?.trim(),
    marketplaceId: item.marketplaceId?.trim(),
    notes: item.notes?.trim()
  });
}
