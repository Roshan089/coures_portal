# Database Directory

This directory contains all database-related files for the application using TypeORM.

## Structure

```
database/
├── config.ts          # TypeORM database configuration
├── entities/          # TypeORM entity files (database models)
├── migrations/       # Database migration files
└── seeders/          # Database seeding scripts
```

## Entities

Place your TypeORM entity files in the `entities/` directory. Each entity should be a class decorated with `@Entity()`.

Example: `entities/user.entity.ts`, `entities/course.entity.ts`

## Migrations

Database migrations are stored in the `migrations/` directory. Use the following commands:

- Generate migration: `pnpm migration:generate database/migrations/MigrationName`
- Run migrations: `pnpm migration:run`
- Revert migration: `pnpm migration:revert`

## Seeders

Database seeding scripts go in the `seeders/` directory. These are used to populate the database with initial or test data.
