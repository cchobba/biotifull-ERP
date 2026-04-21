import { pgTable, serial, varchar, numeric, integer, timestamp, boolean, text } from 'drizzle-orm/pg-core';

// 1. Users (Admin Access)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
});

// 2. CRM: Customers
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Products & Inventory
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: text('image_url'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull().default('unit'), // unit, litre, kg, ml, g, etc.
  stockQuantity: integer('stock_quantity').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  isActive: boolean('is_active').default(true),
});

// 4. Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, completed, cancelled
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  amountPaid: numeric('amount_paid', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Order Items (Line items linking products to orders)
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(), // Locks in the price at the time of order
});

// 6. Payments Ledger
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  method: varchar('method', { length: 50 }).notNull(), // cash, transfer, etc.
  reference: varchar('reference', { length: 255 }), // Check number or TXN ID
  paidAt: timestamp('paid_at').defaultNow().notNull(),
});

// 7. Providers (Suppliers/Vendors)
export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  category: varchar('category', { length: 100 }), // Raw materials, packaging, utilities, etc.
});

// 8. Expenses & Purchases
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  providerId: integer('provider_id').references(() => providers.id),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // COGS, Marketing, Salary, Rent, etc.
  date: timestamp('date').defaultNow().notNull(),
  reference: varchar('reference', { length: 255 }), // Invoice # or Receipt #
});
