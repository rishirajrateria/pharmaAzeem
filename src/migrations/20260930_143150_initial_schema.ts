import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_badges" AS ENUM('new', 'best-seller', 'who-gmp', 'export-ready', 'sugar-free', 'pediatric');
  CREATE TYPE "public"."enum_products_dosage_form" AS ENUM('Tablet', 'Capsule', 'Oral Suspension / Syrup', 'Injection', 'Infusion', 'Ointment / Cream / Gel', 'Eye / Ear Drops', 'Sachet / Powder', 'Inhaler', 'Oral Solution / Drops', 'Suppository', 'Nasal Spray', 'Other');
  CREATE TYPE "public"."enum_products_prescription_status" AS ENUM('rx', 'otc');
  CREATE TYPE "public"."enum_products_route" AS ENUM('Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Ophthalmic', 'Otic', 'Inhalation', 'Nasal', 'Rectal', 'Vaginal');
  CREATE TYPE "public"."enum_products_show_price" AS ENUM('default', 'always', 'never');
  CREATE TYPE "public"."enum_products_availability" AS ENUM('in-stock', 'made-to-order', 'pre-order', 'discontinued');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_badges" AS ENUM('new', 'best-seller', 'who-gmp', 'export-ready', 'sugar-free', 'pediatric');
  CREATE TYPE "public"."enum__products_v_version_dosage_form" AS ENUM('Tablet', 'Capsule', 'Oral Suspension / Syrup', 'Injection', 'Infusion', 'Ointment / Cream / Gel', 'Eye / Ear Drops', 'Sachet / Powder', 'Inhaler', 'Oral Solution / Drops', 'Suppository', 'Nasal Spray', 'Other');
  CREATE TYPE "public"."enum__products_v_version_prescription_status" AS ENUM('rx', 'otc');
  CREATE TYPE "public"."enum__products_v_version_route" AS ENUM('Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Ophthalmic', 'Otic', 'Inhalation', 'Nasal', 'Rectal', 'Vaginal');
  CREATE TYPE "public"."enum__products_v_version_show_price" AS ENUM('default', 'always', 'never');
  CREATE TYPE "public"."enum__products_v_version_availability" AS ENUM('in-stock', 'made-to-order', 'pre-order', 'discontinued');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'closed');
  CREATE TYPE "public"."enum_inquiries_source" AS ENUM('inquiry-list', 'product-page', 'contact-form');
  CREATE TYPE "public"."enum_countries_region" AS ENUM('africa', 'middle-east', 'south-asia', 'south-east-asia', 'east-asia-pacific', 'cis', 'europe', 'latin-america', 'north-america');
  CREATE TYPE "public"."enum_certifications_type" AS ENUM('license', 'certification', 'accreditation', 'registration', 'membership');
  CREATE TYPE "public"."enum_facilities_dosage_forms" AS ENUM('Tablet', 'Capsule', 'Oral Suspension / Syrup', 'Injection', 'Infusion', 'Ointment / Cream / Gel', 'Eye / Ear Drops', 'Sachet / Powder', 'Inhaler', 'Oral Solution / Drops', 'Suppository', 'Nasal Spray', 'Other');
  CREATE TYPE "public"."enum_facilities_type" AS ENUM('formulation', 'api', 'rnd', 'qc-lab', 'warehouse');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_site_settings_contact_socials_platform" AS ENUM('linkedin', 'facebook', 'instagram', 'x', 'youtube', 'whatsapp');
  CREATE TYPE "public"."enum_site_settings_commerce_mode" AS ENUM('inquiry', 'ecommerce');
  CREATE TYPE "public"."enum_site_settings_commerce_currency" AS ENUM('USD', 'EUR', 'GBP', 'INR', 'AED', 'SAR', 'PKR', 'BDT', 'NGN', 'KES', 'ZAR', 'BRL');
  CREATE TYPE "public"."enum_homepage_why_us_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_products_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_about_page_values_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_about_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_quality_page_pillars_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_quality_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_manufacturing_page_capabilities_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_manufacturing_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_global_presence_page_export_services_icon" AS ENUM('activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2', 'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge', 'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse', 'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle', 'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout', 'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse', 'wind', 'zap');
  CREATE TYPE "public"."enum_global_presence_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_licenses_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_contact_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TYPE "public"."enum_inquiry_page_sections_layout" AS ENUM('imageRight', 'imageLeft', 'full');
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_active_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"strength" varchar
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "products_key_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"generic_name" varchar,
  	"featured" boolean DEFAULT false,
  	"short_description" varchar,
  	"dosage_form" "enum_products_dosage_form",
  	"strength" varchar,
  	"prescription_status" "enum_products_prescription_status" DEFAULT 'rx',
  	"route" "enum_products_route",
  	"pack_size" varchar,
  	"packaging" varchar,
  	"shelf_life" varchar,
  	"storage" varchar,
  	"therapeutic_class" varchar,
  	"description" jsonb,
  	"indications" jsonb,
  	"price" numeric,
  	"compare_at_price" numeric,
  	"price_unit" varchar,
  	"show_price" "enum_products_show_price" DEFAULT 'default',
  	"sku" varchar,
  	"min_order_quantity" numeric DEFAULT 1,
  	"stock" numeric,
  	"availability" "enum_products_availability" DEFAULT 'in-stock',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_products_v_version_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v_version_active_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"strength" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_key_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_generic_name" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_short_description" varchar,
  	"version_dosage_form" "enum__products_v_version_dosage_form",
  	"version_strength" varchar,
  	"version_prescription_status" "enum__products_v_version_prescription_status" DEFAULT 'rx',
  	"version_route" "enum__products_v_version_route",
  	"version_pack_size" varchar,
  	"version_packaging" varchar,
  	"version_shelf_life" varchar,
  	"version_storage" varchar,
  	"version_therapeutic_class" varchar,
  	"version_description" jsonb,
  	"version_indications" jsonb,
  	"version_price" numeric,
  	"version_compare_at_price" numeric,
  	"version_price_unit" varchar,
  	"version_show_price" "enum__products_v_version_show_price" DEFAULT 'default',
  	"version_sku" varchar,
  	"version_min_order_quantity" numeric DEFAULT 1,
  	"version_stock" numeric,
  	"version_availability" "enum__products_v_version_availability" DEFAULT 'in-stock',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "categories_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "categories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"path" varchar,
  	"level" numeric,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"short_description" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"icon" "enum_categories_icon",
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"product_name" varchar,
  	"quantity" numeric DEFAULT 1
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"source" "enum_inquiries_source" DEFAULT 'inquiry-list',
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"country" varchar,
  	"message" varchar,
  	"admin_notes" varchar,
  	"page_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "countries_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"iso_code" varchar NOT NULL,
  	"flag" varchar,
  	"region" "enum_countries_region" NOT NULL,
  	"served" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"since_year" numeric,
  	"lat" numeric,
  	"lng" numeric,
  	"regulatory_authority" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_certifications_type" DEFAULT 'certification' NOT NULL,
  	"issuer" varchar NOT NULL,
  	"certificate_number" varchar,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"scope" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"document_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities_dosage_forms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_facilities_dosage_forms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "facilities_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "facilities_capacity" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "facilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"type" "enum_facilities_type" DEFAULT 'formulation' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"area_sqm" numeric,
  	"established_year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"certifications_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer,
  	"inquiries_id" integer,
  	"countries_id" integer,
  	"certifications_id" integer,
  	"facilities_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_contact_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_contact_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_seo_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_seo_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Azeem Pharmaceuticals' NOT NULL,
  	"legal_name" varchar,
  	"tagline" varchar,
  	"short_description" varchar,
  	"logo_id" integer,
  	"founding_year" numeric,
  	"employee_count" varchar,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_text" varchar,
  	"announcement_url" varchar,
  	"contact_email" varchar,
  	"contact_inquiry_email" varchar,
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_address_street" varchar,
  	"contact_address_city" varchar,
  	"contact_address_state" varchar,
  	"contact_address_postal_code" varchar,
  	"contact_address_country" varchar,
  	"contact_business_hours" varchar,
  	"contact_map_embed_url" varchar,
  	"commerce_mode" "enum_site_settings_commerce_mode" DEFAULT 'inquiry',
  	"commerce_show_prices" boolean DEFAULT false,
  	"commerce_currency" "enum_site_settings_commerce_currency" DEFAULT 'USD',
  	"commerce_price_fallback_label" varchar DEFAULT 'Inquire for pricing',
  	"commerce_list_name" varchar DEFAULT 'Inquiry list',
  	"commerce_add_label" varchar DEFAULT 'Add to inquiry list',
  	"commerce_cta_label" varchar DEFAULT 'Inquire now',
  	"seo_title_template" varchar DEFAULT '%s | Azeem Pharmaceuticals',
  	"seo_default_title" varchar,
  	"seo_default_description" varchar,
  	"seo_default_image_id" integer,
  	"seo_twitter_handle" varchar,
  	"seo_google_site_verification" varchar,
  	"seo_bing_site_verification" varchar,
  	"seo_ga_measurement_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_homepage_why_us_icon",
  	"description" varchar
  );
  
  CREATE TABLE "homepage_manufacturing_section_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "homepage_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'WHO-GMP certified manufacturer & exporter',
  	"hero_title" varchar DEFAULT 'Trusted medicines for a healthier world' NOT NULL,
  	"hero_highlight" varchar,
  	"hero_subtitle" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"hero_image_id" integer,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"intro_image_id" integer,
  	"global_section_eyebrow" varchar DEFAULT 'Global presence',
  	"global_section_heading" varchar DEFAULT 'Delivering quality medicines to 40+ countries',
  	"global_section_body" varchar,
  	"manufacturing_section_eyebrow" varchar DEFAULT 'Manufacturing',
  	"manufacturing_section_heading" varchar,
  	"manufacturing_section_body" varchar,
  	"manufacturing_section_image_id" integer,
  	"cta_heading" varchar DEFAULT 'Looking for a reliable pharmaceutical partner?',
  	"cta_body" varchar,
  	"cta_primary_cta_label" varchar,
  	"cta_primary_cta_url" varchar,
  	"cta_secondary_cta_label" varchar,
  	"cta_secondary_cta_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_products_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "products_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "products_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Products',
  	"hero_title" varchar DEFAULT 'Pharmaceutical product catalogue' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_about_page_values_icon",
  	"description" varchar
  );
  
  CREATE TABLE "about_page_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "about_page_leadership" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "about_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_about_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "about_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'About us',
  	"hero_title" varchar DEFAULT 'About Azeem Pharmaceuticals' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"mission_mission" varchar,
  	"mission_vision" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "quality_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "quality_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_quality_page_pillars_icon",
  	"description" varchar
  );
  
  CREATE TABLE "quality_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "quality_page_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "quality_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "quality_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_quality_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "quality_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "quality_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Quality',
  	"hero_title" varchar DEFAULT 'Quality assurance you can trust' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "manufacturing_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "manufacturing_page_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_manufacturing_page_capabilities_icon",
  	"description" varchar
  );
  
  CREATE TABLE "manufacturing_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "manufacturing_page_contract_manufacturing_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "manufacturing_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "manufacturing_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_manufacturing_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "manufacturing_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "manufacturing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Manufacturing',
  	"hero_title" varchar DEFAULT 'World-class manufacturing infrastructure' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"contract_manufacturing_heading" varchar,
  	"contract_manufacturing_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "global_presence_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "global_presence_page_export_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_global_presence_page_export_services_icon",
  	"description" varchar
  );
  
  CREATE TABLE "global_presence_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "global_presence_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "global_presence_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_global_presence_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "global_presence_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "global_presence_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Global presence',
  	"hero_title" varchar DEFAULT 'Serving healthcare partners worldwide' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "licenses_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "licenses_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_licenses_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "licenses_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "licenses_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Compliance',
  	"hero_title" varchar DEFAULT 'Licenses, certifications & accreditations' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_departments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar
  );
  
  CREATE TABLE "contact_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_contact_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "contact_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Contact',
  	"hero_title" varchar DEFAULT 'Get in touch with our team' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"form_success_message" varchar DEFAULT 'Thank you! Our team will get back to you within one business day.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "inquiry_page_sections_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "inquiry_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"image_id" integer,
  	"layout" "enum_inquiry_page_sections_layout" DEFAULT 'imageRight'
  );
  
  CREATE TABLE "inquiry_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "inquiry_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Inquiry',
  	"hero_title" varchar DEFAULT 'Request a quotation' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_url" varchar,
  	"intro" jsonb,
  	"form_success_message" varchar DEFAULT 'Your inquiry has been received. We will send you a quotation shortly.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_active_ingredients" ADD CONSTRAINT "products_active_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_key_benefits" ADD CONSTRAINT "products_key_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_faqs" ADD CONSTRAINT "products_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_badges" ADD CONSTRAINT "_products_v_version_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_active_ingredients" ADD CONSTRAINT "_products_v_version_active_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications" ADD CONSTRAINT "_products_v_version_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_key_benefits" ADD CONSTRAINT "_products_v_version_key_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_faqs" ADD CONSTRAINT "_products_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_highlights" ADD CONSTRAINT "categories_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_faqs" ADD CONSTRAINT "categories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries_items" ADD CONSTRAINT "inquiries_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries_items" ADD CONSTRAINT "inquiries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_highlights" ADD CONSTRAINT "countries_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_faqs" ADD CONSTRAINT "countries_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries_rels" ADD CONSTRAINT "countries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_rels" ADD CONSTRAINT "countries_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_rels" ADD CONSTRAINT "countries_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities_dosage_forms" ADD CONSTRAINT "facilities_dosage_forms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_capabilities" ADD CONSTRAINT "facilities_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_capacity" ADD CONSTRAINT "facilities_capacity_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_socials" ADD CONSTRAINT "site_settings_contact_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_seo_same_as" ADD CONSTRAINT "site_settings_seo_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_seo_knows_about" ADD CONSTRAINT "site_settings_seo_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_image_id_media_id_fk" FOREIGN KEY ("seo_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_stats" ADD CONSTRAINT "homepage_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_us" ADD CONSTRAINT "homepage_why_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_manufacturing_section_bullets" ADD CONSTRAINT "homepage_manufacturing_section_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_testimonials" ADD CONSTRAINT "homepage_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faqs" ADD CONSTRAINT "homepage_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_manufacturing_section_image_id_media_id_fk" FOREIGN KEY ("manufacturing_section_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_page_sections_bullets" ADD CONSTRAINT "products_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_page_sections" ADD CONSTRAINT "products_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_page_sections" ADD CONSTRAINT "products_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_page_faqs" ADD CONSTRAINT "products_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_page" ADD CONSTRAINT "products_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_page" ADD CONSTRAINT "products_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_stats" ADD CONSTRAINT "about_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_milestones" ADD CONSTRAINT "about_page_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_leadership" ADD CONSTRAINT "about_page_leadership_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_leadership" ADD CONSTRAINT "about_page_leadership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_sections_bullets" ADD CONSTRAINT "about_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_sections" ADD CONSTRAINT "about_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_sections" ADD CONSTRAINT "about_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_faqs" ADD CONSTRAINT "about_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quality_page_stats" ADD CONSTRAINT "quality_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_pillars" ADD CONSTRAINT "quality_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_process" ADD CONSTRAINT "quality_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_standards" ADD CONSTRAINT "quality_page_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_sections_bullets" ADD CONSTRAINT "quality_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_sections" ADD CONSTRAINT "quality_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quality_page_sections" ADD CONSTRAINT "quality_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page_faqs" ADD CONSTRAINT "quality_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_page" ADD CONSTRAINT "quality_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quality_page" ADD CONSTRAINT "quality_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_page_stats" ADD CONSTRAINT "manufacturing_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_capabilities" ADD CONSTRAINT "manufacturing_page_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_process" ADD CONSTRAINT "manufacturing_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_contract_manufacturing_bullets" ADD CONSTRAINT "manufacturing_page_contract_manufacturing_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_sections_bullets" ADD CONSTRAINT "manufacturing_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_sections" ADD CONSTRAINT "manufacturing_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_page_sections" ADD CONSTRAINT "manufacturing_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page_faqs" ADD CONSTRAINT "manufacturing_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manufacturing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "manufacturing_page" ADD CONSTRAINT "manufacturing_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manufacturing_page" ADD CONSTRAINT "manufacturing_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_presence_page_stats" ADD CONSTRAINT "global_presence_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page_export_services" ADD CONSTRAINT "global_presence_page_export_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page_process" ADD CONSTRAINT "global_presence_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page_sections_bullets" ADD CONSTRAINT "global_presence_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page_sections" ADD CONSTRAINT "global_presence_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_presence_page_sections" ADD CONSTRAINT "global_presence_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page_faqs" ADD CONSTRAINT "global_presence_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_presence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_presence_page" ADD CONSTRAINT "global_presence_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_presence_page" ADD CONSTRAINT "global_presence_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses_page_sections_bullets" ADD CONSTRAINT "licenses_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."licenses_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "licenses_page_sections" ADD CONSTRAINT "licenses_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses_page_sections" ADD CONSTRAINT "licenses_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."licenses_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "licenses_page_faqs" ADD CONSTRAINT "licenses_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."licenses_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "licenses_page" ADD CONSTRAINT "licenses_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "licenses_page" ADD CONSTRAINT "licenses_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_departments" ADD CONSTRAINT "contact_page_departments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_sections_bullets" ADD CONSTRAINT "contact_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_sections" ADD CONSTRAINT "contact_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_sections" ADD CONSTRAINT "contact_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_faqs" ADD CONSTRAINT "contact_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiry_page_sections_bullets" ADD CONSTRAINT "inquiry_page_sections_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_page_sections" ADD CONSTRAINT "inquiry_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiry_page_sections" ADD CONSTRAINT "inquiry_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_page_faqs" ADD CONSTRAINT "inquiry_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_page" ADD CONSTRAINT "inquiry_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiry_page" ADD CONSTRAINT "inquiry_page_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_active_ingredients_order_idx" ON "products_active_ingredients" USING btree ("_order");
  CREATE INDEX "products_active_ingredients_parent_id_idx" ON "products_active_ingredients" USING btree ("_parent_id");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE INDEX "products_key_benefits_order_idx" ON "products_key_benefits" USING btree ("_order");
  CREATE INDEX "products_key_benefits_parent_id_idx" ON "products_key_benefits" USING btree ("_parent_id");
  CREATE INDEX "products_faqs_order_idx" ON "products_faqs" USING btree ("_order");
  CREATE INDEX "products_faqs_parent_id_idx" ON "products_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_generic_name_idx" ON "products" USING btree ("generic_name");
  CREATE INDEX "products_dosage_form_idx" ON "products" USING btree ("dosage_form");
  CREATE INDEX "products_prescription_status_idx" ON "products" USING btree ("prescription_status");
  CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_version_badges_order_idx" ON "_products_v_version_badges" USING btree ("order");
  CREATE INDEX "_products_v_version_badges_parent_idx" ON "_products_v_version_badges" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_active_ingredients_order_idx" ON "_products_v_version_active_ingredients" USING btree ("_order");
  CREATE INDEX "_products_v_version_active_ingredients_parent_id_idx" ON "_products_v_version_active_ingredients" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specifications_order_idx" ON "_products_v_version_specifications" USING btree ("_order");
  CREATE INDEX "_products_v_version_specifications_parent_id_idx" ON "_products_v_version_specifications" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_key_benefits_order_idx" ON "_products_v_version_key_benefits" USING btree ("_order");
  CREATE INDEX "_products_v_version_key_benefits_parent_id_idx" ON "_products_v_version_key_benefits" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_faqs_order_idx" ON "_products_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_products_v_version_faqs_parent_id_idx" ON "_products_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_generic_name_idx" ON "_products_v" USING btree ("version_generic_name");
  CREATE INDEX "_products_v_version_version_dosage_form_idx" ON "_products_v" USING btree ("version_dosage_form");
  CREATE INDEX "_products_v_version_version_prescription_status_idx" ON "_products_v" USING btree ("version_prescription_status");
  CREATE INDEX "_products_v_version_version_sku_idx" ON "_products_v" USING btree ("version_sku");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "categories_highlights_order_idx" ON "categories_highlights" USING btree ("_order");
  CREATE INDEX "categories_highlights_parent_id_idx" ON "categories_highlights" USING btree ("_parent_id");
  CREATE INDEX "categories_faqs_order_idx" ON "categories_faqs" USING btree ("_order");
  CREATE INDEX "categories_faqs_parent_id_idx" ON "categories_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_path_idx" ON "categories" USING btree ("path");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories" USING btree ("meta_image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "inquiries_items_order_idx" ON "inquiries_items" USING btree ("_order");
  CREATE INDEX "inquiries_items_parent_id_idx" ON "inquiries_items" USING btree ("_parent_id");
  CREATE INDEX "inquiries_items_product_idx" ON "inquiries_items" USING btree ("product_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "countries_highlights_order_idx" ON "countries_highlights" USING btree ("_order");
  CREATE INDEX "countries_highlights_parent_id_idx" ON "countries_highlights" USING btree ("_parent_id");
  CREATE INDEX "countries_faqs_order_idx" ON "countries_faqs" USING btree ("_order");
  CREATE INDEX "countries_faqs_parent_id_idx" ON "countries_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE INDEX "countries_image_idx" ON "countries" USING btree ("image_id");
  CREATE INDEX "countries_meta_meta_image_idx" ON "countries" USING btree ("meta_image_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE INDEX "countries_rels_order_idx" ON "countries_rels" USING btree ("order");
  CREATE INDEX "countries_rels_parent_idx" ON "countries_rels" USING btree ("parent_id");
  CREATE INDEX "countries_rels_path_idx" ON "countries_rels" USING btree ("path");
  CREATE INDEX "countries_rels_categories_id_idx" ON "countries_rels" USING btree ("categories_id");
  CREATE INDEX "countries_rels_products_id_idx" ON "countries_rels" USING btree ("products_id");
  CREATE INDEX "certifications_image_idx" ON "certifications" USING btree ("image_id");
  CREATE INDEX "certifications_document_idx" ON "certifications" USING btree ("document_id");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE INDEX "facilities_dosage_forms_order_idx" ON "facilities_dosage_forms" USING btree ("order");
  CREATE INDEX "facilities_dosage_forms_parent_idx" ON "facilities_dosage_forms" USING btree ("parent_id");
  CREATE INDEX "facilities_capabilities_order_idx" ON "facilities_capabilities" USING btree ("_order");
  CREATE INDEX "facilities_capabilities_parent_id_idx" ON "facilities_capabilities" USING btree ("_parent_id");
  CREATE INDEX "facilities_capacity_order_idx" ON "facilities_capacity" USING btree ("_order");
  CREATE INDEX "facilities_capacity_parent_id_idx" ON "facilities_capacity" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "facilities_slug_idx" ON "facilities" USING btree ("slug");
  CREATE INDEX "facilities_updated_at_idx" ON "facilities" USING btree ("updated_at");
  CREATE INDEX "facilities_created_at_idx" ON "facilities" USING btree ("created_at");
  CREATE INDEX "facilities_rels_order_idx" ON "facilities_rels" USING btree ("order");
  CREATE INDEX "facilities_rels_parent_idx" ON "facilities_rels" USING btree ("parent_id");
  CREATE INDEX "facilities_rels_path_idx" ON "facilities_rels" USING btree ("path");
  CREATE INDEX "facilities_rels_certifications_id_idx" ON "facilities_rels" USING btree ("certifications_id");
  CREATE INDEX "facilities_rels_media_id_idx" ON "facilities_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_contact_socials_order_idx" ON "site_settings_contact_socials" USING btree ("_order");
  CREATE INDEX "site_settings_contact_socials_parent_id_idx" ON "site_settings_contact_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_same_as_order_idx" ON "site_settings_seo_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_seo_same_as_parent_id_idx" ON "site_settings_seo_same_as" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_knows_about_order_idx" ON "site_settings_seo_knows_about" USING btree ("_order");
  CREATE INDEX "site_settings_seo_knows_about_parent_id_idx" ON "site_settings_seo_knows_about" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_seo_seo_default_image_idx" ON "site_settings" USING btree ("seo_default_image_id");
  CREATE INDEX "homepage_stats_order_idx" ON "homepage_stats" USING btree ("_order");
  CREATE INDEX "homepage_stats_parent_id_idx" ON "homepage_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_us_order_idx" ON "homepage_why_us" USING btree ("_order");
  CREATE INDEX "homepage_why_us_parent_id_idx" ON "homepage_why_us" USING btree ("_parent_id");
  CREATE INDEX "homepage_manufacturing_section_bullets_order_idx" ON "homepage_manufacturing_section_bullets" USING btree ("_order");
  CREATE INDEX "homepage_manufacturing_section_bullets_parent_id_idx" ON "homepage_manufacturing_section_bullets" USING btree ("_parent_id");
  CREATE INDEX "homepage_testimonials_order_idx" ON "homepage_testimonials" USING btree ("_order");
  CREATE INDEX "homepage_testimonials_parent_id_idx" ON "homepage_testimonials" USING btree ("_parent_id");
  CREATE INDEX "homepage_faqs_order_idx" ON "homepage_faqs" USING btree ("_order");
  CREATE INDEX "homepage_faqs_parent_id_idx" ON "homepage_faqs" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_intro_intro_image_idx" ON "homepage" USING btree ("intro_image_id");
  CREATE INDEX "homepage_manufacturing_section_manufacturing_section_ima_idx" ON "homepage" USING btree ("manufacturing_section_image_id");
  CREATE INDEX "homepage_meta_meta_image_idx" ON "homepage" USING btree ("meta_image_id");
  CREATE INDEX "products_page_sections_bullets_order_idx" ON "products_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "products_page_sections_bullets_parent_id_idx" ON "products_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "products_page_sections_order_idx" ON "products_page_sections" USING btree ("_order");
  CREATE INDEX "products_page_sections_parent_id_idx" ON "products_page_sections" USING btree ("_parent_id");
  CREATE INDEX "products_page_sections_image_idx" ON "products_page_sections" USING btree ("image_id");
  CREATE INDEX "products_page_faqs_order_idx" ON "products_page_faqs" USING btree ("_order");
  CREATE INDEX "products_page_faqs_parent_id_idx" ON "products_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "products_page_hero_hero_image_idx" ON "products_page" USING btree ("hero_image_id");
  CREATE INDEX "products_page_meta_meta_image_idx" ON "products_page" USING btree ("meta_image_id");
  CREATE INDEX "about_page_stats_order_idx" ON "about_page_stats" USING btree ("_order");
  CREATE INDEX "about_page_stats_parent_id_idx" ON "about_page_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_milestones_order_idx" ON "about_page_milestones" USING btree ("_order");
  CREATE INDEX "about_page_milestones_parent_id_idx" ON "about_page_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_page_leadership_order_idx" ON "about_page_leadership" USING btree ("_order");
  CREATE INDEX "about_page_leadership_parent_id_idx" ON "about_page_leadership" USING btree ("_parent_id");
  CREATE INDEX "about_page_leadership_photo_idx" ON "about_page_leadership" USING btree ("photo_id");
  CREATE INDEX "about_page_sections_bullets_order_idx" ON "about_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "about_page_sections_bullets_parent_id_idx" ON "about_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "about_page_sections_order_idx" ON "about_page_sections" USING btree ("_order");
  CREATE INDEX "about_page_sections_parent_id_idx" ON "about_page_sections" USING btree ("_parent_id");
  CREATE INDEX "about_page_sections_image_idx" ON "about_page_sections" USING btree ("image_id");
  CREATE INDEX "about_page_faqs_order_idx" ON "about_page_faqs" USING btree ("_order");
  CREATE INDEX "about_page_faqs_parent_id_idx" ON "about_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_meta_meta_image_idx" ON "about_page" USING btree ("meta_image_id");
  CREATE INDEX "quality_page_stats_order_idx" ON "quality_page_stats" USING btree ("_order");
  CREATE INDEX "quality_page_stats_parent_id_idx" ON "quality_page_stats" USING btree ("_parent_id");
  CREATE INDEX "quality_page_pillars_order_idx" ON "quality_page_pillars" USING btree ("_order");
  CREATE INDEX "quality_page_pillars_parent_id_idx" ON "quality_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "quality_page_process_order_idx" ON "quality_page_process" USING btree ("_order");
  CREATE INDEX "quality_page_process_parent_id_idx" ON "quality_page_process" USING btree ("_parent_id");
  CREATE INDEX "quality_page_standards_order_idx" ON "quality_page_standards" USING btree ("_order");
  CREATE INDEX "quality_page_standards_parent_id_idx" ON "quality_page_standards" USING btree ("_parent_id");
  CREATE INDEX "quality_page_sections_bullets_order_idx" ON "quality_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "quality_page_sections_bullets_parent_id_idx" ON "quality_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "quality_page_sections_order_idx" ON "quality_page_sections" USING btree ("_order");
  CREATE INDEX "quality_page_sections_parent_id_idx" ON "quality_page_sections" USING btree ("_parent_id");
  CREATE INDEX "quality_page_sections_image_idx" ON "quality_page_sections" USING btree ("image_id");
  CREATE INDEX "quality_page_faqs_order_idx" ON "quality_page_faqs" USING btree ("_order");
  CREATE INDEX "quality_page_faqs_parent_id_idx" ON "quality_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "quality_page_hero_hero_image_idx" ON "quality_page" USING btree ("hero_image_id");
  CREATE INDEX "quality_page_meta_meta_image_idx" ON "quality_page" USING btree ("meta_image_id");
  CREATE INDEX "manufacturing_page_stats_order_idx" ON "manufacturing_page_stats" USING btree ("_order");
  CREATE INDEX "manufacturing_page_stats_parent_id_idx" ON "manufacturing_page_stats" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_capabilities_order_idx" ON "manufacturing_page_capabilities" USING btree ("_order");
  CREATE INDEX "manufacturing_page_capabilities_parent_id_idx" ON "manufacturing_page_capabilities" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_process_order_idx" ON "manufacturing_page_process" USING btree ("_order");
  CREATE INDEX "manufacturing_page_process_parent_id_idx" ON "manufacturing_page_process" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_contract_manufacturing_bullets_order_idx" ON "manufacturing_page_contract_manufacturing_bullets" USING btree ("_order");
  CREATE INDEX "manufacturing_page_contract_manufacturing_bullets_parent_id_idx" ON "manufacturing_page_contract_manufacturing_bullets" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_sections_bullets_order_idx" ON "manufacturing_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "manufacturing_page_sections_bullets_parent_id_idx" ON "manufacturing_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_sections_order_idx" ON "manufacturing_page_sections" USING btree ("_order");
  CREATE INDEX "manufacturing_page_sections_parent_id_idx" ON "manufacturing_page_sections" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_sections_image_idx" ON "manufacturing_page_sections" USING btree ("image_id");
  CREATE INDEX "manufacturing_page_faqs_order_idx" ON "manufacturing_page_faqs" USING btree ("_order");
  CREATE INDEX "manufacturing_page_faqs_parent_id_idx" ON "manufacturing_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "manufacturing_page_hero_hero_image_idx" ON "manufacturing_page" USING btree ("hero_image_id");
  CREATE INDEX "manufacturing_page_meta_meta_image_idx" ON "manufacturing_page" USING btree ("meta_image_id");
  CREATE INDEX "global_presence_page_stats_order_idx" ON "global_presence_page_stats" USING btree ("_order");
  CREATE INDEX "global_presence_page_stats_parent_id_idx" ON "global_presence_page_stats" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_export_services_order_idx" ON "global_presence_page_export_services" USING btree ("_order");
  CREATE INDEX "global_presence_page_export_services_parent_id_idx" ON "global_presence_page_export_services" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_process_order_idx" ON "global_presence_page_process" USING btree ("_order");
  CREATE INDEX "global_presence_page_process_parent_id_idx" ON "global_presence_page_process" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_sections_bullets_order_idx" ON "global_presence_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "global_presence_page_sections_bullets_parent_id_idx" ON "global_presence_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_sections_order_idx" ON "global_presence_page_sections" USING btree ("_order");
  CREATE INDEX "global_presence_page_sections_parent_id_idx" ON "global_presence_page_sections" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_sections_image_idx" ON "global_presence_page_sections" USING btree ("image_id");
  CREATE INDEX "global_presence_page_faqs_order_idx" ON "global_presence_page_faqs" USING btree ("_order");
  CREATE INDEX "global_presence_page_faqs_parent_id_idx" ON "global_presence_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "global_presence_page_hero_hero_image_idx" ON "global_presence_page" USING btree ("hero_image_id");
  CREATE INDEX "global_presence_page_meta_meta_image_idx" ON "global_presence_page" USING btree ("meta_image_id");
  CREATE INDEX "licenses_page_sections_bullets_order_idx" ON "licenses_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "licenses_page_sections_bullets_parent_id_idx" ON "licenses_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "licenses_page_sections_order_idx" ON "licenses_page_sections" USING btree ("_order");
  CREATE INDEX "licenses_page_sections_parent_id_idx" ON "licenses_page_sections" USING btree ("_parent_id");
  CREATE INDEX "licenses_page_sections_image_idx" ON "licenses_page_sections" USING btree ("image_id");
  CREATE INDEX "licenses_page_faqs_order_idx" ON "licenses_page_faqs" USING btree ("_order");
  CREATE INDEX "licenses_page_faqs_parent_id_idx" ON "licenses_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "licenses_page_hero_hero_image_idx" ON "licenses_page" USING btree ("hero_image_id");
  CREATE INDEX "licenses_page_meta_meta_image_idx" ON "licenses_page" USING btree ("meta_image_id");
  CREATE INDEX "contact_page_departments_order_idx" ON "contact_page_departments" USING btree ("_order");
  CREATE INDEX "contact_page_departments_parent_id_idx" ON "contact_page_departments" USING btree ("_parent_id");
  CREATE INDEX "contact_page_sections_bullets_order_idx" ON "contact_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "contact_page_sections_bullets_parent_id_idx" ON "contact_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "contact_page_sections_order_idx" ON "contact_page_sections" USING btree ("_order");
  CREATE INDEX "contact_page_sections_parent_id_idx" ON "contact_page_sections" USING btree ("_parent_id");
  CREATE INDEX "contact_page_sections_image_idx" ON "contact_page_sections" USING btree ("image_id");
  CREATE INDEX "contact_page_faqs_order_idx" ON "contact_page_faqs" USING btree ("_order");
  CREATE INDEX "contact_page_faqs_parent_id_idx" ON "contact_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "contact_page_hero_hero_image_idx" ON "contact_page" USING btree ("hero_image_id");
  CREATE INDEX "contact_page_meta_meta_image_idx" ON "contact_page" USING btree ("meta_image_id");
  CREATE INDEX "inquiry_page_sections_bullets_order_idx" ON "inquiry_page_sections_bullets" USING btree ("_order");
  CREATE INDEX "inquiry_page_sections_bullets_parent_id_idx" ON "inquiry_page_sections_bullets" USING btree ("_parent_id");
  CREATE INDEX "inquiry_page_sections_order_idx" ON "inquiry_page_sections" USING btree ("_order");
  CREATE INDEX "inquiry_page_sections_parent_id_idx" ON "inquiry_page_sections" USING btree ("_parent_id");
  CREATE INDEX "inquiry_page_sections_image_idx" ON "inquiry_page_sections" USING btree ("image_id");
  CREATE INDEX "inquiry_page_faqs_order_idx" ON "inquiry_page_faqs" USING btree ("_order");
  CREATE INDEX "inquiry_page_faqs_parent_id_idx" ON "inquiry_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "inquiry_page_hero_hero_image_idx" ON "inquiry_page" USING btree ("hero_image_id");
  CREATE INDEX "inquiry_page_meta_meta_image_idx" ON "inquiry_page" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products_active_ingredients" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products_key_benefits" CASCADE;
  DROP TABLE "products_faqs" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_badges" CASCADE;
  DROP TABLE "_products_v_version_active_ingredients" CASCADE;
  DROP TABLE "_products_v_version_specifications" CASCADE;
  DROP TABLE "_products_v_version_key_benefits" CASCADE;
  DROP TABLE "_products_v_version_faqs" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "categories_highlights" CASCADE;
  DROP TABLE "categories_faqs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "inquiries_items" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "countries_highlights" CASCADE;
  DROP TABLE "countries_faqs" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "countries_rels" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "facilities_dosage_forms" CASCADE;
  DROP TABLE "facilities_capabilities" CASCADE;
  DROP TABLE "facilities_capacity" CASCADE;
  DROP TABLE "facilities" CASCADE;
  DROP TABLE "facilities_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_contact_socials" CASCADE;
  DROP TABLE "site_settings_seo_same_as" CASCADE;
  DROP TABLE "site_settings_seo_knows_about" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "homepage_stats" CASCADE;
  DROP TABLE "homepage_why_us" CASCADE;
  DROP TABLE "homepage_manufacturing_section_bullets" CASCADE;
  DROP TABLE "homepage_testimonials" CASCADE;
  DROP TABLE "homepage_faqs" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "products_page_sections_bullets" CASCADE;
  DROP TABLE "products_page_sections" CASCADE;
  DROP TABLE "products_page_faqs" CASCADE;
  DROP TABLE "products_page" CASCADE;
  DROP TABLE "about_page_stats" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_milestones" CASCADE;
  DROP TABLE "about_page_leadership" CASCADE;
  DROP TABLE "about_page_sections_bullets" CASCADE;
  DROP TABLE "about_page_sections" CASCADE;
  DROP TABLE "about_page_faqs" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "quality_page_stats" CASCADE;
  DROP TABLE "quality_page_pillars" CASCADE;
  DROP TABLE "quality_page_process" CASCADE;
  DROP TABLE "quality_page_standards" CASCADE;
  DROP TABLE "quality_page_sections_bullets" CASCADE;
  DROP TABLE "quality_page_sections" CASCADE;
  DROP TABLE "quality_page_faqs" CASCADE;
  DROP TABLE "quality_page" CASCADE;
  DROP TABLE "manufacturing_page_stats" CASCADE;
  DROP TABLE "manufacturing_page_capabilities" CASCADE;
  DROP TABLE "manufacturing_page_process" CASCADE;
  DROP TABLE "manufacturing_page_contract_manufacturing_bullets" CASCADE;
  DROP TABLE "manufacturing_page_sections_bullets" CASCADE;
  DROP TABLE "manufacturing_page_sections" CASCADE;
  DROP TABLE "manufacturing_page_faqs" CASCADE;
  DROP TABLE "manufacturing_page" CASCADE;
  DROP TABLE "global_presence_page_stats" CASCADE;
  DROP TABLE "global_presence_page_export_services" CASCADE;
  DROP TABLE "global_presence_page_process" CASCADE;
  DROP TABLE "global_presence_page_sections_bullets" CASCADE;
  DROP TABLE "global_presence_page_sections" CASCADE;
  DROP TABLE "global_presence_page_faqs" CASCADE;
  DROP TABLE "global_presence_page" CASCADE;
  DROP TABLE "licenses_page_sections_bullets" CASCADE;
  DROP TABLE "licenses_page_sections" CASCADE;
  DROP TABLE "licenses_page_faqs" CASCADE;
  DROP TABLE "licenses_page" CASCADE;
  DROP TABLE "contact_page_departments" CASCADE;
  DROP TABLE "contact_page_sections_bullets" CASCADE;
  DROP TABLE "contact_page_sections" CASCADE;
  DROP TABLE "contact_page_faqs" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "inquiry_page_sections_bullets" CASCADE;
  DROP TABLE "inquiry_page_sections" CASCADE;
  DROP TABLE "inquiry_page_faqs" CASCADE;
  DROP TABLE "inquiry_page" CASCADE;
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_dosage_form";
  DROP TYPE "public"."enum_products_prescription_status";
  DROP TYPE "public"."enum_products_route";
  DROP TYPE "public"."enum_products_show_price";
  DROP TYPE "public"."enum_products_availability";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_badges";
  DROP TYPE "public"."enum__products_v_version_dosage_form";
  DROP TYPE "public"."enum__products_v_version_prescription_status";
  DROP TYPE "public"."enum__products_v_version_route";
  DROP TYPE "public"."enum__products_v_version_show_price";
  DROP TYPE "public"."enum__products_v_version_availability";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_categories_icon";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_source";
  DROP TYPE "public"."enum_countries_region";
  DROP TYPE "public"."enum_certifications_type";
  DROP TYPE "public"."enum_facilities_dosage_forms";
  DROP TYPE "public"."enum_facilities_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_site_settings_contact_socials_platform";
  DROP TYPE "public"."enum_site_settings_commerce_mode";
  DROP TYPE "public"."enum_site_settings_commerce_currency";
  DROP TYPE "public"."enum_homepage_why_us_icon";
  DROP TYPE "public"."enum_products_page_sections_layout";
  DROP TYPE "public"."enum_about_page_values_icon";
  DROP TYPE "public"."enum_about_page_sections_layout";
  DROP TYPE "public"."enum_quality_page_pillars_icon";
  DROP TYPE "public"."enum_quality_page_sections_layout";
  DROP TYPE "public"."enum_manufacturing_page_capabilities_icon";
  DROP TYPE "public"."enum_manufacturing_page_sections_layout";
  DROP TYPE "public"."enum_global_presence_page_export_services_icon";
  DROP TYPE "public"."enum_global_presence_page_sections_layout";
  DROP TYPE "public"."enum_licenses_page_sections_layout";
  DROP TYPE "public"."enum_contact_page_sections_layout";
  DROP TYPE "public"."enum_inquiry_page_sections_layout";`)
}
