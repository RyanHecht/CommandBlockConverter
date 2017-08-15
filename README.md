I initially made this for personal use, but I figured that there may be someone out there for whom this is useful. Enjoy!

## Introduction

Between Minecraft version 1.8 and 1.12, various aspects of vanilla command syntax has been changed. For example...

From 1.8 to 1.9, Riding, Equipment, DropChances, and HealF NBTs were changed to Passengers, ArmorItems, ArmorDropChances, HandItems, HandDropChances, and Health NBTs.

From 1.10 to 1.11, almost every entity's name was changed, from formats like "ArmorStand" to "armor_stand." Additionally, entity "types" were removed, in favor of increased use of JSON.

From 1.11 to 1.12, NBT typing was made a little bit more strict (quotes are required where they weren't before, and lists had to be made more specific.

## Problem

Some servers are dependent on the use of vanilla commands stored in command blocks. When Mojang changes the syntax, they're met with a bunch of contraptions that no longer work. Up until now, this has meant manually putting commands into web-based converters like these:

1.8 -> 1.9: https://bimbimma.com/summonconverter/
1.10 -> 1.11: https://mrgarretto.com/entityconverter
1.11 -> 1.12: https://mrgarretto.com/convert-1-12

However, this is incredibly inefficient when working with command block counts on the order of 100, 1000, or higher. Plus, sometimes command blocks may be in regions of the map you've forgotten about, and wouldn't think to change manually.

## Solution

This plugin intercepts chunks when they load and checks for Command Blocks. If any are found, it uses Java 8's Scripting API to run the Command Blocks' commands through the three converters I mentioned above. After the conversion has completed, the new command is saved in the Command Block, and the chunk's coordinates are saved to ensure it won't be inspected again.

All you have to do is drag the plugin .jar into your plugins directory, and the rest will happen automatically.


## Notes/Dependencies

- This plugin requires Java 8 and BKCommonLib.
- This is the first release of this plugin; I have only tested it on my own server. As such, I still consider this plugin in "Beta." Should any issues arise, open an issue on the GitHub repository
- ALWAYS KEEP BACKUPS OF YOUR WORLDS PRIOR TO RUNNING THIS PLUGIN. It does not back up commands before it converts them.
- I would recommend flying around the chunks most frequented by your players while you're online by yourself to ensure that the most popular chunks aren't being converted when there are large quantities of players online. As I'm sure you can imagine, running the JavaScript interpreter on chunk load introduces a fair bit of overhead
- While this plugin should sit dormant until a chunk it has not seen before has been loaded, I would recommend removing this plugin from your server after you're certain that all chunks have been converted.
- Thanks to bimbimma and mrgarretto for their excellent free command version utilities, which are a huge part of this plugin. If you find that a command was not converted properly, let me know and I'll forward it along to the relevant party.
