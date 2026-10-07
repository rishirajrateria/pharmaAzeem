import * as migration_20260930_143150_initial_schema from './20260930_143150_initial_schema';
import * as migration_20261007_090000_add_media_object_key from './20261007_090000_add_media_object_key';

export const migrations = [
  {
    up: migration_20260930_143150_initial_schema.up,
    down: migration_20260930_143150_initial_schema.down,
    name: '20260930_143150_initial_schema'
  },
  {
    up: migration_20261007_090000_add_media_object_key.up,
    down: migration_20261007_090000_add_media_object_key.down,
    name: '20261007_090000_add_media_object_key'
  },
];
