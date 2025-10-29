import type {
  Admin,
  Analytics,
  BannedBusiness,
  BannedProduct,
  BannedUser,
  Business,
  Coupon,
  CouponRedemption,
  DashboardStats,
  Image,
  Payment,
  Plan,
  Product,
  Trial,
  User,
  WebhookEvent,
} from "@/types/admin";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "USER",
    createdAt: new Date("2024-01-15"),
    isBanned: false,
    isBusinessOwner: false,
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    role: "BUSINESS",
    createdAt: new Date("2024-02-20"),
    isBanned: false,
    isBusinessOwner: true,
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos@example.com",
    role: "BUSINESS",
    createdAt: new Date("2024-03-10"),
    isBanned: false,
    isBusinessOwner: true,
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "USER",
    createdAt: new Date("2024-01-05"),
    isBanned: true,
    isBusinessOwner: false,
  },
  {
    id: "5",
    name: "Admin Principal",
    email: "admin@example.com",
    role: "ADMIN",
    createdAt: new Date("2023-12-01"),
    isBanned: false,
    isBusinessOwner: false,
  },
];

// Mock Businesses
export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Tienda de Ropa Fashion",
    slug: "tienda-ropa-fashion",
    ownerId: "2",
    ownerName: "María García",
    plan: "PREMIUM",
    isActive: true,
    isBanned: false,
    createdAt: new Date("2024-02-20"),
    productsCount: 45,
    instagram: "@fashionstore",
    whatsapp: "+5491123456789",
  },
  {
    id: "2",
    name: "Electrónica Total",
    slug: "electronica-total",
    ownerId: "3",
    ownerName: "Carlos López",
    plan: "BASIC",
    isActive: true,
    isBanned: false,
    createdAt: new Date("2024-03-10"),
    productsCount: 28,
    facebook: "electronicatotal",
  },
  {
    id: "3",
    name: "Librería Central",
    slug: "libreria-central",
    ownerId: "6",
    ownerName: "Pedro Sánchez",
    plan: "FREE",
    isActive: false,
    isBanned: false,
    createdAt: new Date("2024-04-01"),
    productsCount: 12,
  },
  {
    id: "4",
    name: "Negocio Suspendido",
    slug: "negocio-suspendido",
    ownerId: "7",
    ownerName: "Usuario Baneado",
    plan: "BASIC",
    isActive: false,
    isBanned: true,
    createdAt: new Date("2024-01-15"),
    productsCount: 5,
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Remera Básica",
    description: "Remera de algodón 100%",
    price: 5999,
    businessId: "1",
    businessName: "Tienda de Ropa Fashion",
    category: "Ropa",
    isActive: true,
    isBanned: false,
    createdAt: new Date("2024-02-25"),
    imageUrl: "/basic-tshirt.jpg",
  },
  {
    id: "2",
    name: "Notebook Gamer",
    description: "Laptop de alto rendimiento",
    price: 899999,
    businessId: "2",
    businessName: "Electrónica Total",
    category: "Electrónica",
    isActive: true,
    isBanned: false,
    createdAt: new Date("2024-03-15"),
    imageUrl: "/gaming-laptop.png",
  },
  {
    id: "3",
    name: "Libro Prohibido",
    description: "Contenido inapropiado",
    price: 2999,
    businessId: "3",
    businessName: "Librería Central",
    category: "Libros",
    isActive: false,
    isBanned: true,
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "4",
    name: "Mouse Inalámbrico",
    description: "Mouse ergonómico",
    price: 8999,
    businessId: "2",
    businessName: "Electrónica Total",
    category: "Electrónica",
    isActive: true,
    isBanned: false,
    createdAt: new Date("2024-03-20"),
    imageUrl: "/wireless-mouse.jpg",
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "1",
    amount: 29999,
    status: "approved",
    businessId: "1",
    businessName: "Tienda de Ropa Fashion",
    plan: "PREMIUM",
    method: "Mercado Pago",
    createdAt: new Date("2024-02-20"),
    externalId: "MP-123456",
  },
  {
    id: "2",
    amount: 14999,
    status: "approved",
    businessId: "2",
    businessName: "Electrónica Total",
    plan: "BASIC",
    method: "Mercado Pago",
    createdAt: new Date("2024-03-10"),
    externalId: "MP-123457",
  },
  {
    id: "3",
    amount: 14999,
    status: "pending",
    businessId: "3",
    businessName: "Librería Central",
    plan: "BASIC",
    method: "Mercado Pago",
    createdAt: new Date("2024-04-01"),
    externalId: "MP-123458",
  },
  {
    id: "4",
    amount: 29999,
    status: "rejected",
    businessId: "2",
    businessName: "Electrónica Total",
    plan: "PREMIUM",
    method: "Mercado Pago",
    createdAt: new Date("2024-03-25"),
    externalId: "MP-123459",
  },
];

// Mock Coupons
export const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "LAUNCH2024",
    plan: "PREMIUM",
    durationMonths: 3,
    maxUses: 100,
    currentUses: 45,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    expiresAt: new Date("2024-12-31"),
  },
  {
    id: "2",
    code: "BASIC50",
    plan: "BASIC",
    durationMonths: 1,
    maxUses: 50,
    currentUses: 50,
    isActive: false,
    createdAt: new Date("2024-02-01"),
    expiresAt: new Date("2024-03-31"),
  },
  {
    id: "3",
    code: "SUMMER2024",
    plan: "BASIC",
    durationMonths: 2,
    maxUses: 200,
    currentUses: 87,
    isActive: true,
    createdAt: new Date("2024-03-01"),
  },
];

// Mock Coupon Redemptions
export const mockCouponRedemptions: CouponRedemption[] = [
  {
    id: "1",
    couponId: "1",
    couponCode: "LAUNCH2024",
    businessId: "1",
    businessName: "Tienda de Ropa Fashion",
    redeemedAt: new Date("2024-02-20"),
  },
  {
    id: "2",
    couponId: "3",
    couponCode: "SUMMER2024",
    businessId: "2",
    businessName: "Electrónica Total",
    redeemedAt: new Date("2024-03-10"),
  },
];

// Mock Trials
export const mockTrials: Trial[] = [
  {
    id: "1",
    businessId: "3",
    businessName: "Librería Central",
    plan: "BASIC",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-04-15"),
    isActive: true,
  },
  {
    id: "2",
    businessId: "1",
    businessName: "Tienda de Ropa Fashion",
    plan: "PREMIUM",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-15"),
    isActive: false,
  },
];

// Mock Banned Users
export const mockBannedUsers: BannedUser[] = [
  {
    id: "1",
    userId: "4",
    userName: "Ana Martínez",
    userEmail: "ana@example.com",
    reason: "Comportamiento inapropiado",
    bannedBy: "Admin Principal",
    bannedAt: new Date("2024-03-15"),
  },
];

// Mock Banned Businesses
export const mockBannedBusinesses: BannedBusiness[] = [
  {
    id: "1",
    businessId: "4",
    businessName: "Negocio Suspendido",
    reason: "Violación de términos de servicio",
    bannedBy: "Admin Principal",
    bannedAt: new Date("2024-03-20"),
  },
];

// Mock Banned Products
export const mockBannedProducts: BannedProduct[] = [
  {
    id: "1",
    productId: "3",
    productName: "Libro Prohibido",
    businessName: "Librería Central",
    reason: "Contenido inapropiado",
    bannedBy: "Admin Principal",
    bannedAt: new Date("2024-04-06"),
  },
];

// Mock Images
export const mockImages: Image[] = [
  {
    id: "1",
    url: "/product-image-1.jpg",
    productId: "1",
    businessId: "1",
    uploadedAt: new Date("2024-02-25"),
    isReported: false,
  },
  {
    id: "2",
    url: "/product-image-2.jpg",
    productId: "2",
    businessId: "2",
    uploadedAt: new Date("2024-03-15"),
    isReported: false,
  },
  {
    id: "3",
    url: "/inappropriate-content.jpg",
    productId: "3",
    businessId: "3",
    uploadedAt: new Date("2024-04-05"),
    isReported: true,
  },
];

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: "1",
    userId: "5",
    name: "Admin Principal",
    email: "admin@example.com",
    permissions: ["all"],
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "2",
    userId: "8",
    name: "Moderador",
    email: "moderador@example.com",
    permissions: ["moderate_content", "ban_users"],
    createdAt: new Date("2024-01-15"),
  },
];

// Mock Webhook Events
export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: "1",
    type: "payment.approved",
    payload: { payment_id: "MP-123456", amount: 29999 },
    status: "processed",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "2",
    type: "payment.pending",
    payload: { payment_id: "MP-123458", amount: 14999 },
    status: "processed",
    createdAt: new Date("2024-04-01"),
  },
  {
    id: "3",
    type: "payment.rejected",
    payload: { payment_id: "MP-123459", amount: 29999 },
    status: "processed",
    createdAt: new Date("2024-03-25"),
  },
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalUsers: 150,
  totalBusinesses: 45,
  totalProducts: 320,
  totalPayments: 89,
  totalRevenue: 1245000,
  activeTrials: 8,
  activeCoupons: 2,
  bannedUsers: 3,
  bannedBusinesses: 1,
  bannedProducts: 2,
  planDistribution: {
    FREE: 20,
    BASIC: 15,
    PREMIUM: 10,
  },
  monthlyRevenue: [
    { month: "Ene", revenue: 85000 },
    { month: "Feb", revenue: 120000 },
    { month: "Mar", revenue: 195000 },
    { month: "Abr", revenue: 245000 },
    { month: "May", revenue: 280000 },
    { month: "Jun", revenue: 320000 },
  ],
  businessGrowth: [
    { month: "Ene", count: 5 },
    { month: "Feb", count: 8 },
    { month: "Mar", count: 12 },
    { month: "Abr", count: 15 },
    { month: "May", count: 18 },
    { month: "Jun", count: 22 },
  ],
};

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  users: {
    total: 150,
    active: 147,
    banned: 3,
    businessOwners: 45,
  },
  businesses: {
    total: 45,
    active: 42,
    inactive: 2,
    banned: 1,
  },
  products: {
    total: 320,
    active: 315,
    banned: 5,
  },
  payments: {
    total: 89,
    approved: 82,
    pending: 5,
    rejected: 2,
    totalRevenue: 1245000,
  },
  plans: {
    FREE: 20,
    BASIC: 15,
    PREMIUM: 10,
  },
};

// Mock Plans
export const mockPlans: Plan[] = [
  {
    id: "1",
    type: "FREE",
    name: "Plan Gratuito",
    description: "Perfecto para comenzar tu negocio online",
    price: 0,
    features: [
      "Hasta 10 productos",
      "3 imágenes por producto",
      "Catálogo básico",
      "Soporte por email",
    ],
    maxProducts: 10,
    maxImages: 3,
    isActive: true,
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "2",
    type: "BASIC",
    name: "Plan Básico",
    description: "Para negocios en crecimiento",
    price: 14999,
    features: [
      "Hasta 50 productos",
      "10 imágenes por producto",
      "Catálogo personalizado",
      "Estadísticas básicas",
      "Soporte prioritario",
    ],
    maxProducts: 50,
    maxImages: 10,
    isActive: true,
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "3",
    type: "PREMIUM",
    name: "Plan Premium",
    description: "Para negocios profesionales",
    price: 29999,
    features: [
      "Productos ilimitados",
      "Imágenes ilimitadas",
      "Catálogo premium",
      "Estadísticas avanzadas",
      "Soporte 24/7",
      "Dominio personalizado",
      "Sin comisiones",
    ],
    maxProducts: -1,
    maxImages: -1,
    isActive: true,
    createdAt: new Date("2023-12-01"),
  },
];
