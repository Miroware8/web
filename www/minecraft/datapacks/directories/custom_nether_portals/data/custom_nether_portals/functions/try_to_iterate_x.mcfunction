execute unless predicate custom_nether_portals:valid run scoreboard players set #success cusNetPor.dummy -1
execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:iterate_x