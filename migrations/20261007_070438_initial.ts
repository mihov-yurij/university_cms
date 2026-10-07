import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('uk', 'en');
  CREATE TYPE "public"."enum_institutes_blocks_rich_text_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_pull_quote_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_video_embed_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_pill_links_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_institutes_blocks_pill_links_source" AS ENUM('manual', 'specialities');
  CREATE TYPE "public"."enum_institutes_blocks_pill_links_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_stats_band_source" AS ENUM('manual', 'specialities');
  CREATE TYPE "public"."enum_institutes_blocks_stats_band_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_person_card_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_staff_list_source" AS ENUM('manual', 'institute', 'department');
  CREATE TYPE "public"."enum_institutes_blocks_staff_list_variant" AS ENUM('grid', 'carousel', 'rows', 'compact');
  CREATE TYPE "public"."enum_institutes_blocks_staff_list_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_institutes_blocks_contact_block_socials_platform" AS ENUM('facebook', 'instagram', 'youtube', 'telegram', 'whatsapp', 'linkedin', 'x');
  CREATE TYPE "public"."enum_institutes_blocks_contact_block_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_rich_text_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_pull_quote_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_video_embed_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_pill_links_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_departments_blocks_pill_links_source" AS ENUM('manual', 'specialities');
  CREATE TYPE "public"."enum_departments_blocks_pill_links_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_stats_band_source" AS ENUM('manual', 'specialities');
  CREATE TYPE "public"."enum_departments_blocks_stats_band_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_person_card_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_staff_list_source" AS ENUM('manual', 'institute', 'department');
  CREATE TYPE "public"."enum_departments_blocks_staff_list_variant" AS ENUM('grid', 'carousel', 'rows', 'compact');
  CREATE TYPE "public"."enum_departments_blocks_staff_list_width" AS ENUM('auto', 'content', 'full');
  CREATE TYPE "public"."enum_departments_blocks_contact_block_socials_platform" AS ENUM('facebook', 'instagram', 'youtube', 'telegram', 'whatsapp', 'linkedin', 'x');
  CREATE TYPE "public"."enum_departments_blocks_contact_block_width" AS ENUM('auto', 'content', 'full');
  CREATE TABLE "institutes_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_institutes_blocks_rich_text_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_rich_text_locales" (
  	"label" varchar,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_pull_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_institutes_blocks_pull_quote_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_pull_quote_locales" (
  	"label" varchar,
  	"text" jsonb NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"width" "enum_institutes_blocks_video_embed_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_video_embed_locales" (
  	"label" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_pill_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_institutes_blocks_pill_links_items_link_type" DEFAULT 'reference',
  	"link_url" varchar,
  	"link_anchor" varchar,
  	"link_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "institutes_blocks_pill_links_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_pill_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_institutes_blocks_pill_links_source" DEFAULT 'manual',
  	"width" "enum_institutes_blocks_pill_links_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_pill_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_stats_band_stats_locales" (
  	"value" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_institutes_blocks_stats_band_source" DEFAULT 'manual',
  	"width" "enum_institutes_blocks_stats_band_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_stats_band_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_person_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"width" "enum_institutes_blocks_person_card_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_person_card_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_staff_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_institutes_blocks_staff_list_source" DEFAULT 'manual',
  	"variant" "enum_institutes_blocks_staff_list_variant" DEFAULT 'grid' NOT NULL,
  	"initial_visible" numeric,
  	"width" "enum_institutes_blocks_staff_list_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_staff_list_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_contact_block_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_contact_block_phones_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_contact_block_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_institutes_blocks_contact_block_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "institutes_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"width" "enum_institutes_blocks_contact_block_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "institutes_blocks_contact_block_locales" (
  	"label" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "institutes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric,
  	"image_id" integer,
  	"homepage_image_id" integer,
  	"contacts_phone" varchar,
  	"contacts_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "institutes_locales" (
  	"name" varchar NOT NULL,
  	"short_name" varchar,
  	"contacts_address" varchar,
  	"contacts_room" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "institutes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"institutes_id" integer,
  	"teachers_id" integer
  );
  
  CREATE TABLE "departments_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_departments_blocks_rich_text_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_rich_text_locales" (
  	"label" varchar,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_pull_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_departments_blocks_pull_quote_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_pull_quote_locales" (
  	"label" varchar,
  	"text" jsonb NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"width" "enum_departments_blocks_video_embed_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_video_embed_locales" (
  	"label" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_pill_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_departments_blocks_pill_links_items_link_type" DEFAULT 'reference',
  	"link_url" varchar,
  	"link_anchor" varchar,
  	"link_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "departments_blocks_pill_links_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_pill_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_departments_blocks_pill_links_source" DEFAULT 'manual',
  	"width" "enum_departments_blocks_pill_links_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_pill_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "departments_blocks_stats_band_stats_locales" (
  	"value" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_departments_blocks_stats_band_source" DEFAULT 'manual',
  	"width" "enum_departments_blocks_stats_band_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_stats_band_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_person_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"width" "enum_departments_blocks_person_card_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_person_card_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_staff_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_departments_blocks_staff_list_source" DEFAULT 'manual',
  	"variant" "enum_departments_blocks_staff_list_variant" DEFAULT 'grid' NOT NULL,
  	"initial_visible" numeric,
  	"width" "enum_departments_blocks_staff_list_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_staff_list_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_contact_block_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_contact_block_phones_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_contact_block_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_departments_blocks_contact_block_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "departments_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"width" "enum_departments_blocks_contact_block_width" DEFAULT 'auto',
  	"collapsible" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "departments_blocks_contact_block_locales" (
  	"label" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_clubs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"supervisor_id" integer
  );
  
  CREATE TABLE "departments_clubs_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments_labs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "departments_labs_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"equipment" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"institute_id" integer NOT NULL,
  	"order" numeric,
  	"external_url" varchar,
  	"image_id" integer,
  	"head_id" integer,
  	"contacts_phone" varchar,
  	"contacts_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departments_locales" (
  	"name" varchar NOT NULL,
  	"contacts_address" varchar,
  	"contacts_room" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "departments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"institutes_id" integer,
  	"teachers_id" integer
  );
  
  CREATE TABLE "teachers_appointments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"is_primary" boolean DEFAULT false,
  	"order" numeric
  );
  
  CREATE TABLE "teachers_appointments_locales" (
  	"position" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "teachers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"photo_id" integer,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teachers_locales" (
  	"full_name" varchar NOT NULL,
  	"degree" varchar,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "teachers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"institutes_id" integer,
  	"departments_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'media',
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
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_portrait_url" varchar,
  	"sizes_portrait_width" numeric,
  	"sizes_portrait_height" numeric,
  	"sizes_portrait_mime_type" varchar,
  	"sizes_portrait_filesize" numeric,
  	"sizes_portrait_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  	"institutes_id" integer,
  	"departments_id" integer,
  	"teachers_id" integer,
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
  
  ALTER TABLE "institutes_blocks_rich_text" ADD CONSTRAINT "institutes_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_rich_text_locales" ADD CONSTRAINT "institutes_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pull_quote" ADD CONSTRAINT "institutes_blocks_pull_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pull_quote_locales" ADD CONSTRAINT "institutes_blocks_pull_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_pull_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_video_embed" ADD CONSTRAINT "institutes_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_video_embed_locales" ADD CONSTRAINT "institutes_blocks_video_embed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_video_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pill_links_items" ADD CONSTRAINT "institutes_blocks_pill_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_pill_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pill_links_items_locales" ADD CONSTRAINT "institutes_blocks_pill_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_pill_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pill_links" ADD CONSTRAINT "institutes_blocks_pill_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_pill_links_locales" ADD CONSTRAINT "institutes_blocks_pill_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_pill_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_stats_band_stats" ADD CONSTRAINT "institutes_blocks_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_stats_band_stats_locales" ADD CONSTRAINT "institutes_blocks_stats_band_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_stats_band_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_stats_band" ADD CONSTRAINT "institutes_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_stats_band_locales" ADD CONSTRAINT "institutes_blocks_stats_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_person_card" ADD CONSTRAINT "institutes_blocks_person_card_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institutes_blocks_person_card" ADD CONSTRAINT "institutes_blocks_person_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_person_card_locales" ADD CONSTRAINT "institutes_blocks_person_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_person_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_staff_list" ADD CONSTRAINT "institutes_blocks_staff_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_staff_list_locales" ADD CONSTRAINT "institutes_blocks_staff_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_staff_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_contact_block_phones" ADD CONSTRAINT "institutes_blocks_contact_block_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_contact_block_phones_locales" ADD CONSTRAINT "institutes_blocks_contact_block_phones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_contact_block_phones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_contact_block_socials" ADD CONSTRAINT "institutes_blocks_contact_block_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_contact_block" ADD CONSTRAINT "institutes_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_blocks_contact_block_locales" ADD CONSTRAINT "institutes_blocks_contact_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes" ADD CONSTRAINT "institutes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institutes" ADD CONSTRAINT "institutes_homepage_image_id_media_id_fk" FOREIGN KEY ("homepage_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institutes_locales" ADD CONSTRAINT "institutes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_rels" ADD CONSTRAINT "institutes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_rels" ADD CONSTRAINT "institutes_rels_institutes_fk" FOREIGN KEY ("institutes_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutes_rels" ADD CONSTRAINT "institutes_rels_teachers_fk" FOREIGN KEY ("teachers_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_rich_text" ADD CONSTRAINT "departments_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_rich_text_locales" ADD CONSTRAINT "departments_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pull_quote" ADD CONSTRAINT "departments_blocks_pull_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pull_quote_locales" ADD CONSTRAINT "departments_blocks_pull_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_pull_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_video_embed" ADD CONSTRAINT "departments_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_video_embed_locales" ADD CONSTRAINT "departments_blocks_video_embed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_video_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pill_links_items" ADD CONSTRAINT "departments_blocks_pill_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_pill_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pill_links_items_locales" ADD CONSTRAINT "departments_blocks_pill_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_pill_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pill_links" ADD CONSTRAINT "departments_blocks_pill_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_pill_links_locales" ADD CONSTRAINT "departments_blocks_pill_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_pill_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_stats_band_stats" ADD CONSTRAINT "departments_blocks_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_stats_band_stats_locales" ADD CONSTRAINT "departments_blocks_stats_band_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_stats_band_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_stats_band" ADD CONSTRAINT "departments_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_stats_band_locales" ADD CONSTRAINT "departments_blocks_stats_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_person_card" ADD CONSTRAINT "departments_blocks_person_card_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_blocks_person_card" ADD CONSTRAINT "departments_blocks_person_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_person_card_locales" ADD CONSTRAINT "departments_blocks_person_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_person_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_staff_list" ADD CONSTRAINT "departments_blocks_staff_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_staff_list_locales" ADD CONSTRAINT "departments_blocks_staff_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_staff_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_contact_block_phones" ADD CONSTRAINT "departments_blocks_contact_block_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_contact_block_phones_locales" ADD CONSTRAINT "departments_blocks_contact_block_phones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_contact_block_phones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_contact_block_socials" ADD CONSTRAINT "departments_blocks_contact_block_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_contact_block" ADD CONSTRAINT "departments_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_blocks_contact_block_locales" ADD CONSTRAINT "departments_blocks_contact_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_clubs" ADD CONSTRAINT "departments_clubs_supervisor_id_teachers_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_clubs" ADD CONSTRAINT "departments_clubs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_clubs_locales" ADD CONSTRAINT "departments_clubs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_labs" ADD CONSTRAINT "departments_labs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_labs" ADD CONSTRAINT "departments_labs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_labs_locales" ADD CONSTRAINT "departments_labs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_labs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_head_id_teachers_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_locales" ADD CONSTRAINT "departments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_institutes_fk" FOREIGN KEY ("institutes_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_teachers_fk" FOREIGN KEY ("teachers_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_appointments" ADD CONSTRAINT "teachers_appointments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_appointments_locales" ADD CONSTRAINT "teachers_appointments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers_appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers" ADD CONSTRAINT "teachers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teachers_locales" ADD CONSTRAINT "teachers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_rels" ADD CONSTRAINT "teachers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_rels" ADD CONSTRAINT "teachers_rels_institutes_fk" FOREIGN KEY ("institutes_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_rels" ADD CONSTRAINT "teachers_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutes_fk" FOREIGN KEY ("institutes_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teachers_fk" FOREIGN KEY ("teachers_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "institutes_blocks_rich_text_order_idx" ON "institutes_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "institutes_blocks_rich_text_parent_id_idx" ON "institutes_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_rich_text_path_idx" ON "institutes_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_rich_text_locales_locale_parent_id_unique" ON "institutes_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_pull_quote_order_idx" ON "institutes_blocks_pull_quote" USING btree ("_order");
  CREATE INDEX "institutes_blocks_pull_quote_parent_id_idx" ON "institutes_blocks_pull_quote" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_pull_quote_path_idx" ON "institutes_blocks_pull_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_pull_quote_locales_locale_parent_id_unique" ON "institutes_blocks_pull_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_video_embed_order_idx" ON "institutes_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "institutes_blocks_video_embed_parent_id_idx" ON "institutes_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_video_embed_path_idx" ON "institutes_blocks_video_embed" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_video_embed_locales_locale_parent_id_uniqu" ON "institutes_blocks_video_embed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_pill_links_items_order_idx" ON "institutes_blocks_pill_links_items" USING btree ("_order");
  CREATE INDEX "institutes_blocks_pill_links_items_parent_id_idx" ON "institutes_blocks_pill_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "institutes_blocks_pill_links_items_locales_locale_parent_id_" ON "institutes_blocks_pill_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_pill_links_order_idx" ON "institutes_blocks_pill_links" USING btree ("_order");
  CREATE INDEX "institutes_blocks_pill_links_parent_id_idx" ON "institutes_blocks_pill_links" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_pill_links_path_idx" ON "institutes_blocks_pill_links" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_pill_links_locales_locale_parent_id_unique" ON "institutes_blocks_pill_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_stats_band_stats_order_idx" ON "institutes_blocks_stats_band_stats" USING btree ("_order");
  CREATE INDEX "institutes_blocks_stats_band_stats_parent_id_idx" ON "institutes_blocks_stats_band_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "institutes_blocks_stats_band_stats_locales_locale_parent_id_" ON "institutes_blocks_stats_band_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_stats_band_order_idx" ON "institutes_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "institutes_blocks_stats_band_parent_id_idx" ON "institutes_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_stats_band_path_idx" ON "institutes_blocks_stats_band" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_stats_band_locales_locale_parent_id_unique" ON "institutes_blocks_stats_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_person_card_order_idx" ON "institutes_blocks_person_card" USING btree ("_order");
  CREATE INDEX "institutes_blocks_person_card_parent_id_idx" ON "institutes_blocks_person_card" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_person_card_path_idx" ON "institutes_blocks_person_card" USING btree ("_path");
  CREATE INDEX "institutes_blocks_person_card_teacher_idx" ON "institutes_blocks_person_card" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "institutes_blocks_person_card_locales_locale_parent_id_uniqu" ON "institutes_blocks_person_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_staff_list_order_idx" ON "institutes_blocks_staff_list" USING btree ("_order");
  CREATE INDEX "institutes_blocks_staff_list_parent_id_idx" ON "institutes_blocks_staff_list" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_staff_list_path_idx" ON "institutes_blocks_staff_list" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_staff_list_locales_locale_parent_id_unique" ON "institutes_blocks_staff_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_contact_block_phones_order_idx" ON "institutes_blocks_contact_block_phones" USING btree ("_order");
  CREATE INDEX "institutes_blocks_contact_block_phones_parent_id_idx" ON "institutes_blocks_contact_block_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "institutes_blocks_contact_block_phones_locales_locale_parent" ON "institutes_blocks_contact_block_phones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_blocks_contact_block_socials_order_idx" ON "institutes_blocks_contact_block_socials" USING btree ("_order");
  CREATE INDEX "institutes_blocks_contact_block_socials_parent_id_idx" ON "institutes_blocks_contact_block_socials" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_contact_block_order_idx" ON "institutes_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "institutes_blocks_contact_block_parent_id_idx" ON "institutes_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "institutes_blocks_contact_block_path_idx" ON "institutes_blocks_contact_block" USING btree ("_path");
  CREATE UNIQUE INDEX "institutes_blocks_contact_block_locales_locale_parent_id_uni" ON "institutes_blocks_contact_block_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "institutes_slug_idx" ON "institutes" USING btree ("slug");
  CREATE INDEX "institutes_image_idx" ON "institutes" USING btree ("image_id");
  CREATE INDEX "institutes_homepage_image_idx" ON "institutes" USING btree ("homepage_image_id");
  CREATE INDEX "institutes_updated_at_idx" ON "institutes" USING btree ("updated_at");
  CREATE INDEX "institutes_created_at_idx" ON "institutes" USING btree ("created_at");
  CREATE UNIQUE INDEX "institutes_locales_locale_parent_id_unique" ON "institutes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "institutes_rels_order_idx" ON "institutes_rels" USING btree ("order");
  CREATE INDEX "institutes_rels_parent_idx" ON "institutes_rels" USING btree ("parent_id");
  CREATE INDEX "institutes_rels_path_idx" ON "institutes_rels" USING btree ("path");
  CREATE INDEX "institutes_rels_institutes_id_idx" ON "institutes_rels" USING btree ("institutes_id");
  CREATE INDEX "institutes_rels_teachers_id_idx" ON "institutes_rels" USING btree ("teachers_id");
  CREATE INDEX "departments_blocks_rich_text_order_idx" ON "departments_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "departments_blocks_rich_text_parent_id_idx" ON "departments_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_rich_text_path_idx" ON "departments_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_rich_text_locales_locale_parent_id_unique" ON "departments_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_pull_quote_order_idx" ON "departments_blocks_pull_quote" USING btree ("_order");
  CREATE INDEX "departments_blocks_pull_quote_parent_id_idx" ON "departments_blocks_pull_quote" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_pull_quote_path_idx" ON "departments_blocks_pull_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_pull_quote_locales_locale_parent_id_uniqu" ON "departments_blocks_pull_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_video_embed_order_idx" ON "departments_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "departments_blocks_video_embed_parent_id_idx" ON "departments_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_video_embed_path_idx" ON "departments_blocks_video_embed" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_video_embed_locales_locale_parent_id_uniq" ON "departments_blocks_video_embed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_pill_links_items_order_idx" ON "departments_blocks_pill_links_items" USING btree ("_order");
  CREATE INDEX "departments_blocks_pill_links_items_parent_id_idx" ON "departments_blocks_pill_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "departments_blocks_pill_links_items_locales_locale_parent_id" ON "departments_blocks_pill_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_pill_links_order_idx" ON "departments_blocks_pill_links" USING btree ("_order");
  CREATE INDEX "departments_blocks_pill_links_parent_id_idx" ON "departments_blocks_pill_links" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_pill_links_path_idx" ON "departments_blocks_pill_links" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_pill_links_locales_locale_parent_id_uniqu" ON "departments_blocks_pill_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_stats_band_stats_order_idx" ON "departments_blocks_stats_band_stats" USING btree ("_order");
  CREATE INDEX "departments_blocks_stats_band_stats_parent_id_idx" ON "departments_blocks_stats_band_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "departments_blocks_stats_band_stats_locales_locale_parent_id" ON "departments_blocks_stats_band_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_stats_band_order_idx" ON "departments_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "departments_blocks_stats_band_parent_id_idx" ON "departments_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_stats_band_path_idx" ON "departments_blocks_stats_band" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_stats_band_locales_locale_parent_id_uniqu" ON "departments_blocks_stats_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_person_card_order_idx" ON "departments_blocks_person_card" USING btree ("_order");
  CREATE INDEX "departments_blocks_person_card_parent_id_idx" ON "departments_blocks_person_card" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_person_card_path_idx" ON "departments_blocks_person_card" USING btree ("_path");
  CREATE INDEX "departments_blocks_person_card_teacher_idx" ON "departments_blocks_person_card" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "departments_blocks_person_card_locales_locale_parent_id_uniq" ON "departments_blocks_person_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_staff_list_order_idx" ON "departments_blocks_staff_list" USING btree ("_order");
  CREATE INDEX "departments_blocks_staff_list_parent_id_idx" ON "departments_blocks_staff_list" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_staff_list_path_idx" ON "departments_blocks_staff_list" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_staff_list_locales_locale_parent_id_uniqu" ON "departments_blocks_staff_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_contact_block_phones_order_idx" ON "departments_blocks_contact_block_phones" USING btree ("_order");
  CREATE INDEX "departments_blocks_contact_block_phones_parent_id_idx" ON "departments_blocks_contact_block_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "departments_blocks_contact_block_phones_locales_locale_paren" ON "departments_blocks_contact_block_phones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_blocks_contact_block_socials_order_idx" ON "departments_blocks_contact_block_socials" USING btree ("_order");
  CREATE INDEX "departments_blocks_contact_block_socials_parent_id_idx" ON "departments_blocks_contact_block_socials" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_contact_block_order_idx" ON "departments_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "departments_blocks_contact_block_parent_id_idx" ON "departments_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "departments_blocks_contact_block_path_idx" ON "departments_blocks_contact_block" USING btree ("_path");
  CREATE UNIQUE INDEX "departments_blocks_contact_block_locales_locale_parent_id_un" ON "departments_blocks_contact_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_clubs_order_idx" ON "departments_clubs" USING btree ("_order");
  CREATE INDEX "departments_clubs_parent_id_idx" ON "departments_clubs" USING btree ("_parent_id");
  CREATE INDEX "departments_clubs_supervisor_idx" ON "departments_clubs" USING btree ("supervisor_id");
  CREATE UNIQUE INDEX "departments_clubs_locales_locale_parent_id_unique" ON "departments_clubs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_labs_order_idx" ON "departments_labs" USING btree ("_order");
  CREATE INDEX "departments_labs_parent_id_idx" ON "departments_labs" USING btree ("_parent_id");
  CREATE INDEX "departments_labs_image_idx" ON "departments_labs" USING btree ("image_id");
  CREATE UNIQUE INDEX "departments_labs_locales_locale_parent_id_unique" ON "departments_labs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_slug_idx" ON "departments" USING btree ("slug");
  CREATE INDEX "departments_institute_idx" ON "departments" USING btree ("institute_id");
  CREATE INDEX "departments_image_idx" ON "departments" USING btree ("image_id");
  CREATE INDEX "departments_head_idx" ON "departments" USING btree ("head_id");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE UNIQUE INDEX "institute_slug_idx" ON "departments" USING btree ("institute_id","slug");
  CREATE UNIQUE INDEX "departments_locales_locale_parent_id_unique" ON "departments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departments_rels_order_idx" ON "departments_rels" USING btree ("order");
  CREATE INDEX "departments_rels_parent_idx" ON "departments_rels" USING btree ("parent_id");
  CREATE INDEX "departments_rels_path_idx" ON "departments_rels" USING btree ("path");
  CREATE INDEX "departments_rels_institutes_id_idx" ON "departments_rels" USING btree ("institutes_id");
  CREATE INDEX "departments_rels_teachers_id_idx" ON "departments_rels" USING btree ("teachers_id");
  CREATE INDEX "teachers_appointments_order_idx" ON "teachers_appointments" USING btree ("_order");
  CREATE INDEX "teachers_appointments_parent_id_idx" ON "teachers_appointments" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "teachers_appointments_locales_locale_parent_id_unique" ON "teachers_appointments_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "teachers_slug_idx" ON "teachers" USING btree ("slug");
  CREATE INDEX "teachers_photo_idx" ON "teachers" USING btree ("photo_id");
  CREATE INDEX "teachers_updated_at_idx" ON "teachers" USING btree ("updated_at");
  CREATE INDEX "teachers_created_at_idx" ON "teachers" USING btree ("created_at");
  CREATE UNIQUE INDEX "teachers_locales_locale_parent_id_unique" ON "teachers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "teachers_rels_order_idx" ON "teachers_rels" USING btree ("order");
  CREATE INDEX "teachers_rels_parent_idx" ON "teachers_rels" USING btree ("parent_id");
  CREATE INDEX "teachers_rels_path_idx" ON "teachers_rels" USING btree ("path");
  CREATE INDEX "teachers_rels_institutes_id_idx" ON "teachers_rels" USING btree ("institutes_id");
  CREATE INDEX "teachers_rels_departments_id_idx" ON "teachers_rels" USING btree ("departments_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_portrait_sizes_portrait_filename_idx" ON "media" USING btree ("sizes_portrait_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
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
  CREATE INDEX "payload_locked_documents_rels_institutes_id_idx" ON "payload_locked_documents_rels" USING btree ("institutes_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_teachers_id_idx" ON "payload_locked_documents_rels" USING btree ("teachers_id");
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
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "institutes_blocks_rich_text" CASCADE;
  DROP TABLE "institutes_blocks_rich_text_locales" CASCADE;
  DROP TABLE "institutes_blocks_pull_quote" CASCADE;
  DROP TABLE "institutes_blocks_pull_quote_locales" CASCADE;
  DROP TABLE "institutes_blocks_video_embed" CASCADE;
  DROP TABLE "institutes_blocks_video_embed_locales" CASCADE;
  DROP TABLE "institutes_blocks_pill_links_items" CASCADE;
  DROP TABLE "institutes_blocks_pill_links_items_locales" CASCADE;
  DROP TABLE "institutes_blocks_pill_links" CASCADE;
  DROP TABLE "institutes_blocks_pill_links_locales" CASCADE;
  DROP TABLE "institutes_blocks_stats_band_stats" CASCADE;
  DROP TABLE "institutes_blocks_stats_band_stats_locales" CASCADE;
  DROP TABLE "institutes_blocks_stats_band" CASCADE;
  DROP TABLE "institutes_blocks_stats_band_locales" CASCADE;
  DROP TABLE "institutes_blocks_person_card" CASCADE;
  DROP TABLE "institutes_blocks_person_card_locales" CASCADE;
  DROP TABLE "institutes_blocks_staff_list" CASCADE;
  DROP TABLE "institutes_blocks_staff_list_locales" CASCADE;
  DROP TABLE "institutes_blocks_contact_block_phones" CASCADE;
  DROP TABLE "institutes_blocks_contact_block_phones_locales" CASCADE;
  DROP TABLE "institutes_blocks_contact_block_socials" CASCADE;
  DROP TABLE "institutes_blocks_contact_block" CASCADE;
  DROP TABLE "institutes_blocks_contact_block_locales" CASCADE;
  DROP TABLE "institutes" CASCADE;
  DROP TABLE "institutes_locales" CASCADE;
  DROP TABLE "institutes_rels" CASCADE;
  DROP TABLE "departments_blocks_rich_text" CASCADE;
  DROP TABLE "departments_blocks_rich_text_locales" CASCADE;
  DROP TABLE "departments_blocks_pull_quote" CASCADE;
  DROP TABLE "departments_blocks_pull_quote_locales" CASCADE;
  DROP TABLE "departments_blocks_video_embed" CASCADE;
  DROP TABLE "departments_blocks_video_embed_locales" CASCADE;
  DROP TABLE "departments_blocks_pill_links_items" CASCADE;
  DROP TABLE "departments_blocks_pill_links_items_locales" CASCADE;
  DROP TABLE "departments_blocks_pill_links" CASCADE;
  DROP TABLE "departments_blocks_pill_links_locales" CASCADE;
  DROP TABLE "departments_blocks_stats_band_stats" CASCADE;
  DROP TABLE "departments_blocks_stats_band_stats_locales" CASCADE;
  DROP TABLE "departments_blocks_stats_band" CASCADE;
  DROP TABLE "departments_blocks_stats_band_locales" CASCADE;
  DROP TABLE "departments_blocks_person_card" CASCADE;
  DROP TABLE "departments_blocks_person_card_locales" CASCADE;
  DROP TABLE "departments_blocks_staff_list" CASCADE;
  DROP TABLE "departments_blocks_staff_list_locales" CASCADE;
  DROP TABLE "departments_blocks_contact_block_phones" CASCADE;
  DROP TABLE "departments_blocks_contact_block_phones_locales" CASCADE;
  DROP TABLE "departments_blocks_contact_block_socials" CASCADE;
  DROP TABLE "departments_blocks_contact_block" CASCADE;
  DROP TABLE "departments_blocks_contact_block_locales" CASCADE;
  DROP TABLE "departments_clubs" CASCADE;
  DROP TABLE "departments_clubs_locales" CASCADE;
  DROP TABLE "departments_labs" CASCADE;
  DROP TABLE "departments_labs_locales" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "departments_locales" CASCADE;
  DROP TABLE "departments_rels" CASCADE;
  DROP TABLE "teachers_appointments" CASCADE;
  DROP TABLE "teachers_appointments_locales" CASCADE;
  DROP TABLE "teachers" CASCADE;
  DROP TABLE "teachers_locales" CASCADE;
  DROP TABLE "teachers_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_institutes_blocks_rich_text_width";
  DROP TYPE "public"."enum_institutes_blocks_pull_quote_width";
  DROP TYPE "public"."enum_institutes_blocks_video_embed_width";
  DROP TYPE "public"."enum_institutes_blocks_pill_links_items_link_type";
  DROP TYPE "public"."enum_institutes_blocks_pill_links_source";
  DROP TYPE "public"."enum_institutes_blocks_pill_links_width";
  DROP TYPE "public"."enum_institutes_blocks_stats_band_source";
  DROP TYPE "public"."enum_institutes_blocks_stats_band_width";
  DROP TYPE "public"."enum_institutes_blocks_person_card_width";
  DROP TYPE "public"."enum_institutes_blocks_staff_list_source";
  DROP TYPE "public"."enum_institutes_blocks_staff_list_variant";
  DROP TYPE "public"."enum_institutes_blocks_staff_list_width";
  DROP TYPE "public"."enum_institutes_blocks_contact_block_socials_platform";
  DROP TYPE "public"."enum_institutes_blocks_contact_block_width";
  DROP TYPE "public"."enum_departments_blocks_rich_text_width";
  DROP TYPE "public"."enum_departments_blocks_pull_quote_width";
  DROP TYPE "public"."enum_departments_blocks_video_embed_width";
  DROP TYPE "public"."enum_departments_blocks_pill_links_items_link_type";
  DROP TYPE "public"."enum_departments_blocks_pill_links_source";
  DROP TYPE "public"."enum_departments_blocks_pill_links_width";
  DROP TYPE "public"."enum_departments_blocks_stats_band_source";
  DROP TYPE "public"."enum_departments_blocks_stats_band_width";
  DROP TYPE "public"."enum_departments_blocks_person_card_width";
  DROP TYPE "public"."enum_departments_blocks_staff_list_source";
  DROP TYPE "public"."enum_departments_blocks_staff_list_variant";
  DROP TYPE "public"."enum_departments_blocks_staff_list_width";
  DROP TYPE "public"."enum_departments_blocks_contact_block_socials_platform";
  DROP TYPE "public"."enum_departments_blocks_contact_block_width";`)
}
