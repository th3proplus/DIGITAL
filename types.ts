// types.ts

export type ProductStatus = 'available' | 'coming_soon' | 'out_of_stock';

export interface Category {
  id: string;
  name: string; // Internal identifier, e.g. 'SVOD'
  displayName: {
    en: string;
    fr: string;
    ar: string;
  };
  icon: string;
}

export interface ProductVariant {
  id: string;
  nameKey: string;
  price?: number;
  isFreeTrial?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  logoUrl: string;
  imageUrl: string;
  color: string;
  category: string;
  status: ProductStatus;
  specialTagKey?: string;
  socialProof: {
    avatars: string[];
    textKey: string;
  };
  featuresKeys: string[];
  pageIndicator?: string;
  rating?: number;
  reviewsCount?: number;
  variants: ProductVariant[];
  defaultVariantId: string;
}

export interface GiftCard {
    id: string;
    name: string;
    logoUrl: string;
    galleryImageUrl: string;
    pageImageUrl: string;
    denominations: number[];
    showLogoOnGallery: boolean;
    status: ProductStatus;
}

export interface DataPlan {
  id: string;
  name: string;
  price: number;
  dataAmount: string;
  status: ProductStatus;
}

export interface MobileDataProvider {
  id: string;
  name: string;
  logoUrl: string;
  galleryImageUrl: string;
  pageImageUrl: string;
  showLogoOnGallery: boolean;
  plans: DataPlan[];
}


export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  // Denormalized data for easy display
  productNameKey: string; // For standard products, this is a key. For custom, it's the user-entered name.
  variantNameKey: string;
  logoUrl: string;
  price: number; // Final price per item in store currency.
  isFreeTrial: boolean;
  metadata?: {
    isCustomOrder?: boolean;
    customOrderType?: 'aliexpress' | 'giftCard' | 'mobileData' | 'international';
    // AliExpress & International Shopper fields
    url?: string;
    originalPrice?: number;
    originalShippingPrice?: number;
    originalCurrency?: 'USD' | 'EUR';
    // Gift Card fields
    giftCardBrand?: string;
    denomination?: number;
    // Mobile Data fields
    provider?: string;
    phoneNumber?: string;
    planName?: string;
    dataAmount?: string;
  }
}


export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  AwaitingPayment = 'AwaitingPayment',
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  paymentMethod: string;
  shippingDetails?: {
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  }
}

export interface PlaceOrderDetails {
  name: string;
  email: string;
  shipping?: {
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  }
}

export interface User {
  id:string;
  name: string;
  email: string;
  password?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  variantId: string;
  productNameKey: string;
  variantNameKey: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Cancelled' | 'Expired';
}

export type UserPanelTab = 'dashboard' | 'orders' | 'settings' | 'subscriptions';


export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface Campaign {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientsCount: number;
}

export interface RequestProductFormField {
  id: string;
  type: 'text' | 'textarea' | 'url' | 'email';
  label: MultilingualText;
  placeholder: MultilingualText;
  enabled: boolean;
  required: boolean;
  isDefault: boolean;
}

export interface ProductRequest {
  id: string;
  userName: string;
  userEmail: string;
  requestedAt: string;
  status: 'Pending' | 'Reviewed' | 'Added';
  formData: Record<string, string>;
}

interface IntegrationSetting {
    enabled: boolean;
}

export interface BankTransferField {
    value: string;
    enabled: boolean;
}

export interface MultilingualText {
  en: string;
  fr: string;
  ar: string;
}

export interface WhyUsFeature {
  icon: string;
  title: MultilingualText;
  description: MultilingualText;
  link?: MultilingualText;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: MultilingualText;
  content: MultilingualText;
  isVisible: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface FooterStaticLink {
  key: string;
  slug: string;
}

export interface FooterSocialLink {
  name: string;
  href: string;
}

export interface SectionSettings {
  title: MultilingualText;
  enabled: boolean;
}

export interface Settings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  supportWhatsappNumber: string;
  supportTelegramUsername: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'TND';
  logoUrl: string;
  themeColor: string;
  adminUsername: string;
  adminPassword?: string;
  categories: Category[];
  homePage: {
    hero: {
      title: MultilingualText;
      subtitle: MultilingualText;
    };
    whyUs: {
      titlePart1: MultilingualText;
      titleHighlight: MultilingualText;
      titlePart2: MultilingualText;
      features: WhyUsFeature[];
    };
    aliexpressPromo: {
      title: MultilingualText;
      subtitle: MultilingualText;
      cta: MultilingualText;
    };
    internationalShopperPromo: {
      title: MultilingualText;
      subtitle: MultilingualText;
      cta: MultilingualText;
    };
    requestProductPromo: {
      title: MultilingualText;
      subtitle: MultilingualText;
      cta: MultilingualText;
    };
    mobileDataPromo: {
      title: MultilingualText;
      subtitle: MultilingualText;
    };
    giftCardPromo: {
      title: MultilingualText;
      subtitle: MultilingualText;
    };
    footerNewsletter: {
      title: MultilingualText;
      subtitle: MultilingualText;
      placeholder: MultilingualText;
      buttonText: MultilingualText;
    };
    componentsOrder: string[];
  };
  explorePage: {
    title: MultilingualText;
    subtitle: MultilingualText;
    sections: {
      products: SectionSettings;
      services: SectionSettings;
      giftCards: SectionSettings;
      mobileData: SectionSettings;
      pages: SectionSettings;
      categories: SectionSettings;
    };
  };
  contactPage: {
    title: MultilingualText;
    subtitle: MultilingualText;
    formTitle: MultilingualText;
    whatsappTitle: MultilingualText;
    whatsappSubtitle: MultilingualText;
    whatsappCta: MultilingualText;
    telegramTitle: MultilingualText;
    telegramSubtitle: MultilingualText;
    telegramCta: MultilingualText;
    socialTitle: MultilingualText;
    socialLinks: FooterSocialLink[];
    formLabels: {
      name: MultilingualText;
      email: MultilingualText;
      message: MultilingualText;
      sendButtonText: MultilingualText;
    };
    formSuccessMessage: MultilingualText;
  };
  footer: {
    staticLinks: FooterStaticLink[];
    socialLinks: FooterSocialLink[];
    copyrightText: MultilingualText;
    subfooterLinks: FooterStaticLink[];
  };
  maintenancePage: {
    title: MultilingualText;
    subtitle: MultilingualText;
  };
  services: {
    aliexpress: {
      checkoutTitle: MultilingualText;
      checkoutSubtitle: MultilingualText;
      checkoutNextSteps: MultilingualText;
      thankYouTitle: MultilingualText;
      thankYouSubtitle: MultilingualText;
    };
    internationalShopper: {
      checkoutTitle: MultilingualText;
      checkoutSubtitle: MultilingualText;
      checkoutNextSteps: MultilingualText;
      thankYouTitle: MultilingualText;
      thankYouSubtitle: MultilingualText;
      noteTitle: MultilingualText;
      noteBody: MultilingualText;
    };
    requestProduct: {
      fields: RequestProductFormField[];
    };
  };
  payments: {
    stripe: IntegrationSetting & { apiKey: string };
    paypal: IntegrationSetting & { clientId: string };
    binance: IntegrationSetting & { apiKey: string, secretKey: string };
    bankTransfer: IntegrationSetting & { 
        name: BankTransferField;
        accountName: BankTransferField;
        accountNumber: BankTransferField;
        bankName: BankTransferField;
        whatsappNumber: BankTransferField;
    };
    click2pay: IntegrationSetting & { apiKey: string };
  };
  accessControl: {
    requireLoginToCheckout: boolean;
    googleLogin: IntegrationSetting & { clientId: string };
    facebookLogin: IntegrationSetting & { appId: string };
  };
  marketing: {
      facebookPixelId: string;
      googleAnalyticsId: string;
      mailchimp: IntegrationSetting & { apiKey: string; listId: string; };
      sendgrid: IntegrationSetting & { apiKey: string; };
  };
  advanced: {
      developerMode: boolean;
      maintenanceMode: boolean;
      customCss: string;
      customJs: string;
  }
}