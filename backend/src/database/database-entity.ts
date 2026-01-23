/**
 * Database Entities Aggregator
 * 
 * This file imports all entities from all modules and exports them as an array.
 * This array is used by TypeORM to register all entities.
 * 
 * When creating a new module with entities:
 * 1. Create your entity file in src/modules/[module-name]/entities/[entity-name].entity.ts
 * 2. Import it here
 * 3. Add it to the models array below
 */

// Import all entities from modules
import { User } from '../modules/users/entities/user.entity';
// import { Course } from '../modules/courses/entities/course.entity';
// import { Enrollment } from '../modules/enrollments/entities/enrollment.entity';

// Export all entities as an array
export const models = [
  User,
  // Course,
  // Enrollment,
];
