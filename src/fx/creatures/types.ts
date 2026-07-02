/**
 * src/fx/creatures/types.ts — creature contract re-export.
 *
 * The canonical definitions live in the frozen src/core/worldTypes.ts. This
 * module re-exports them so creature-lane code can import from within the
 * creatures/ folder. Stage C replaces spawnCreatures internals; these types
 * do not change.
 */
export type {
  BodyPlan,
  Temperament,
  CreatureSpec,
  CreatureHandles,
} from '../../core/worldTypes.js';
