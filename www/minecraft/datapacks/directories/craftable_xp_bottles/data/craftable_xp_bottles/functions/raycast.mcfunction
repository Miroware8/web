scoreboard players remove #steps craXPBot.dummy 1
execute if block ~ ~ ~ minecraft:enchanting_table run function craftable_xp_bottles:check_enchanting_table
execute unless score #steps craXPBot.dummy matches 0 positioned ^ ^ ^0.1 run function craftable_xp_bottles:raycast