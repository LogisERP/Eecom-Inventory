export type StatusOption = 'Active' | 'Inactive';
export type UomTypeOption = 'Quantity' | 'Weight' | 'Volume' | 'Length';
export type SupplierTypeOption = 'Manufacturer' | 'Distributor' | 'Wholesaler' | 'Service Provider';
export type PaymentTermsOption = 'Cash' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60';
export type SiteTypeOption = 'Head Office' | 'Warehouse' | 'Branch' | 'Delivery';

export interface BrandItem {
  id?: string;
  brandCode: string;
  brandName: string;
  description: string;
  status: StatusOption;
  createdAt?: string;
}

export interface UomItem {
  id?: string;
  uomCode: string;
  uomName: string;
  uomType: UomTypeOption;
  conversionFactor: number;
  description: string;
  status: StatusOption;
  createdAt?: string;
}

export interface ProductTypeItem {
  id?: string;
  productTypeCode: string;
  productTypeName: string;
  description: string;
  status: StatusOption;
  createdAt?: string;
}

export interface ProductCategoryItem {
  id?: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  status: StatusOption;
  createdAt?: string;
}

export interface ProductMasterItem {
  id?: string;
  productCode: string;
  productName: string;
  productDescription: string;
  brandId?: string;
  brandName?: string;
  uomId?: string;
  uomName?: string;
  productTypeId?: string;
  productTypeName?: string;
  productCategoryId?: string;
  productCategoryName?: string;
  supplierId?: string;
  supplierName?: string;
  sku: string;
  barcode: string;
  productStatus: StatusOption;
  productWeight: number;
  productCost: number;
  sellingPrice: number;
  taxRate: number;
  isStockItem: boolean;
  createdDate: string;
  createdAt?: string;
}

export interface SupplierMasterItem {
  id?: string;
  supplierCode: string;
  supplierName: string;
  supplierType: SupplierTypeOption;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  taxRegistrationNo: string;
  paymentTerms: PaymentTermsOption;
  supplierStatus: StatusOption;
  productId?: string;
  productName?: string;
  createdAt?: string;
}

export interface SupplierSiteItem {
  id?: string;
  siteCode: string;
  siteName: string;
  supplierId: string;
  supplierName?: string;
  siteType: SiteTypeOption;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  isPrimarySite: boolean;
  status: StatusOption;
  createdAt?: string;
}
