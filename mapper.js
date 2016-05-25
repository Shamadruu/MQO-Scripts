/*
  Paste this into your console to use. Buttons to control it appear below your minimap.
  
  Press the "log view" button below the minimap to add your current view to the stored map
	The script requires that the values (such as tier chances) be visible to you. For example, you'd have to swap to the Resources 2 view for the script to be able to log T2 resources. However, it does it for all visible tiles.
	
	It can grab a small area (from the minimap) even if you don't have the map open.
  
	A feature to automatically log your view is planned for the future.
		
  Press the "display map" button to open a new window that displays the stored map. 
  You will need to have popups enabled for MQO for this to work.
 
  This is still a work in progress.
  
  **********
  CHANGELOG
  **********
  5/24/2016: First version; fixed coordinate system (Who uses an axial system, anyway?).
*/

(function(){
	var newWindow, map;

	if(!map){
		map = {};
	}
	if(localStorage.getItem("data")){
		map = load();
	}
	if(document.getElementById("mapper")){
		document.getElementById("mapper").remove();
	}
	document.getElementById("MapZone").innerHTML += '<div style="float:right;" id="mapper"><button id="logger">Log View</button><button id="display">Display Map</button></div>';
	
	document.getElementById("logger").addEventListener("click", function(){
		log();
		console.log('%cSuccess!', 'color: lime;');
	});
	document.getElementById("display").addEventListener("click", function(){
		display();
	});
	
	function uconcat(arr) {
		var a = arr.concat();
		for(var i=0; i<a.length; ++i) {
			for(var j=i+1; j<a.length; ++j) {
				if(a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	}
	
	function load() {
		return JSON.parse(atob(localStorage.getItem("data")));
	}
	
	function save(){
		localStorage.setItem("data", btoa(JSON.stringify(map)));
	}

	function reset() {
		map = {};
	}

	function log() {
		$("#map > g").find("g").each(function(){ 
			var tile = {};
			id = $(this).attr("id");
			if(!map[id]){
				map[id] = tile;
			}
			
			var coords = $(this).attr("id").replace(/x(?=\d+)|y(?=\d+)/g, " ").trim().split(" ");
			tile.x = ~~coords[0];
			tile.y = ~~coords[1];
			tile.centerX = tile.x+tile.y/2;
			tile.centerY = tile.y;
			
			
			
			tile.type = $(this).attr("class").replace(/tile-(?=\w+)| Kg[0-9]/g,"");
			tile.kingdom = $(this).attr("class").match(/Kg[0-9]/)||'';
			var text = $(this).text().replace(/(Tier(?= )[12345])/g, "$1 ");
			if(!map[id].monsters){
				map[id].monsters = [];
			};
			tile.monsters = map[id].monsters;
			
			if(text.indexOf("Tier 1") !== -1){
				tile.t1 = ~~text.replace(/Tier [12345]|%/g, "");
			}
			else if(text.indexOf("Tier 2") !== -1){
				tile.t2 = ~~text.replace(/Tier [12345]|%/g, "");
			}
			else if(text.indexOf("Tier 3") !== -1){
				tile.t3 = ~~text.replace(/Tier [12345]|%/g, "");
			}
			else if(text.indexOf("Tier 4") !== -1){
				tile.t4 = ~~text.replace(/Tier [12345]|%/g, "");
			}
			else if(text.indexOf("Tier 5") !== -1){
				tile.t5 = ~~text.replace(/Tier [12345]|%/g, "");
			}
			else if(text.search(/\d+,\d+/) === -1 && text !== ""){
				tile.monsters = uconcat(tile.monsters.concat(text.replace(/ +/g, "").split(",")));
			}
			Object.assign(map[id], tile);
		});
		save();
	}
	function constructSVG(svg,s){
		var m = load();
		var group = svg.getElementsByTagName('g')[0];
		var g = ''; 
		for(var t in m){
			var tile = m[t];
			tile.points = '';
			tile.points += [((tile.centerX + 1)*s*2), (((tile.centerY+1)*3*s/2)-s)].join(",");
			tile.points += ' ' + [(((tile.centerX + 1)*s*2)+s), (((tile.centerY+1)*3*s/2)-s/2)].join(",");
			tile.points += ' ' + [(((tile.centerX + 1)*s*2)+s), (((tile.centerY+1)*3*s/2)+s/2)].join(",");
			tile.points += ' ' + [((tile.centerX + 1)*s*2), (((tile.centerY+1)*3*s/2)+s)].join(",");
			tile.points += ' ' + [(((tile.centerX + 1)*s*2)-s), (((tile.centerY+1)*3*s/2)+s/2)].join(",");
			tile.points += ' ' + [(((tile.centerX + 1)*s*2)-s), (((tile.centerY+1)*3*s/2)-s/2)].join(",");
		
			g +='<g id="' + t + '" name="' + t + '" class="' + tile.type + ' ' + tile.kingdom + '"><polygon name="' + t + '" points="' + tile.points +'"></polygon><text><tspan name="' + t + '" x="' + ((tile.centerX+1)*s*2) + '" y="' + ((tile.centerY+1)*3*s/2) + '">'  + tile.x + ',' + tile.y +  '</tspan><tspan name="' + t + '" x="' + ((tile.centerX+1)*s*2) + '" y="' + (s/3+(tile.centerY+1)*3*s/2) + '">' + (tile.t1||"??") + '|' + (tile.t2||"??") +'|' +(tile.t3||"??") +'|' + (tile.t4||"??") +'|' + (tile.t5||"?") + '</tspan></g>';
		}
		group.innerHTML = g;
	}
	function constructWindow(){
		var size = 10;
		var scale = 1;
		var head = newWindow.document.getElementsByTagName("head")[0];
			head.innerHTML = "<style>body { background: #666666; margin:0;} #newMap { width: 100%; height: 90%; vertical-align:bottom; background-color: #666666;} #navbar { width: 100%; height: 10%; background-color: white;vertical-align: top; position:relative;} polygon {stroke: hsl(0, 0%, 70%); stroke-width: 0.01%;} g > text {text-anchor:middle;font-size: 5.5px; font-stretch: extra-condensed;} g > text > tspan:nth-of-type(2){ font-size: 0.65em;} .plain polygon{fill: hsl(72, 87%, 71%);} .city polygon{fill: hsl(43, 26%, 46%);} .lake polygon{fill:hsl(231, 91%, 62%);} .forest polygon{fill:hsl(108, 26%, 32%);} .swamp polygon{fill:hsl(72, 8%, 31%);} .rock polygon{fill: hsl(172, 4%, 46%);} .Kg1 polygon, .Kg2 polygon {stroke: hsl(348, 83%, 47%) !important; stroke-width: 0.05% !important;}}";
			
			//If the navbar does not exist, assume that this is an entirely new window.
			if(!newWindow.document.getElementById("navbar")){
				newWindow.document.getElementsByTagName("body")[0].innerHTML = '<div id="navbar"></div><div><svg id="newMap"><g></g></svg></div>';
				newWindow.document.getElementById("navbar").innerHTML = '<table style="height: 100%;display: inline-block;position: absolute;left: 2.5%;width: 37.5%;"> <thead> <tr> <th colspan="2">Target Tile</th> <th colspan="2">Scale</th> </tr> </thead> <tbody> <tr> <th>X-Coord: </th> <td><input id="tileX" type="number" value="0"></td> <th>Scale: </th> <td><input id="scale" type="number" value="1"></td> </tr> <tr> <th>Y-Coord: </th> <td><input id="tileY" type="number" value="0"></td> <td>&nbsp;</td> <td>&nbsp;</td> </tr> </tbody> </table><table style="height: 100%;display: inline-block;position: absolute;left: 40%;width: 20%;"> <thead> <tr> <th colspan="5">Filter (Thresholds)</th> </tr> </thead> <tbody> <tr> <th>T1</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th> </tr> <tr> <td><input id="t1" type="number" min="40" max="90" style="width:75%;" value="40"></td><td><input id="t2" type="number" min="20" max="60" style="width:75%;" value="20"></td><td><input id="t3" type="number" min="10" max="30" style="width:75%;" value="10"></td><td><input id="t4" type="number" min="5" max="15" style="width:75%;" value="5"></td><td><input id="t5" type="number" min="0" max="5" style="width:75%;" value="0"></td> </tr><tr> <th colspan="2">Type: </th> <td colspan="3"><select id="type"><option value="rock">rock</option><option value="plain">plain</option><option value="lake">lake</option><option value="forest">forest</option><option value="city">city</option><option value="swamp">swamp</option><option value="none">none</option></select></td></tr> </tbody></table><table id="data" style="height: 100%;top: 0px;display: inline-block;position: absolute;right: 2.5%;width: 37.5%;"><thead> <tr> <th colspan="6">Tile Data</th> </tr> </thead> <tbody> <tr> <th>Coords: </th> <td>(388,408)</td> <th>Type: </th> <td>lake</td> <th>Kingdom: </th> <td></td> </tr> <tr> <th>Tier %:</th> <th>T1: 71%</th> <th>T2: 39%</th> <th>T3: ??%</th> <th>T4: ??%</th> <th>T5: ??%</th> </tr> <tr> <th>Monsters:</th> <th>250</th> <th>???</th> <th>???</th> <th>???</th> <th>???</th> </tr> </tbody></table>';
			}
			var newMap = newWindow.document.getElementById("newMap");
			constructSVG(newMap, size);
			
			//Prevent duplicate handlers
			newMap.removeEventListener("click", handleClick)
			newWindow.document.getElementById("tileX").removeEventListener("change", handleX);
			newWindow.document.getElementById("tileY").removeEventListener("change", handleY);
			newWindow.document.getElementById("t1").removeEventListener("change", handleFilter);
			newWindow.document.getElementById("t2").removeEventListener("change", handleFilter);
			newWindow.document.getElementById("t3").removeEventListener("change", handleFilter);
			newWindow.document.getElementById("t4").removeEventListener("change", handleFilter);
			newWindow.document.getElementById("t5").removeEventListener("change", handleFilter);
			newWindow.document.getElementById("type").addEventListener("change", handleFilter);
			
			newMap.addEventListener("click", handleClick);
			newWindow.document.getElementById("tileX").addEventListener("change", handleX);
			newWindow.document.getElementById("tileY").addEventListener("change", handleY);
			newWindow.document.getElementById("scale").addEventListener("change", handleZoom);
			newWindow.document.getElementById("t1").addEventListener("change", handleFilter);
			newWindow.document.getElementById("t2").addEventListener("change", handleFilter);
			newWindow.document.getElementById("t3").addEventListener("change", handleFilter);
			newWindow.document.getElementById("t4").addEventListener("change", handleFilter);
			newWindow.document.getElementById("t5").addEventListener("change", handleFilter);
			newWindow.document.getElementById("type").addEventListener("change", handleFilter);
			
			function handleClick(e){
				if(e.toElement != newMap && e.target.attributes.name !== undefined){
					tileData(e.target.attributes.name.value);
				}
				//Just in case
				e.stopImmediatePropagation();
			}
			function handleX(e){
				var v = ~~e.target.value;
				if(v && v >= 0 && v <= 1000){
					;
					var x =  -(~~e.target.value + ~~newWindow.document.getElementById("tileY").value/2)*size*2;
					newMap.currentTranslate.x = (scale*x)+newMap.width.animVal.value/2;
				}
				e.stopImmediatePropagation();
			}
			function handleY(e){
				var v = ~~e.target.value;
				if(v && v >= 0 && v <= 1000){
					var y =  -(~~v) *3*size/2;
					newMap.currentTranslate.y = (scale*y)+newMap.height.animVal.value/2;
				}
				e.stopImmediatePropagation();
			}
			
			function handleZoom(e){
				var v = ~~e.target.value;
				if(v && v > 0 && v <= 20){
					newMap.currentTranslate.x = ((newMap.currentTranslate.x-newMap.width.animVal.value/2 )*v/scale)+newMap.width.animVal.value/2;
					newMap.currentTranslate.y = ((newMap.currentTranslate.y-newMap.height.animVal.value/2 )*v/scale)+newMap.height.animVal.value/2;;
					newMap.getElementsByTagName('g')[0].style.transform = 'scale(' + v + ')';
					scale = v;
				}
				e.stopImmediatePropagation();
			}
			
			function tileData(t){
				var tile = map[t];
				newWindow.document.getElementById("data").innerHTML = '<thead> <tr> <th colspan="6">Tile Data</th> </tr> </thead> <tbody> <tr> <th>Coords: </th> <td>(' + tile.x + ',' + tile.y+ ')</td> <th>Type: </th> <td>' + tile.type + '</td> <th>Kingdom: </th> <td>' + tile.kingdom + '</td> </tr> <tr> <th>Tier %:</th> <th>T1: ' + (tile.t1||"??") + '%</th> <th>T2: ' + (tile.t2||"??") + '%</th> <th>T3: ' + (tile.t3||"??") + '%</th> <th>T4: ' + (tile.t4||"??") + '%</th> <th>T5: ' + (tile.t5||"??") + '%</th> </tr> <tr> <th>Monsters:</th> <th>' +  (tile.monsters[0]||"???") + '</th> <th>' + (tile.monsters[1]||"???") + '</th> <th>' +  (tile.monsters[2]||"???") + '</th> <th>' +  (tile.monsters[3]||"???") + '</th> <th>' + (tile.monsters[4]||"???") + '</th> </tr> </tbody>'
			}
			
			function handleFilter(e){
				var t1 = ~~newWindow.document.getElementById("t1").value;
				var t2 = ~~newWindow.document.getElementById("t2").value;
				var t3 = ~~newWindow.document.getElementById("t3").value;
				var t4 = ~~newWindow.document.getElementById("t4").value;
				var t5 = ~~newWindow.document.getElementById("t5").value;
				var type = newWindow.document.getElementById("type").value;
				t1 = (t1 >= 40 && t1 <= 90) ? t1 : 40;
				t2 = (t2 >= 20 && t2 <= 60) ? t2 : 20;
				t3 = (t3 >= 10 && t3 <= 30) ? t3 : 10;
				t4 = (t4 >= 5 && t4 <= 15) ? t4 : 5;
				t5 = (t5 >= 0 && t5 <= 5) ? t5 : 0;
				filter(t1,t2,t3,t4,t5,type);
				e.stopImmediatePropagation();
			}
			
			function filter(t1,t2,t3,t4,t5,type){
				for(var t in map){
					//If only let weren't strict mode specific...
					/*console.log(t1 + ' ' + t2 + ' ' + t3 + ' ' + t4 + ' ' + t5);
					console.log(tile);*/
					var tile = map[t];
					var element = newWindow.document.getElementById(t).getElementsByTagName("text")[0];
					if((~~tile.t1 >= t1 || !tile.t1) && (~~tile.t2 >= t2 || !tile.t2) && (~~tile.t3 >= t3 || !tile.t3) && (~~tile.t4 >= t4 || !tile.t4) && (~~tile.t5 >= t5 || !tile.t5) && !(!tile.t1 && !tile.t2 && !tile.t3 && !tile.t4 && !tile.t5) && (type == tile.type || type == "none")){
						element.style.fill = "hsl(0, 100%, 50%)";
						
						
					}
					else{
						element.style.fill = "";
					}
				}
			}
	}
	function display() {
		newWindow = window.open("", "MQOMap", "width=750px,height=750px");
		
		if(!newWindow){
			alert("To display the map, you must enable popups within MQO.");
		}
		else{ 
			constructWindow();
		}
	}
})();

