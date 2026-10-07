import * as migration_20261007_070438_initial from './20261007_070438_initial';
import * as migration_20261007_123633_add_submissions from './20261007_123633_add_submissions';

export const migrations = [
  {
    up: migration_20261007_070438_initial.up,
    down: migration_20261007_070438_initial.down,
    name: '20261007_070438_initial',
  },
  {
    up: migration_20261007_123633_add_submissions.up,
    down: migration_20261007_123633_add_submissions.down,
    name: '20261007_123633_add_submissions'
  },
];
