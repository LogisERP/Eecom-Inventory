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
import type {
  BrandItem,
  UomItem,
  ProductTypeItem,
  ProductCategoryItem,
  ProductMasterItem,
  SupplierMasterItem,
  SupplierSiteItem
} from "../types/productDetails";

// Firestore Collection Names
const COLS = {
  BRANDS: "product_brands",
  UOMS: "product_uoms",
  TYPES: "product_types",
  CATEGORIES: "product_categories",
  MASTERS: "product_masters",
  SUPPLIERS: "supplier_masters",
  SITES: "supplier_sites"
};

// ----------------------------------------------------
// SEED DATA
// ----------------------------------------------------

const SEED_BRANDS: Omit<BrandItem, "id">[] = [
  {
    brandCode: "BRD-1001",
    brandName: "Nike",
    description: "Global leader in athletic footwear, activewear, and sports apparel.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    brandCode: "BRD-1002",
    brandName: "Apple",
    description: "Premium consumer electronics, mobile smart devices, and computing systems.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    brandCode: "BRD-1003",
    brandName: "Logitech",
    description: "Computer peripherals, ergonomic accessories, and audio hardware.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    brandCode: "BRD-1004",
    brandName: "Aura Luxe",
    description: "Handcrafted artisan fine jewelry, gemstones, and luxury fashion accessories.",
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_UOMS: Omit<UomItem, "id">[] = [
  {
    uomCode: "UOM-PCS",
    uomName: "Pieces",
    uomType: "Quantity",
    conversionFactor: 1,
    description: "Standard unit count per single item",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    uomCode: "UOM-KG",
    uomName: "Kilograms",
    uomType: "Weight",
    conversionFactor: 1,
    description: "Metric unit of weight for bulk shipments",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    uomCode: "UOM-LTR",
    uomName: "Liters",
    uomType: "Volume",
    conversionFactor: 1,
    description: "Metric measure of liquid volume",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    uomCode: "UOM-MTR",
    uomName: "Meters",
    uomType: "Length",
    conversionFactor: 1,
    description: "Metric unit for fabric and cable lengths",
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_TYPES: Omit<ProductTypeItem, "id">[] = [
  {
    productTypeCode: "TYP-ELEC",
    productTypeName: "Consumer Electronics",
    description: "Smartphones, laptops, tablets, and digital accessories.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    productTypeCode: "TYP-APPL",
    productTypeName: "Fashion & Apparel",
    description: "Footwear, sportswear, designer apparel, and streetwear.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    productTypeCode: "TYP-JEW",
    productTypeName: "Luxury Jewelry",
    description: "Precious metals, diamond rings, necklaces, and luxury watches.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    productTypeCode: "TYP-HOME",
    productTypeName: "Home Appliances",
    description: "Smart home gadgets, kitchen automation, and appliances.",
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_CATEGORIES: Omit<ProductCategoryItem, "id">[] = [
  {
    categoryCode: "CAT-301",
    categoryName: "Smart Wearables",
    description: "Smartwatches, fitness bands, and wearable tech gadgets.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    categoryCode: "CAT-302",
    categoryName: "Fine Jewelry",
    description: "Precious gemstone items, bracelets, and necklaces.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    categoryCode: "CAT-303",
    categoryName: "Diamond Rings",
    description: "High clarity certified diamond engagement and fashion rings.",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    categoryCode: "CAT-304",
    categoryName: "Wireless Audio",
    description: "Bluetooth headphones, noise cancelling earbuds, and speakers.",
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_SUPPLIERS: Omit<SupplierMasterItem, "id">[] = [
  {
    supplierCode: "SUP-401",
    supplierName: "Apex Logistics & Manufacturing Co.",
    supplierType: "Manufacturer",
    contactPerson: "Robert Chen",
    email: "robert@apexlogistics.com",
    phone: "+1 555-0192",
    address: "100 Industrial Parkway, Tech Hub",
    city: "San Jose",
    state: "CA",
    country: "USA",
    taxRegistrationNo: "US-993810291",
    paymentTerms: "Net 30",
    supplierStatus: "Active",
    createdAt: new Date().toISOString()
  },
  {
    supplierCode: "SUP-402",
    supplierName: "Zenith Tech Distributors",
    supplierType: "Distributor",
    contactPerson: "Sarah Jenkins",
    email: "sarah@zenithtech.io",
    phone: "+1 555-0381",
    address: "45 Logistics Boulevard, Commerce Zone",
    city: "Newark",
    state: "NJ",
    country: "USA",
    taxRegistrationNo: "US-882710492",
    paymentTerms: "Net 15",
    supplierStatus: "Active",
    createdAt: new Date().toISOString()
  },
  {
    supplierCode: "SUP-403",
    supplierName: "Artisan Gem Wholesale Ltd.",
    supplierType: "Wholesaler",
    contactPerson: "Elena Rostova",
    email: "elena@artisangem.com",
    phone: "+1 555-0492",
    address: "12 Diamond District Way",
    city: "New York",
    state: "NY",
    country: "USA",
    taxRegistrationNo: "US-771829304",
    paymentTerms: "Net 45",
    supplierStatus: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_SITES: Omit<SupplierSiteItem, "id">[] = [
  {
    siteCode: "STE-501",
    siteName: "Apex San Jose HQ & Plant",
    supplierId: "", // will be linked or filled dynamically
    supplierName: "Apex Logistics & Manufacturing Co.",
    siteType: "Head Office",
    address: "100 Industrial Parkway, Suite 100",
    city: "San Jose",
    state: "CA",
    country: "USA",
    postalCode: "95110",
    contactPerson: "Robert Chen",
    email: "robert@apexlogistics.com",
    phone: "+1 555-0192",
    isPrimarySite: true,
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    siteCode: "STE-502",
    siteName: "Zenith East Coast Fulfillment Hub",
    supplierId: "",
    supplierName: "Zenith Tech Distributors",
    siteType: "Warehouse",
    address: "45 Logistics Boulevard, Dock 12",
    city: "Newark",
    state: "NJ",
    country: "USA",
    postalCode: "07102",
    contactPerson: "Sarah Jenkins",
    email: "sarah@zenithtech.io",
    phone: "+1 555-0381",
    isPrimarySite: true,
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    siteCode: "STE-503",
    siteName: "Artisan Gem NY Studio",
    supplierId: "",
    supplierName: "Artisan Gem Wholesale Ltd.",
    siteType: "Branch",
    address: "12 Diamond District Way, 4th Floor",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10036",
    contactPerson: "Elena Rostova",
    email: "elena@artisangem.com",
    phone: "+1 555-0492",
    isPrimarySite: true,
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

const SEED_MASTERS: Omit<ProductMasterItem, "id">[] = [
  {
    productCode: "PRD-601",
    productName: "iPhone 15 Pro Max (256GB)",
    productDescription: "Titanium design with A17 Pro chip, Action button, and 48MP main camera system.",
    brandName: "Apple",
    uomName: "Pieces",
    productTypeName: "Consumer Electronics",
    productCategoryName: "Smart Wearables",
    supplierName: "Zenith Tech Distributors",
    sku: "APL-IP15PM-256",
    barcode: "194253091234",
    productStatus: "Active",
    productWeight: 0.22,
    productCost: 950.00,
    sellingPrice: 1199.99,
    taxRate: 8.5,
    isStockItem: true,
    createdDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  },
  {
    productCode: "PRD-602",
    productName: "Diamond Solitaire Engagement Ring",
    productDescription: "1.5 Carat VVS1 Round Brilliant Diamond set in 18K Platinum Band.",
    brandName: "Aura Luxe",
    uomName: "Pieces",
    productTypeName: "Luxury Jewelry",
    productCategoryName: "Diamond Rings",
    supplierName: "Artisan Gem Wholesale Ltd.",
    sku: "AUR-RNG-DM01",
    barcode: "884029103942",
    productStatus: "Active",
    productWeight: 0.01,
    productCost: 750.00,
    sellingPrice: 1499.00,
    taxRate: 10.0,
    isStockItem: true,
    createdDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  },
  {
    productCode: "PRD-603",
    productName: "Nike Air Zoom Pegasus 40",
    productDescription: "Responsive daily road running shoe with dual Zoom Air units and breathable mesh.",
    brandName: "Nike",
    uomName: "Pieces",
    productTypeName: "Fashion & Apparel",
    productCategoryName: "Smart Wearables",
    supplierName: "Apex Logistics & Manufacturing Co.",
    sku: "NIK-PEG40-BLK",
    barcode: "091201948271",
    productStatus: "Active",
    productWeight: 0.35,
    productCost: 65.00,
    sellingPrice: 130.00,
    taxRate: 5.0,
    isStockItem: true,
    createdDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  }
];

// Helper to seed a collection if empty
async function seedCollectionIfEmpty(colName: string, items: any[]) {
  try {
    for (const item of items) {
      await addDoc(collection(db, colName), {
        ...item,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.error(`Error seeding ${colName}:`, err);
  }
}

// ----------------------------------------------------
// 1. BRAND SERVICE
// ----------------------------------------------------

export function subscribeBrands(onData: (items: BrandItem[]) => void) {
  const q = query(collection(db, COLS.BRANDS), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Brands...");
      await seedCollectionIfEmpty(COLS.BRANDS, SEED_BRANDS);
      return;
    }
    const items: BrandItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        brandCode: data.brandCode || "",
        brandName: data.brandName || "",
        description: data.description || "",
        status: data.status || "Active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Brands sub error:", err));
}

export async function addBrandToDb(item: Omit<BrandItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.BRANDS), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateBrandInDb(id: string, item: Partial<BrandItem>) {
  await updateDoc(doc(db, COLS.BRANDS, id), item);
}

export async function deleteBrandFromDb(id: string) {
  await deleteDoc(doc(db, COLS.BRANDS, id));
}

// ----------------------------------------------------
// 2. UOM SERVICE
// ----------------------------------------------------

export function subscribeUoms(onData: (items: UomItem[]) => void) {
  const q = query(collection(db, COLS.UOMS), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding UOMs...");
      await seedCollectionIfEmpty(COLS.UOMS, SEED_UOMS);
      return;
    }
    const items: UomItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        uomCode: data.uomCode || "",
        uomName: data.uomName || "",
        uomType: data.uomType || "Quantity",
        conversionFactor: Number(data.conversionFactor) || 1,
        description: data.description || "",
        status: data.status || "Active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("UOMs sub error:", err));
}

export async function addUomToDb(item: Omit<UomItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.UOMS), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateUomInDb(id: string, item: Partial<UomItem>) {
  await updateDoc(doc(db, COLS.UOMS, id), item);
}

export async function deleteUomFromDb(id: string) {
  await deleteDoc(doc(db, COLS.UOMS, id));
}

// ----------------------------------------------------
// 3. PRODUCT TYPE SERVICE
// ----------------------------------------------------

export function subscribeProductTypes(onData: (items: ProductTypeItem[]) => void) {
  const q = query(collection(db, COLS.TYPES), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Product Types...");
      await seedCollectionIfEmpty(COLS.TYPES, SEED_TYPES);
      return;
    }
    const items: ProductTypeItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        productTypeCode: data.productTypeCode || "",
        productTypeName: data.productTypeName || "",
        description: data.description || "",
        status: data.status || "Active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Product Types sub error:", err));
}

export async function addProductTypeToDb(item: Omit<ProductTypeItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.TYPES), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateProductTypeInDb(id: string, item: Partial<ProductTypeItem>) {
  await updateDoc(doc(db, COLS.TYPES, id), item);
}

export async function deleteProductTypeFromDb(id: string) {
  await deleteDoc(doc(db, COLS.TYPES, id));
}

// ----------------------------------------------------
// 4. PRODUCT CATEGORY SERVICE
// ----------------------------------------------------

export function subscribeProductCategories(onData: (items: ProductCategoryItem[]) => void) {
  const q = query(collection(db, COLS.CATEGORIES), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Product Categories...");
      await seedCollectionIfEmpty(COLS.CATEGORIES, SEED_CATEGORIES);
      return;
    }
    const items: ProductCategoryItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        categoryCode: data.categoryCode || "",
        categoryName: data.categoryName || "",
        description: data.description || "",
        parentCategoryId: data.parentCategoryId || "",
        parentCategoryName: data.parentCategoryName || "",
        status: data.status || "Active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Product Categories sub error:", err));
}

export async function addProductCategoryToDb(item: Omit<ProductCategoryItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.CATEGORIES), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateProductCategoryInDb(id: string, item: Partial<ProductCategoryItem>) {
  await updateDoc(doc(db, COLS.CATEGORIES, id), item);
}

export async function deleteProductCategoryFromDb(id: string) {
  await deleteDoc(doc(db, COLS.CATEGORIES, id));
}

// ----------------------------------------------------
// 5. SUPPLIER MASTER SERVICE
// ----------------------------------------------------

export function subscribeSupplierMasters(onData: (items: SupplierMasterItem[]) => void) {
  const q = query(collection(db, COLS.SUPPLIERS), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Supplier Masters...");
      await seedCollectionIfEmpty(COLS.SUPPLIERS, SEED_SUPPLIERS);
      return;
    }
    const items: SupplierMasterItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        supplierCode: data.supplierCode || "",
        supplierName: data.supplierName || "",
        supplierType: data.supplierType || "Manufacturer",
        contactPerson: data.contactPerson || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        taxRegistrationNo: data.taxRegistrationNo || "",
        paymentTerms: data.paymentTerms || "Net 30",
        supplierStatus: data.supplierStatus || "Active",
        productId: data.productId || "",
        productName: data.productName || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Supplier Masters sub error:", err));
}

export async function addSupplierMasterToDb(item: Omit<SupplierMasterItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.SUPPLIERS), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateSupplierMasterInDb(id: string, item: Partial<SupplierMasterItem>) {
  await updateDoc(doc(db, COLS.SUPPLIERS, id), item);
}

export async function deleteSupplierMasterFromDb(id: string) {
  await deleteDoc(doc(db, COLS.SUPPLIERS, id));
}

// ----------------------------------------------------
// 6. SUPPLIER SITE SERVICE
// ----------------------------------------------------

export function subscribeSupplierSites(onData: (items: SupplierSiteItem[]) => void) {
  const q = query(collection(db, COLS.SITES), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Supplier Sites...");
      await seedCollectionIfEmpty(COLS.SITES, SEED_SITES);
      return;
    }
    const items: SupplierSiteItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        siteCode: data.siteCode || "",
        siteName: data.siteName || "",
        supplierId: data.supplierId || "",
        supplierName: data.supplierName || "",
        siteType: data.siteType || "Head Office",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postalCode: data.postalCode || "",
        contactPerson: data.contactPerson || "",
        email: data.email || "",
        phone: data.phone || "",
        isPrimarySite: data.isPrimarySite !== undefined ? data.isPrimarySite : false,
        status: data.status || "Active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Supplier Sites sub error:", err));
}

export async function addSupplierSiteToDb(item: Omit<SupplierSiteItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.SITES), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateSupplierSiteInDb(id: string, item: Partial<SupplierSiteItem>) {
  await updateDoc(doc(db, COLS.SITES, id), item);
}

export async function deleteSupplierSiteFromDb(id: string) {
  await deleteDoc(doc(db, COLS.SITES, id));
}

// ----------------------------------------------------
// 7. PRODUCT MASTER SERVICE
// ----------------------------------------------------

export function subscribeProductMasters(onData: (items: ProductMasterItem[]) => void) {
  const q = query(collection(db, COLS.MASTERS), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snap) => {
    if (snap.empty) {
      console.log("Seeding Product Masters...");
      await seedCollectionIfEmpty(COLS.MASTERS, SEED_MASTERS);
      return;
    }
    const items: ProductMasterItem[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        productCode: data.productCode || "",
        productName: data.productName || "",
        productDescription: data.productDescription || "",
        brandId: data.brandId || "",
        brandName: data.brandName || "",
        uomId: data.uomId || "",
        uomName: data.uomName || "",
        productTypeId: data.productTypeId || "",
        productTypeName: data.productTypeName || "",
        productCategoryId: data.productCategoryId || "",
        productCategoryName: data.productCategoryName || "",
        supplierId: data.supplierId || "",
        supplierName: data.supplierName || "",
        sku: data.sku || "",
        barcode: data.barcode || "",
        productStatus: data.productStatus || "Active",
        productWeight: Number(data.productWeight) || 0,
        productCost: Number(data.productCost) || 0,
        sellingPrice: Number(data.sellingPrice) || 0,
        taxRate: Number(data.taxRate) || 0,
        isStockItem: data.isStockItem !== undefined ? Boolean(data.isStockItem) : true,
        createdDate: data.createdDate || new Date().toISOString().split("T")[0],
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    onData(items);
  }, (err) => console.error("Product Masters sub error:", err));
}

export async function addProductMasterToDb(item: Omit<ProductMasterItem, "id" | "createdAt">) {
  return (await addDoc(collection(db, COLS.MASTERS), { ...item, createdAt: serverTimestamp() })).id;
}

export async function updateProductMasterInDb(id: string, item: Partial<ProductMasterItem>) {
  await updateDoc(doc(db, COLS.MASTERS, id), item);
}

export async function deleteProductMasterFromDb(id: string) {
  await deleteDoc(doc(db, COLS.MASTERS, id));
}

// ----------------------------------------------------
// CODE GENERATION HELPERS
// ----------------------------------------------------

export function generateCode(prefix: string, existingCodes: string[]): string {
  const codeSet = new Set(existingCodes.map((c) => c.toUpperCase()));
  let counter = 1001;
  let candidate = `${prefix}-${counter}`;
  while (codeSet.has(candidate.toUpperCase())) {
    counter++;
    candidate = `${prefix}-${counter}`;
  }
  return candidate;
}
