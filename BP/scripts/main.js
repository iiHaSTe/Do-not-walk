/**
  * well, im the developer.
  * I just want you enjoy my addon. but don't take all that
  * make as yours.
  * So if want to make content with this addon or use it 
  * in a mod pack, plz mension me as creator
  *
  * By Hesham aka Haste
  */

import {
  world,
  DynamicPropertiesDefinition,
  Player,
  Entity,
} from "@minecraft/server";
import {
  ActionFormData
} from "@minecraft/server-ui";
import resetWorldSpawn, { toVector, toFString } from "./utils.js";

world.afterEvents.worldInitialize.subscribe((ev) => {
  const d = new DynamicPropertiesDefinition();
  d.defineString("home_dimention", 100);
  d.defineString("home_pos", 1000);
  d.defineString("death_dimention", 100);
  d.defineString("death_pos", 1000);
  ev
    .propertyRegistry
    .registerEntityTypeDynamicProperties(d, "minecraft:player");
});

world.afterEvents.entityDie.subscribe(ev => {
  /** @type {Entity} */
  const entity = ev.deadEntity;

  if (entity.typeId !== "minecraft:player") return;
  entity.setDynamicProperty("death_dimention", entity.dimension.id);
  entity.setDynamicProperty("death_pos", toFString(entity.location));
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
  if (item.typeId === "haste:recall_paper") {
    home(source);
  } else if (item.typeId === "haste:paper_of_suffering") {
    nether(source);
  } else if (item.typeId === "haste:paper_of_ending") {
    theEnd(source);
  } else if (item.typeId === "minecraft:recovery_compass") {
    lastDeath(source);
  } else if (item.typeId === "minecraft:compass") {
    defaultSpawn(source);
  } else if (item.typeId === "haste:dimensional_phone") {
    const form = new ActionFormData()
      .title("Dimentional Phone")
      .body("Select option")
      .button("Home", "textures/items/recall_paper")
      .button("Spawn", "textures/items/bed_purple")
      .button("World spawn", "textures/items/compass_item")
      .button("Last death body", "textures/items/recovery_compass_item")
      .button("Nether", "textures/items/paper_of_suffering")
      .button("The end", "textures/items/paper_of_ending")
      .show(source);
    form
      .then((res) => {
        if (res.canceled) return;

        switch (res.selection) {
          case 0:
            home(source);
            break;
          case 1:
            try {
              source.teleport(source.getSpawnPosition(), world.getDimension("overworld"))
            } catch (e) {
              console.error(e);
            }
            break;
          case 2:
            defaultSpawn(source)
            break;
          case 3:
            lastDeath(source);
            break;
          case 4:
            nether(source);
            break;
          case 5:
            theEnd(source);
            break;
        }
      })
      .catch(_ => console.error(_));
  }
});


/**
  * @param {Player} source
  */
function defaultSpawn(source) {
  try {
    source.teleport(
      resetWorldSpawn(world),
      { dimension: world.getDimension("overworld") }
    );
  } catch (e) {
    source.teleport(
      world.getDefaultSpawnLocation(),
      { dimension: world.getDimension("overworld") }
    )
    source.teleport(
      resetWorldSpawn(world),
      { dimension: world.getDimension("overworld") }
    );
  }
}

/**
  * @param {Player} source
  */
function home(source) {
  if (source.isSneaking) {
    if (source.dimension.id != "minecraft:overworld") {
      source.sendMessage(`Recall Scroll only works in overworld dimention`);
      return;
    }
    source.setDynamicProperty("home_pos", toFString(source.location));
    source.setDynamicProperty("home_dimention", source.dimension.id);
    world.playSound("beacon.activate", source.location);
  } else {
    if (!source.getDynamicProperty("home_pos")) {
      try {
        source.teleport(source.getSpawnPosition(), { dimension: world.getDimension("overworld") });
      } catch (e) {
        defaultSpawn(source);
      }
      return;
    }
    source.teleport(
      toVector(source.getDynamicProperty("home_pos")),
      { dimension: world.getDimension(source.getDynamicProperty("home_dimention")) }
    );
  }
}

/**
  * @param {Player} source
  */
function lastDeath(source) {
  const deathPos = source.getDynamicProperty("death_pos")
  if (deathPos) {
    source.teleport(
      toVector(deathPos),
      { dimension: world.getDimension(source.getDynamicProperty("death_dimention")) }
    );
    return;
  }
  source.sendMessage("You didn't die yet.. " + source.name);
}

/**
  * @param {Player} source
  */
function nether(source) {
  if (source.dimension.id === "minecraft:nether") return;

  let loc = world.getDefaultSpawnLocation();
  loc.y = 50;

  source.addEffect("fire_resistance", 20 * 10, { showParticles: false });
  source.teleport(
    loc,
    { dimension: world.getDimension("minecraft:nether") }
  );
}

/**
  * @param {Player} source
  */
function theEnd(source) {
  if (source.dimension.id === "minecraft:the_end") return;

  source.teleport(
    {
      x: 0,
      y: 65,
      z: 0
    },
    { dimension: world.getDimension("minecraft:the_end") }
  );
}

