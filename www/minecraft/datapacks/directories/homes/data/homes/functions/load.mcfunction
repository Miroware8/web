scoreboard objectives add sethome trigger "Set Home"
scoreboard objectives add homes trigger "Homes"
scoreboard objectives add home trigger "Home"
scoreboard objectives add namehome trigger "Name Home"
scoreboard objectives add delhome trigger "Delete Home"
scoreboard objectives add homes.target dummy
scoreboard objectives add homes.timer dummy
scoreboard objectives add homes.dummy dummy
scoreboard objectives add homes.config dummy "Homes Config"
scoreboard objectives add homes.x dummy
scoreboard objectives add homes.y dummy
scoreboard objectives add homes.z dummy
execute unless score #limit homes.config matches 0.. run scoreboard players set #limit homes.config 1
execute unless score #delay homes.config matches 0.. run scoreboard players set #delay homes.config 0