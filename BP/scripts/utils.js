import {
  World,
} from "@minecraft/server";

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
  overworld.runCommandAsync("say fixing a big bug... :D");


  while (true) {
    if (overworld.getBlock(defaultWorldSpawn).typeId === "minecraft:air") {
      defaultWorldSpawn.y--;
      if (overworld.getBlock(defaultWorldSpawn).typeId !== "minecraft:air") {
        defaultWorldSpawn.y++;
        world.setDefaultSpawnLocation(defaultWorldSpawn);
        overworld.runCommandAsync("say finneshed");
        return defaultWorldSpawn;
      }
    } else if (defaultWorldSpawn <= (-64)) {
      break;
    }
  }

  return world.getDefaultSpawnLocation();
}
