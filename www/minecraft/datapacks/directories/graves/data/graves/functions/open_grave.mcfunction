execute store result score #remaining graves.dummy run data get storage graves:storage players
data modify storage graves:storage temp set from entity @s HandItems[1].tag.gravesData.uuidMost
execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuidMost
execute if score #success graves.dummy matches 0 run function graves:check_uuid_least_as_grave
execute if score #success graves.dummy matches 1 run function graves:rotate/player_as_grave
scoreboard players set #rotated graves.dummy 0
function graves:rotate/graves
data remove storage graves:storage players[-1].graves[-1]
scoreboard players remove #remaining graves.dummy 1
execute unless score #rotated graves.dummy matches 0 unless score #remaining graves.dummy matches 0 run function graves:rotate/back_grave
execute as @e[type=minecraft:armor_stand,tag=graves.model] run function graves:check_model
execute if data entity @s HandItems[0].tag.gravesData.items[0] run function graves:drop_item
execute store result score #xp graves.dummy run data get entity @s HandItems[0].tag.gravesData.xp
execute if entity @s[tag=graves.hasXP] run function graves:drop_xp
playsound minecraft:block.stone.break block @a
particle minecraft:poof ~ ~0.7 ~ 0 0 0 0.05 10
kill @s