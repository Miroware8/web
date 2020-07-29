execute as @a[tag=tpa.sender] if score @s tpa.target matches 1.. run function tpa:cancel_tpa
scoreboard players operation @a[tag=tpa.sender] tpa.target = @a[tag=tpa.sender] tpa
tellraw @a[tag=tpa.sender] [{"text":"You have requested to teleport to ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":".\nTo cancel, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpcancel","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpcancel"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpcancel","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
tellraw @s ["",{"selector":"@a[tag=tpa.sender]","color":"aqua"},{"text":" has requested to teleport to you.\nTo accept, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpaccept","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpaccept"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpaccept","color":"aqua"},{"text":".\nThe ","color":"dark_aqua"},{"text":"most recent","color":"red"},{"text":" active teleport request will be accepted.\nEnter ","color":"dark_aqua"},{"text":"/trigger tpaccept set <PID>","color":"aqua"},{"text":" instead if this player's request is not the most recent.","color":"dark_aqua"}]}},{"text":".\nTo deny, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpdeny","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpdeny"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpdeny","color":"aqua"},{"text":".\nThe ","color":"dark_aqua"},{"text":"most recent","color":"red"},{"text":" active teleport request will be denied.\nEnter ","color":"dark_aqua"},{"text":"/trigger tpdeny set <PID>","color":"aqua"},{"text":" instead if this player's request is not the most recent.","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]