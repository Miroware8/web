execute as @e[type=minecraft:item] at @s if block ~ ~ ~ minecraft:cauldron unless block ~ ~ ~ minecraft:cauldron[level=0] run function cauldron_concrete:check_item
schedule function cauldron_concrete:tick 1t