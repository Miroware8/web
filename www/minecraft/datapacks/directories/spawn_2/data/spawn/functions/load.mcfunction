scoreboard objectives add spawn trigger "Spawn"
scoreboard objectives add spawn.config dummy "Spawn Config"
scoreboard objectives add spawn.dummy dummy
scoreboard objectives add spawn.timer dummy
scoreboard objectives add spawn.x dummy
scoreboard objectives add spawn.y dummy
scoreboard objectives add spawn.z dummy
execute unless score #delay spawn.config matches 0.. run scoreboard players set #delay spawn.config 0