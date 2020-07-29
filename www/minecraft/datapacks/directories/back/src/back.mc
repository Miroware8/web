function load {
	scoreboard objectives add back trigger "Back"
	scoreboard objectives add back.timer dummy
	scoreboard objectives add back.dummy dummy
	scoreboard objectives add back.config dummy "Back Config"
	scoreboard objectives add back.x dummy
	scoreboard objectives add back.y dummy
	scoreboard objectives add back.z dummy
	execute unless score #delay back.config matches 0.. run scoreboard players set #delay back.config 0
}
function uninstall {
	execute at @e[type=minecraft:item_frame,tag=back.dimension] run forceload remove ~ ~
	kill @e[type=minecraft:item_frame,tag=back.dimension]
	data remove storage back:storage players
	data remove storage back:storage lastDimension
	data remove storage back:storage temp
	scoreboard objectives remove back
	scoreboard objectives remove back.timer
	scoreboard objectives remove back.dummy
	scoreboard objectives remove back.config
	scoreboard objectives remove back.x
	scoreboard objectives remove back.y
	scoreboard objectives remove back.z
	schedule clear back:tick
}
clock 1t {
	name tick
	scoreboard players enable @a back
	execute as @a[scores={back=1..}] at @s run function back:trigger_back
	execute as @a[scores={back.timer=0..}] run function back:try_to_try_to_try_to_go_back
}
function try_to_try_to_try_to_go_back {
	execute if score @s back.timer matches 0 run function back:try_to_try_to_go_back
	execute unless score @s back.timer matches 0 run scoreboard players remove @s back.timer 1
}
function try_to_try_to_go_back {
	function back:rotate/players
	scoreboard players set #success back.dummy 0
	execute store result score #value back.dummy run data get entity @s Pos[1] 10
	execute if score #value back.dummy = @s back.y run function back:check_x
	execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
	execute unless score #success back.dummy matches 0 run function back:try_to_go_back
	scoreboard players reset @s back.timer
}
function try_to_summon_destination {
	execute store result score #id back.dummy run data get entity @s Item.tag.backData.id
	execute if score #id back.dummy = #dimension back.dummy at @s run summon minecraft:area_effect_cloud ~ ~ ~ {UUID:[I;1720808675,569658060,-1290656431,1684951819]}
}
function try_to_go_back {
	execute store success score #success back.dummy run data get storage back:storage players[-1].back
	execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
	execute unless score #success back.dummy matches 0 run function back:go_back
}
function trigger_back {
	function back:rotate/players
	execute store success score #success back.dummy run data get storage back:storage players[-1].back
	execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
	execute unless score #success back.dummy matches 0 run function back:start_to_go_back
	scoreboard players set @s back 0
}
function summon_dimension_marker {
	forceload add ~ ~
	summon minecraft:item_frame ~ ~ ~ {Tags:["back.dimension","back.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:stone_button",Count:1b,tag:{backData:{}}}}
	execute store result score #id back.dummy run data get storage back:storage lastDimension
	execute store result entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.id int 1 run scoreboard players add #id back.dummy 1
	execute store result storage back:storage lastDimension int 1 run scoreboard players get #id back.dummy
	data modify entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.name set from entity @s Dimension
	tag @e[type=minecraft:item_frame] remove back.new
}
function start_to_go_back {
	scoreboard players operation @s back.timer = #delay back.config
	execute store result score @s back.x run data get entity @s Pos[0] 10
	execute store result score @s back.y run data get entity @s Pos[1] 10
	execute store result score @s back.z run data get entity @s Pos[2] 10
	tellraw @s [{"text":"Teleporting back...","color":"dark_aqua"}]
}
function set_back {
	execute unless entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..] positioned 12940016 1000 17249568 run function back:summon_dimension_marker
	function back:rotate/players
	data modify storage back:storage players[-1].back.dim set from entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..,limit=1] Item.tag.backData.id
	data modify storage back:storage players[-1].back.pos set from entity @s Pos
	data modify storage back:storage players[-1].back.rot set from entity @s Rotation
}
namespace rotate {
	function players {
		execute store result score #remaining back.dummy run data get storage back:storage players
		data modify storage back:storage temp set from entity @s UUID
		execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
		execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function back:rotate/player
		execute if score #remaining back.dummy matches 0 run function back:add_player
	}
	function player {
		data modify storage back:storage players prepend from storage back:storage players[-1]
		data remove storage back:storage players[-1]
		scoreboard players remove #remaining back.dummy 1
		data modify storage back:storage temp set from entity @s UUID
		execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
		execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function back:rotate/player
	}
}
function go_back {
	execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
	execute as @e[type=minecraft:item_frame,tag=back.dimension] run function back:try_to_summon_destination
	data modify entity 669174e3-21f4-4acc-b312-2551646e530b Pos set from storage back:storage players[-1].back.pos
	data modify entity 669174e3-21f4-4acc-b312-2551646e530b Rotation set from storage back:storage players[-1].back.rot
	execute at @s run function back:set_back
	tp @s 669174e3-21f4-4acc-b312-2551646e530b
	kill 669174e3-21f4-4acc-b312-2551646e530b
}
function config {
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay back.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config","color":"aqua"},{"text":".\nEnter the number after clicking.","color":"dark_aqua"}]}},{"text":" to set the number of ticks for which the player must stand still before teleporting after running the back command. (1 second = 20 ticks.) The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #delay back.config 0"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#delay","objective":"back.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
}
function check_z {
	execute store result score #value back.dummy run data get entity @s Pos[2] 10
	execute store success score #success back.dummy if score #value back.dummy = @s back.z
}
function check_x {
	execute store result score #value back.dummy run data get entity @s Pos[0] 10
	execute if score #value back.dummy = @s back.x run function back:check_z
}
function add_player {
	data modify storage back:storage players append value {}
	data modify storage back:storage players[-1].uuid set from entity @s UUID
}