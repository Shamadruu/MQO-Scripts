
function cleanLog(){
	var t = new Date().getTime();
	Number.prototype.format = function(){
	   return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	};
	
	var logs = {
		total : {name: "Total", rank: "", gold: 0, gems: 0, t1:0,t2:0,t3:0,t4:0,t5:0}
	};
	
	document.querySelectorAll("#ContentLoad > div:not(:first-child) > div > div:nth-child(2) > div:nth-child(even)").forEach(function(e){
		var logData = e.textContent.trim().replace(/-   /g, "-").split(/\ {2,}/); 
		logData.forEach(function(item,index,array){ 
			item = item.replace(/ /g, "").trim();
			
			var x = item.match(/\d+\.?\d*(\w)/);
			if(x !== null && isNaN(item)){ 
				x = x[1]
				item = item.trim().slice(0,-1);
				if(x == "k"){
					item *= 1000;
				}
				else if(x == "m"){
					item *= 1000000;
				}
				else if(x == "b"){
					item *= 1000000000 
				}
			
			};
			
			if(!isNaN(item)){ item = Math.round(Number(item)) }
	
			array[index] = item;
		});
		
		var entry = {};
		entry.name = logData[0];
		entry.rank = logData[1];
		entry.gold = logData[2];
		entry.gems = logData[3];
		entry.t1 = logData[4];
		entry.t2 = logData[5];
		entry.t3 = logData[6];
		entry.t4 = logData[7];
		entry.t5 = logData[8];
		if(logs[entry.name] !== undefined){
			logs[entry.name].gold += entry.gold;
			logs[entry.name].gems += entry.gems;
			logs[entry.name].t1 += entry.t1;
			logs[entry.name].t2 += entry.t2;
			logs[entry.name].t3 += entry.t3;
			logs[entry.name].t4 += entry.t4;
			logs[entry.name].t5 += entry.t5;
		}
		else{
			logs[entry.name] = entry;
		}
		logs.total.gold += entry.gold;
		logs.total.gems += entry.gems;
		logs.total.t1 += entry.t1;
		logs.total.t2 += entry.t2;
		logs.total.t3 += entry.t3;
		logs.total.t4 += entry.t4;
		logs.total.t5 += entry.t5;
	});
	
	document.querySelectorAll("#ContentLoad > div:not(:first-child) > div > div:nth-child(2) > div:not(:first-child)").forEach(function(e){
		e.innerHTML = "";
	});
	
	for(var e in logs){
		var ent = logs[e];
		var div = document.createElement("div");
		
		div.innerHTML += ('<div style="display:inline-block; width:80px; text-align:right; font-size:9pt;">' + ent.name + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt;">' + ent.rank + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.gold.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.gems.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.t1.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.t2.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.t3.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.t4.format() + '</div><div style="display:inline-block; width:55px; text-align:right; font-size:9pt; margin-left: 5px;">' + ent.t5.format() + '</div>');
		document.querySelector("#ContentLoad > div:not(:first-child) > div > div:nth-child(2) > div:not(:first-child)").appendChild(div);
	}
	console.log(new Date().getTime() - t);
}
cleanLog();
