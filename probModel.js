function probModel(controller){
	this.getFile = function(inputFile){
		var self = this;
		var file = inputFile.target.files[0];
		var fileName = inputFile.target.value.split('\\').pop();
		var reader = new FileReader();
		reader.readAsText(file);
		dataSplit = {};
		oldFactors = [];
		reader.onload = function(e){
			var csv = e.target.result;
			self.setUpDataVeiw(csv);
		}

	}
	this.setUpDataVeiw = function(csv){
		var parsed = d3.csv.parse(csv);
		inputData = parsed;
		dataHeadings = [];
		Object.keys(parsed[0]).forEach(function(d){dataHeadings.push([d,'n']); dataSplit[d] = []});
		
		inputData.forEach(function(row){
			dataHeadings.forEach(function(heading){
				dataSplit[heading[0]].push(row[heading[0]]);
				if(isNaN(row[heading[0]])){
					if(row[heading[0]] != "NA" && row[heading[0]] != "" && row[heading[0]] != " " && row[heading[0]] != "N\\A"){
						heading[1] = 'c';
					}
				}
			})
		})
		controller.finishedModelSU();
	}
	this.getHeading = function(i){
		if(i == -1) return '-';
		return this.getCategorical()[i];
	}
	this.getData = function(){
		return inputData;
	}

	this.getCategorical = function(){
		retList = [];
		dataHeadings.forEach(function(heading){if(heading[1] == 'c'){retList.push(heading)}});
		return retList;
	}
	this.getNumeretical = function(){
		retList = [];
		dataHeadings.forEach(function(heading){if(heading[1] == 'n'){retList.push(heading)}});
		return retList;
	}

}