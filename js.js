var parts;

function completeConvert(old) {
	if (old.startsWith("summon" || old.startsWith("/summon"))) {
		old = convertCommand(old);
	}
	return convert12(convertNested(old));
}

// 1.8 -> 1.9

function convertCommand(oldCommand){
	
	parts=[];
	var tmp = oldCommand.split(" ");
	var coords = tmp[2] + " " + tmp[3]+ " " + tmp[4];
	parts.push("id:\""+tmp[1]+"\",");
	var depth=0;
	if(tmp.length > 5 && tmp[5].charAt(0)=='{'){
		tmp = oldCommand.substr(oldCommand.indexOf("{"),oldCommand.lastIndexOf("}")-oldCommand.indexOf("{")+1);
		parseSection(depth, tmp, 1);
	}
	
	
	
	for(var i=parts.length-1; i>=0; i--){
		parts[i] = doEquipment(parts[i]);
		parts[i] = doDropChances(parts[i]);
		parts[i] = parts[i].replace("HealF","Health");
		
	}
	mainEntity = extractEntityFromPart(parts[parts.length-1]);
	var newCommand = "/summon " + mainEntity[0] + " " + coords + " ";
	parts[parts.length-1] = mainEntity[1];
	var closeBrackets="";
	for(var i=parts.length-1; i>=0; i--){
		newCommand += "{" + parts[i];
		newCommand = newCommand.replace("{,", "{");
		
		if(i>0){
			newCommand += ",Passengers:[";
			closeBrackets+="}]";
		}
	}
	newCommand += closeBrackets+"}";
	newCommand = replaceAll(",}", "}", newCommand);
	return newCommand;
}

function extractEntityFromPart(part){
	var entity = part.substr(part.indexOf('id:')+3);
	if(entity.indexOf(',')!=-1){
		entity = entity.substr(0, entity.indexOf(','));
		entity = replaceAll("\"", "", entity);
		return [entity, part.substr(part.indexOf(','))];
	}else{
		entity = replaceAll("\"", "", entity);
		return [entity, ""];
	}
	
}

function extractSegment(str, startIndex){
	var startSymbol, endSysmbol;
	if(str.charAt(startIndex)=="{"){
		endSymbol="}";
		startSymbol="{";
	}else if(str.charAt(startIndex)=="["){
		endSymbol="]";
		startSymbol="[";
	}else{
		return str;
	}
	var open=1;
	var newStr=startSymbol;
	for(var i=startIndex+1; open!=0 && i<str.length;i++){
		if(str.charAt(i)==startSymbol){
			open++;
		}else if(str.charAt(i)==endSymbol){
			open--;
		}
		newStr+=str.charAt(i);
	}
	return newStr;
}
function doDropChances(str){
	var openBraces=0, openSquares=1;
	if(str.indexOf("DropChances:")!= -1){
		
		var slotIndex=0;
		var seg = extractSegment(str.split("DropChances:")[1], 0);
		seg = seg.substr(1,seg.length-2)
		var slots=seg.split(",");
		var newstr=str.substr(0,str.indexOf("DropChances:"));
		var hasHand=false;
		if(slots[0].indexOf("0.085F") == -1){
			newstr+="HandDropChances:["+slots[0]+",0.085F]";
			hasHand=true;
		}
		if(slots[1].indexOf("0.085F")==-1 || slots[2].indexOf("0.085F")==-1 || slots[3].indexOf("0.085F")==-1 || slots[4].indexOf("0.085F")==-1){
			if(hasHand)newstr+=",";
			newstr+="ArmorDropChances:["+slots[1]+","+slots[2]+","+slots[3]+","+slots[4]+"]";
		}
		newstr += str.substring(str.indexOf("DropChances:")+12+ seg.length+2);
		return newstr;
	}
	return str;
	
}



function doEquipment(str){
	var openBraces=0, openSquares=1;
	if(str.indexOf("Equipment:")!= -1){
		var slots=[5];
		var slotIndex=0;
		var seg = extractSegment(str.split("Equipment:")[1], 0);
		var nb=0;
		for(var e=0; e<5; e++){
			while(nb<seg.length){
				if(seg.charAt(nb)=="{"){
					slots[e]=extractSegment(seg, nb);
					nb+=slots[e].length;
					break;
				}
				nb++;
			}
		}
		var newstr=str.substr(0,str.indexOf("Equipment:"));
		var hasHand=false;
		if(slots[0].indexOf("{}") == -1){
			newstr+="HandItems:["+slots[0]+",{}]";
			hasHand=true;
		}
		if(slots[1].indexOf("{}")==-1 || slots[2].indexOf("{}")==-1 || slots[3].indexOf("{}")==-1 || slots[4].indexOf("{}")==-1){
			if(hasHand)newstr+=",";
			newstr+="ArmorItems:["+slots[1]+","+slots[2]+","+slots[3]+","+slots[4]+"]";
		}
		newstr += str.substring(str.indexOf("Equipment:")+10+ seg.length);
		return newstr;
	}
	return str;
	
}
function replaceAll(find, replace, str){
  return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}
function parseSection(depth, nbt, index){
	var first="", riding="", last="";
	var openBraces=0;
	var closedBraces=0;
	while(index<nbt.length){
		first+=nbt.charAt(index);
		index++;
		if(first.indexOf("Riding:{")!=-1){
			openBraces=1;
			first = first.replace("Riding:{","");
			var riding="";
			while(index<nbt.length && openBraces != 0){
				if(nbt.charAt(index)=='{'){
					openBraces++;
				}else if(nbt.charAt(index)=='}'){
					openBraces--;
				}
				riding+=nbt.charAt(index);
				index++;
			}
		}
	}
	first = first.replace(",,",",");
	first = first.substr(0,first.length-1);
	if(first.charAt(first.length-1)==","){
		first = first.substr(0,first.length-1);
	}
	parts[depth]+=first;	
	if(riding.length>0){
		parts.push("");
		parseSection(depth+1, riding, 0);
	}	
}


// 1.10 -> 1.11



			var entityConversions = {
				"FireworksRocketEntity":"fireworks_rocket",
				"ThrownExpBottle":"xp_bottle",
				"VillagerGolem":"villager_golem",
				"ItemFrame":"item_frame",
				"PigZombie":"zombie_pigman",
				"AreaEffectCloud":"area_effect_cloud",
				"EnderCrystal":"ender_crystal",
				"DragonFireball":"dragon_fireball",
				"ThrownEgg":"egg",
				"ThrownEnderpearl":"ender_pearl",
				"MinecartHopper":"hopper_minecart",
				"SmallFireball":"small_fireball",
				"WitherBoss":"wither",
				"FallingSand":"falling_block",
				"WitherSkull":"wither_skull",
				"PolarBear":"polar_bear",
				"ThrownPotion":"potion",
				"MinecartFurnace":"furnace_minecart",
				"SpectralArrow":"spectral_arrow",
				"MinecartTNT":"tnt_minecart",
				"CaveSpider":"cave_spider",
				"Ozelot":"ocelot",
				"LavaSlime":"magma_cube",
				"XPOrb":"xp_orb",
				"MushroomCow":"mooshroom",
				"MinecartCommandBlock":"commandblock_minecart",
				"ArmorStand":"armor_stand",
				"LeashKnot":"leash_knot",
				"EntityHorse":"horse",
				"MinecartSpawner":"spawner_minecart",
				"EyeOfEnderSignal":"eye_of_ender_signal",
				"ShulkerBullet":"shulker_bullet",
				"EnderDragon":"ender_dragon",
				"LightningBolt":"lightning_bolt",
				"PrimedTnt":"tnt",
				"MinecartRideable":"minecart",
				"Item":"item",
			    "Arrow":"arrow",
			    "Fireball":"fireball",
			    "Spider":"spider",
			    "Slime":"slime",
			    "Pig":"pig",
			    "Cow":"cow",
			    "Villager":"villager",
			    "EntityHorse":"horse",
			    "Zombie":"zombie",
			    "Skeleton":"skeleton",
			    "Guardian":"guardian"
			}

			var horseConversions = {
				'0': 'horse',
				'1': 'donkey',
				'2': 'mule',
				'3': 'zombie_horse',
				'4': 'skeleton_horse'
			}

			var zombieConversions = {
				'0': 'zombie',
				'1': 'zombie_villager',
				'2': 'zombie_villager',
				'3': 'zombie_villager',
				'4': 'zombie_villager',
				'5': 'zombie_villager',
				'6': 'husk'
			}

			var zombieConversionsProfession = {
				'0': '',
				'1': ',Profession:0',
				'2': ',Profession:1',
				'3': ',Profession:2',
				'4': ',Profession:3',
				'5': ',Profession:4',
				'6': ''
			}

			var skeletonConversions = {
				'0': 'skeleton',
				'1': 'wither_skeleton',
				'2': 'stray'
			}

			

			function convert(input) {

				// Horse conversions
				for (var horseType in horseConversions) {
					// Summon commands
					input = input.replace(new RegExp('summon EntityHorse ([0-9.~\\s]+) {(.*)Type:\\s*' + horseType + '(.*)}', 'g'), 'summon ' + horseConversions[horseType] + ' $1 {$2$3}');
					// In a Passengers tag
					input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*EntityHorse[\\\\"]*([^{}]*)Type:\\s*' + horseType + '([^{}]*)}', 'g'), '{$3$2$1id:' + horseConversions[horseType] + '}');
					input = input.replace(new RegExp('{([^{}]*)Type:\\s*[\\\\"]*' + horseType + '[\\\\"]*([^{}]*)id:\\s*EntityHorse([^{}]*)}', 'g'), '{$3$2$1id:' + horseConversions[horseType] + '}');
				}

				// Skeleton conversions
				for (var skeletonType in skeletonConversions) {
					// Summon commands
					input = input.replace(new RegExp('summon Skeleton ([0-9.~\\s]+) {(.*)SkeletonType:\\s*' + skeletonType + '(.*)}', 'g'), 'summon ' + skeletonConversions[skeletonType] + ' $1 {$2$3}');
					// In a Passengers tag
					input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Skeleton[\\\\"]*([^{}]*)SkeletonType:\\s*' + skeletonType + '([^{}]*)}', 'g'), '{$3$2$1id:' + skeletonConversions[skeletonType] + '}');
					input = input.replace(new RegExp('{([^{}]*)SkeletonType:\\s*' + skeletonType + '([^{}]*)id:\\s*[\\\\"]*Skeleton[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:' + skeletonConversions[skeletonType] + '}');
				}

				// Zombie conversions
				for (var zombieType in zombieConversions) {
					// Summon commands
					input = input.replace(new RegExp('summon Zombie ([0-9.~\\s]+) {(.*)ZombieType:\\s*' + zombieType + '(.*)}', 'g'), 'summon ' + zombieConversions[zombieType] + ' $1 {$2$3' + zombieConversionsProfession[zombieType] + '}');
					// In a Passengers tag
					input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Zombie[\\\\"]*([^{}]*)ZombieType:\\s*' + zombieType + '([^{}]*)}', 'g'), '{$3$2$1id:' + zombieConversions[zombieType] + zombieConversionsProfession[zombieType] + '}');
					input = input.replace(new RegExp('{([^{}]*)ZombieType:\\s*' + zombieType + '([^{}]*)id:\\s*[\\\\"]*Zombie[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:' + zombieConversions[zombieType] + zombieConversionsProfession[zombieType] + '}');
				}

				// Elder guardian conversions
				// Summon commands
				input = input.replace(new RegExp('summon Guardian ([0-9.~\\s]+) {(.*)Elder:\\s*1b?(.*)}', 'g'), 'summon elder_guardian $1 {$2$3}');
				// In a Passengers tag
				input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Guardian[\\\\"]*([^{}]*)Elder:\s*1b?([^{}]*)}', 'g'), '{$3$2$1id:elder_guardian}');
				input = input.replace(new RegExp('{([^{}]*)Elder:\s*1b?([^{}]*)id:\\s*[\\\\"]*Guardian[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:elder_guardian}');

				// This must run after the code above, since this is for anything "leftover"
				for (var key in entityConversions) {

					// Simple entity ID conversions:

					input = input.replace(new RegExp('summon ' + key, 'g'), 'summon ' + entityConversions[key]);
					input = input.replace(new RegExp('id:[\\\\"]*' + key + '[\\\\"]*', 'g'), 'id:' + entityConversions[key]);
					input = input.replace(new RegExp('type=' + key, 'g'), 'type=' + entityConversions[key]);
					input = input.replace(new RegExp('type=!' + key, 'g'), 'type=!' + entityConversions[key]);
					input = input.replace(new RegExp('stat\\.killEntity\\.' + key, 'g'), 'stat.killEntity.' + entityConversions[key]);
					input = input.replace(new RegExp('stat\\.entityKilledBy\\.' + key, 'g'), 'stat.entityKilledBy.' + entityConversions[key]);

				}
				
				input = input.replace(new RegExp('stat\\.killEntity\\.([a-zA-Z_]+)', 'g'), 'stat.killEntity.minecraft:$1');
				input = input.replace(new RegExp('stat\\.entityKilledBy\\.([a-zA-Z_]+)', 'g'), 'stat.entityKilledBy.minecraft:$1');

				input = input.replace(new RegExp('EntityTag:\\s*{\\s*id:[\\\\"]*([a-zA-Z]+)[\\\\"]*\\s*', 'g'), function(v, m) {return 'EntityTag:{id:minecraft:' + m.toLowerCase()});

				input = updateItemCounts(input);

				input = input.replace(/summon ([a-zA-Z_]+) ([~0-9. ]+) {}/g, 'summon $1 $2');
				input = input.replace(/{,/g, '{');
				input = input.replace(/,}/g, '}');
				input = input.replace(/,,/g, ',');

				return input;

			}

			function getParameterByName(name, url) {
			    if (!url) url = window.location.href;
			    name = name.replace(/[\[\]]/g, "\\$&");
			    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			        results = regex.exec(url);
			    if (!results) return null;
			    if (!results[2]) return '';
			    return decodeURIComponent(results[2].replace(/\+/g, " "));
			}






			function strReplaceAt(string, start, end, insert) {
			    return string.substr(0, start) + insert + string.substr(end);
			}

			function updateItemCounts(text) {

				var targetTags = ['ArmorItems', 'HandItems'];

				var itemLists = [];

				var bracketLevel = -1; // Curly bracket level tracker
				var startTagBracketLevel = -1;
				var strStartPos = 0; // Stores the starting position of the ArmorItems, HandItems, etc.. tags

				for (var i = 0; i < targetTags.length; i++) {

					// Reset for next tag check
					bracketLevel = -1;
					startTagBracketLevel = -1;

					for (var j = 0; j < text.length; j++) {

						// Adjust bracket level on encounter
						if (j + 1 <= text.length && text.substring(j, j + 1) === '{')
							bracketLevel++;
						if (j + 1 <= text.length && text.substring(j, j + 1) === '}')
							bracketLevel--;

						if (j + targetTags[i].length <= text.length && text.substring(j, j + targetTags[i].length) === targetTags[i]) {
							// Found start pos of a tag

							strStartPos = j;

							startTagBracketLevel = bracketLevel;

						}

						if (j + 2 <= text.length && text.substring(j, j + 2) === '}]' && bracketLevel === startTagBracketLevel) {
							// Found end pos of a tag
							// text.substring(strStartPos, j+2) is the current target tag, such as "ArmorItems"

							itemLists[itemLists.length] = text.substring(strStartPos, j+2);

							text = strReplaceAt(text, strStartPos, j+2, '``$$$@' + (itemLists.length - 1) + '@!!!``');

							// Change j back to the startpos since the tag that was just found was replaced with a reference
							j = strStartPos;

							startTagBracketLevel = -10;

						}

					}

				}

				// At this point, itemLists will contain something like ["ArmorItems:[{},{},{},{}]", "HandItems:[{},{}]"]
				// Text will contain 'references' to the elements in the itemLists array, such as ``$$$@3@!!!`` === 3rd index of itemLists

				var curListItems = []; // An array of each separated item in the current list (for the loops below)
				var itemStart = -1;

				for (var i = 0; i < itemLists.length; i++) {

					bracketLevel = -1;
					curListItems = [];

					for (var j = 0; j < itemLists[i].length; j++) {

						// Adjust bracket level on encounter
						if (j + 1 <= itemLists[i].length && itemLists[i].substring(j, j + 1) === '{') {
							bracketLevel++;

							if (bracketLevel === 0) {
								// Entering single item in the list

								itemStart = j;
							}
						}
						if (j + 1 <= itemLists[i].length && itemLists[i].substring(j, j + 1) === '}') {
							bracketLevel--;

							if (bracketLevel === -1) {
								// Leaving single item in the list

								curListItems[curListItems.length] = itemLists[i].substring(itemStart, j + 1);

								// Insert reference
								itemLists[i] = strReplaceAt(itemLists[i], itemStart, j + 1, '&&---%%%' + (curListItems.length - 1) + '%%%---&&');

								j = itemStart;
							}
						}

						// bracketLevel === 0 indicates a single item in the list

					}

					for (var j = 0; j < curListItems.length; j++) {
						// Each item in the curListItems array will be something like '{}' or '{id:diamond_sword}'

						if (curListItems[j].indexOf('Count:') === -1 && curListItems[j] !== '{}') {

							curListItems[j] = curListItems[j].replace('{', '{Count:1,');

						}

						// Reinsert the singular item back into the item list, wherever the reference is

						itemLists[i] = itemLists[i].replace('&&---%%%' + j + '%%%---&&', curListItems[j]);

					}

					// Reinsert the item list back into the entire text string, wherever the reference is

					text = text.replace('``$$$@' + i + '@!!!``', itemLists[i]);

				}

				return text;

			}

			function convertNested(fullString) {

				var currentInMemory = '';

				while (fullString.indexOf('Passengers:[{') > -1) {

					currentInMemory = fullString.match(/(Passengers:\[{.*\}])/)[0];

					fullString = fullString.replace(/(Passengers:\[{.*\}])/, '_*&*_');

					fullString = convert(fullString);

					fullString = fullString.replace('_*&*_', currentInMemory.replace('Passengers:[{', 'Passengers**:[{'));

				}

				// This runs for the top nested level of passengers
				fullString = convert(fullString);

				fullString = fullString.replace(/Passengers\*\*:\[\{/g, 'Passengers:[{');

				return fullString;

			}

// 1.11 -> 1.12



			/*

			thanks @onnowhere
			- Anything with id:minecraft:blah must now be id:"minecraft:blah"
			- Any string has characters that are not in "a-zA-Z0-9._+-" must be contained in quotes i.e. CustomName:"blah!..."
			- Comma splits in string lists must each be quoted now i.e. Lore:["blah","blah"]
			- If you ever used [0:{blah},1:{blah},2:{blah}], remove 0: 1: 2: etc.
			- No inconsistent lists, i.e. no [0.0f,0.0,0.0], use [0.0f,0.0f,0.0f] or [0.0,0.0,0.0] etc. (edited)

			*/

			function convert12(input) {

				// input = input.replace(new RegExp('summon EntityHorse ([0-9.~\\s]+) {(.*)Type:\\s*' + horseType + '(.*)}', 'g'), 'summon ' + horseConversions[horseType] + ' $1 {$2$3}');

				input = input.replace(/\bid\:minecraft\:([a-zA-Z_0-9]+)\b/g, 'id:"minecraft:$1"');
				input = input.replace(/FadeColors\:\[([0-9]+,[0-9]+,[0-9]+)\]/g, 'FadeColors:[I;$1]')
				input = input.replace(/Colors\:\[([0-9]+,[0-9]+,[0-9]+)\]/g, 'Colors:[I;$1]')

				input = smoothQuotes(input);

				// input = input.replace(/\bCustomName\:([a-zA-Z_0-9 ~!@#$%^&*()\-=+/.<>'|]+)\b/g, 'CustomName:"$1"');
				// input = input.replace(/\bCommand\:([a-zA-Z_0-9 ~!@#$%^&*()\-=+/.<>'|]+)\b/g, 'Command:"$1"');

				var bracketLevel = 0;
				var checkMini = 0;

				var quoteLevel = 0;

				for (var i = input.length; i >= 0 ; i--) {

					if (input.substring(i, i+escapeQuotes('"', quoteLevel + 1).length).match(new RegExp('[^\\\\]' + escapeQuotes('"', quoteLevel + 1), 'g')) !== null) {
						quoteLevel++;
					}

					if (quoteLevel > 0 && input.substring(i, i+escapeQuotes('"', quoteLevel).length).match(new RegExp('[^\\\\]' + escapeQuotes('"', quoteLevel), 'g')) !== null) {
						quoteLevel--;
					}

					for (var j = 0; j < stringKeys.length; j++) {

						if (input.substring(i, i + stringKeys[j].length + 1) == stringKeys[j] + ':' && input.substring(i + stringKeys[j].length + 1, i + stringKeys[j].length + 2) !== '\\' && input.substring(i + stringKeys[j].length + 1, i + stringKeys[j].length + 2) !== '"') {

							checkMini = i + stringKeys[j].length + 1;
							bracketLevel = 1;
							do {

								if (input.substring(checkMini, checkMini + 1) == '{' || input.substring(checkMini, checkMini + 1) == '[')
									bracketLevel++;
								if (input.substring(checkMini, checkMini + 1) == '}' || input.substring(checkMini, checkMini + 1) == ']')
									bracketLevel--;
								if (input.substring(checkMini, checkMini + 1) == ',' && bracketLevel == 1)
									bracketLevel = 0;

								checkMini++;

							} while (bracketLevel > 0);

							checkMini--; // It will have acquired one extra } at the end so remove it here

							// var unescapeQuotesTimes = 0;
							// if (input.substring(i + stringKeys[j].length + 1, checkMini).indexOf('Text1') > -1) {
							// 	unescapeQuotesTimes = 1;
							// }

							var checkNextQuote = input.substring(i + stringKeys[j].length + 1, checkMini);
							// check if the next quote in this variable is escaped to the next level. If it is, then don't mess with it any more
							var correctNextQuote = '\\\\"';
							var nextQuoteIsCorrect = false;
							for (var k = 0; k < checkNextQuote.length; k++) {

								if (checkNextQuote.substring(k-1, k+1).match(new RegExp('[^\\\\]\\"', 'g'))) {
									nextQuoteIsCorrect = false;
									break;
								}

								if (checkNextQuote.substring(k-1, k + correctNextQuote.length).match(new RegExp('[^\\\\]' + correctNextQuote, 'g'))) {
									nextQuoteIsCorrect = true;
									break;
								}

							}

							var newText = input.substring(0, i + stringKeys[j].length + 1) + escapeQuotes('"', quoteLevel) + escapeQuotes(input.substring(i + stringKeys[j].length + 1, checkMini), nextQuoteIsCorrect ? 0 : 1) + escapeQuotes('"', quoteLevel) + input.substring(checkMini, input.length);
							input = newText; // has to be in 2 separate lines so that the substrings in the line above can work correctly

						}

					}

				}

				input = input.replace(/\[[0-9]+\:\{/g, '[{');
				input = input.replace(/\}\,[0-9]+\:\{/g, '},{');

				input = input.replace(/\[([0-9.]+)[fd]?,([0-9.]+)[fd]?,([0-9.]+)[fd]?\]/g, '[$1,$2,$3]');

				return input;

			}

			function smoothQuotes(text) {

				// Removes gaps in escape sequences, such as changin "test\\\"hi\\\"test" to "test\"hi\"test"

				var currentLevel = 0;

				for (var i = 0; i < text.length; i++) {

					// Is already smooth and changes levels
					if (text.substring(i, i+escapeQuotes('"', currentLevel + 1).length).match(new RegExp('[^\\\\]' + escapeQuotes('"', currentLevel + 1), 'g')) !== null) {
						currentLevel++;
						//console.log('Went up at: ' + text.substring(i, i+50));
						//console.log('Level: ' + currentLevel);
					}

					if (currentLevel > 0 && text.substring(i, i+escapeQuotes('"', currentLevel - 1).length).match(new RegExp('[^\\\\]' + escapeQuotes('"', currentLevel - 1), 'g')) !== null) {
						currentLevel--;
						//console.log('Went down at: ' + text.substring(i, i+50));
						//console.log('Level: ' + currentLevel);
					}

					// Isn't smooth and jumps up levels
					for (var j = 2; j < 5; j++) {

						if (text.substring(i-1, i+escapeQuotes('"', currentLevel + j - 1).length).match(new RegExp('[^\\\\]' + escapeQuotes('"', currentLevel + j), 'g')) !== null) {

							var checkSmall = i+1;
							while (text.substring(i, checkSmall).match(new RegExp('[^\\\\]' + escapeQuotes('"', currentLevel), 'g')) == null && checkSmall <= text.length)
							{
								checkSmall++;
							}
							checkSmall -= escapeQuotes('"', currentLevel).length;

							//console.log('Found gap at: ' + text.substring(i, checkSmall));
							//console.log('Level: ' + currentLevel);

							text = text.substring(0, i) + unescapeQuotes(text.substring(i, checkSmall), j-1) + text.substring(checkSmall, text.length);

							currentLevel++;
							// i = checkSmall-1;
							// text = text.substring(0, i) + escapeQuotes('"', currentLevel) + text.substring(i+escapeQuotes('"', currentLevel + j).length, text.length);
							break;
						}

					}

				}

				return text;

			}

			var stringKeys = ['CustomName', 'Command', 'Name', 'Id'];

			function escapeQuotes(string, times) {
				// times = How many times to escape (defaults to 1 if not set)
				if (times === undefined) {
					times = 1;
				}

				for (var i = 0; i < times; i++) {
					string = string.replace(/\\/g, '\\\\');
					string = string.replace(/"/g, '\\"');
				}

				return string;
			}

			function unescapeQuotes(string, times) {
				// times = How many times to escape (defaults to 1 if not set)
				if (times === undefined) {
					times = 1;
				}

				for (var i = 0; i < times; i++) {
					string = string.replace(/\\\\/g, '\\');
					string = string.replace(/\\"/g, '"');
				}

				return string;
			}