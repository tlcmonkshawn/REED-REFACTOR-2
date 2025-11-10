/* eslint-disable camelcase */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        username: { type: 'varchar(100)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        role: { type: 'varchar(50)', notNull: true, default: 'player' }, // roles: player, agent, bootie_boss
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createTable('locations', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        address: { type: 'text' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createTable('booties', {
        id: 'id',
        title: { type: 'varchar(255)', notNull: true },
        description: { type: 'text' },
        status: { type: 'varchar(50)', notNull: true, default: 'unlisted' },
        category: { type: 'varchar(100)' },
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        location_id: {
            type: 'integer',
            references: '"locations"',
            onDelete: 'set null',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('booties');
    pgm.dropTable('locations');
    pgm.dropTable('users');
};
