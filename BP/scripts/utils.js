import {
  Vector,
  World
} from "@minecraft/server";

/**
  * @param {String} arg
  * @returns {Vector}
  */
export function toVector(arg) {
  return new Vector(...arg.split('|').map(c => +c));
}
/**
  * @param {Vector} arg
  * @returns {String}
  */
export function toFString(arg) {
  return `${Math.round(arg.x)}|${Math.round(arg.y)}|${Math.round(arg.z)}`;
}
/**
 * @param {World} world
 * @returns {Vector}
 */
export default function(world) {
  /** @type {Vector} */
  let defaultWorldSpawn = world.getDefaultSpawnLocation();
  if (defaultWorldSpawn.y < 319) return defaultWorldSpawn;
  defaultWorldSpawn.y = 319;
  const overworld = world.getDimension("overworld");
  overworld.runCommandAsync("say ho");


  while (true) {
    if (overworld.getBlock(defaultWorldSpawn).typeId === "minecraft:air") {
      defaultWorldSpawn.y--;
      if (overworld.getBlock(defaultWorldSpawn).typeId !== "minecraft:air") {
        defaultWorldSpawn.y++;
        world.setDefaultSpawnLocation(defaultWorldSpawn);
        overworld.runCommandAsync("say yes");
        return defaultWorldSpawn;
      }
    } else if (defaultWorldSpawn <= (-64)) {
      break;
    }
  }

  return world.getDefaultSpawnLocation();
}
