var chinaObj = countryRegion[239];
var chinaState = chinaObj.State;
var op = CityData_PC.Provinces;
var oc = CityData_PC.Citys;

for (var i = 0, len = op.length; i < len; i++) {
	var ck = op[i].k;
	for (var j = 0, len1 = chinaState.length; j < len1; j++) {
		var curName = chinaState[j].Name;
		if (!chinaState[j].City) {
		    chinaState[j].City= [];
		}
		if (ck.indexOf(curName) == 0) {
			chinaState[j].Name = ck;
			var curCities = [];
			for (var k = 0, len2 = oc.length; k < len2; k++) {
				var ocV = oc[k].v;
				if (ocV.indexOf(curName) == 0) {
					curCities.push(oc[k].k);
				}
			}
			chinaState[j].City.length = 0;
			for (var m = 0, len3 = curCities.length; m < len3; m++) {
				chinaState[j].City.push({
					Name: curCities[m],
					Code: m
				});
			}
		}
	}
}
countryRegion[239].State = chinaState;
