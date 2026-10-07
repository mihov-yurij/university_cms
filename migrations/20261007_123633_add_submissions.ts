import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "submissions_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entry" varchar
  );
  
  CREATE TABLE "submissions_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entry" varchar
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"department" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"position" varchar,
  	"degree" varchar,
  	"academic_title" varchar,
  	"orcid" varchar,
  	"scopus" varchar,
  	"wos" varchar,
  	"google_scholar" varchar,
  	"email" varchar NOT NULL,
  	"bio" varchar,
  	"email_sent" boolean DEFAULT false,
  	"file_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "submissions_id" integer;
  ALTER TABLE "submissions_publications" ADD CONSTRAINT "submissions_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions_projects" ADD CONSTRAINT "submissions_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "submissions_publications_order_idx" ON "submissions_publications" USING btree ("_order");
  CREATE INDEX "submissions_publications_parent_id_idx" ON "submissions_publications" USING btree ("_parent_id");
  CREATE INDEX "submissions_projects_order_idx" ON "submissions_projects" USING btree ("_order");
  CREATE INDEX "submissions_projects_parent_id_idx" ON "submissions_projects" USING btree ("_parent_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "submissions_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "submissions_publications" CASCADE;
  DROP TABLE "submissions_projects" CASCADE;
  DROP TABLE "submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "submissions_id";`)
}
