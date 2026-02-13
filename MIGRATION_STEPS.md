# Migration Steps for Payment Feature

## 📋 What Migrations Were Created

1. **CreateCoursesTable** (updated) - Adds `price`, `emi_allowed`, `emi_count` columns
2. **CreatePaymentTables** (new) - Creates `orders`, `payments`, `emis`, `course_access` tables

## ✅ Step-by-Step Migration Process

### Option 1: Fresh Database (Recommended for Development)

If you're okay with losing existing data:

```bash
cd backend

# 1. Revert all existing migrations (if any)
pnpm migration:revert
pnpm migration:revert
pnpm migration:revert
# ... repeat until all migrations are reverted

# 2. Run all migrations from scratch (includes payment tables)
pnpm migration:run
```

### Option 2: Keep Existing Data (If you have courses/users already)

If you already have data and want to keep it:

**Check if `courses` table already has `price`, `emi_allowed`, `emi_count`:**

```sql
-- Connect to your database and run:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('price', 'emi_allowed', 'emi_count');
```

**If columns are missing**, you have two options:

#### A. Manual SQL (Quick fix):
```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS price decimal(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS emi_allowed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS emi_count integer;
```

#### B. Create a new migration:
```bash
cd backend
pnpm migration:create typeOrm/migrations/AddCoursePriceAndEmiFields
```

Then edit the new migration file to add the columns.

**Then run the payment tables migration:**
```bash
pnpm migration:run
```

This will only run `CreatePaymentTables` (since `CreateCoursesTable` was already executed).

---

## 🔍 Verify Migrations Ran Successfully

After running migrations, verify the tables exist:

```sql
-- Check courses table has new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('price', 'emi_allowed', 'emi_count');

-- Check payment tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'payments', 'emis', 'course_access');
```

You should see:
- ✅ `courses` table with `price`, `emi_allowed`, `emi_count` columns
- ✅ `orders` table
- ✅ `payments` table
- ✅ `emis` table
- ✅ `course_access` table

---

## 🚨 Common Issues

### Issue: "Migration already executed"
- **Solution**: Check which migrations have run:
  ```sql
  SELECT * FROM migrations ORDER BY timestamp DESC;
  ```
- If `CreatePaymentTables` is already there, you're good!
- If not, run `pnpm migration:run`

### Issue: "Table already exists"
- **Solution**: The migration uses `CREATE TABLE` (not `IF NOT EXISTS`), so if tables exist, you need to drop them first or modify the migration.

### Issue: "Foreign key constraint fails"
- **Solution**: Make sure `courses` and `student_profiles` tables exist before running `CreatePaymentTables`

---

## 📝 Migration Commands Reference

```bash
# List all migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert

# Create new migration
pnpm migration:create typeOrm/migrations/YourMigrationName

# Generate migration from entity changes (auto)
pnpm migration:generate typeOrm/migrations/YourMigrationName
```

---

## ✅ Final Checklist

Before testing payment:

- [ ] Migrations run successfully (`pnpm migration:run`)
- [ ] `courses` table has `price`, `emi_allowed`, `emi_count` columns
- [ ] `orders` table exists
- [ ] `payments` table exists
- [ ] `emis` table exists
- [ ] `course_access` table exists
- [ ] Razorpay keys added to `.env`
- [ ] Backend restarted after `.env` changes

---

**Note**: If you're unsure about your current database state, run `pnpm migration:run` - it will only execute migrations that haven't run yet.
