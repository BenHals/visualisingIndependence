function eiko(controller, factors, iD, speed){
	this.paused = false;
	pauseDelay = 500*(1/speed);
	transTime = 1000*(1/speed);
	fontMulti = controller.view.getFont();
	var self = this;
	factor1 = factors[0][0];
	factor2 = factors[1][0];
	self.noFactors = false;
	self.oneFactor = false;
	strokeSize = 10;
	
	if(factor2 == '-'){
		if(factor1 == '-'){
			self.noFactors = true;
		}else{
			self.oneFactor = true;
		}
	}else{
		if(factor1 == '-'){
			self.noFactors = true;
		}
	}
	self.F2Ok = !self.oneFactor;
	var mainScreen = d3.select("#eikosogram").append("svg").style('width','100%').style('height','100%');
	$('#eikosogram').click(function(){
			controller.continue();
		})
	wP = new WindowPos([0, parseInt(mainScreen.style('width'),10), 0,parseInt(mainScreen.style('height'),10)]);
	this.mainWp = wP;
	eKRect = [wP.fifthsW[1][0]/2,wP.fifthsW[3][1]-wP.fifthsW[1][0]/2,50,(wP.fifthsW[3][1]-wP.fifthsW[1][0])+10];
	this.init = function(){
		d3.select("#eikosogram").attr('height',$(window).height());
		d3.select(".container-fluid").style('height','100%');
		d3.select(".row").style('height','100%');
		calRet =this.calcSecondaryFactor(factor1,factor2, iD);
		this.aFs = calRet[0];
		this.secValues = calRet[1];
		pColors = randomColors(d3.keys(this.aFs[d3.keys(this.aFs)[0]]['secondary'][0]).length);
		pColsScale = d3.scale.category10();
		if(!self.noFactors){
			this.drawPrimary(mainScreen, eKRect);
		}
	}
	this.speedChanged = function(ns){
		pauseDelay = 500*(1/ns);
		transTime = 1000*(1/ns);
	}
	this.fontChanged = function(nS){
		oldSize = fontMulti;
		fontMulti = nS;
		diff = fontMulti/oldSize;
		if(diff != 1){
			d3.selectAll('text').attr('font-size', function(){return d3.select(this).attr('font-size')*diff})
			.attr('y', function(){
					if(oldSize > nS){
						return parseInt(d3.select(this).attr('y'))-1;
					}
					else{
						return parseInt(d3.select(this).attr('y'))+1;
					}
				});
		}
	}
	this.drawPrimary = function(screen,rect){
		primeWP = new WindowPos(rect);
		var propToScreen = d3.scale.linear().domain([0,1]).range([rect[0],rect[1]]);
		this.yScale = d3.scale.linear().domain([0,1]).range([rect[2],rect[3]]);
		container = screen.append("svg").attr('id','mainSquare');
		this.drawPop(primeWP,container,rect, propToScreen);
		screen.append('svg').attr('id','colorHolder');
		// var cumulativeProp = 0;
		// var rectSplit = screen.selectAll('rect').data(d3.keys(this.aFs));
		// 	rectSplit.enter().append('rect')
		// 		.attr('x', function(d){
		// 			var ret = propToScreen(cumulativeProp);
		// 			cumulativeProp += self.aFs[d]['prob'];
		// 			return  ret})
		// 		.attr('width', function(d){
					
		// 			 return propToScreen(self.aFs[d]['prob'])})
		// 		.attr('y', function(d){return rect[2]})
		// 		.attr('height', function(d){return rect[3]-rect[2]})
		// 		.style('fill',function(d,i){return d3.rgb(pColors[i][0][0],pColors[i][0][1],pColors[i][0][2])});
		//this.randSquare(screen, primeWP);
	}
	this.drawPop = function(wP,screen,rect, scale){
		//Base Rectangle
		screen.append('rect').attr('class','background').attr('x',rect[0]).attr('y',rect[2]).attr('width',rect[1]-rect[0]).attr('height',rect[3]-rect[2]).style('fill', 'grey').style('stroke','black').style('stroke-width',strokeSize).style('stroke-alignment','outer').style('fill-opacity',0.2);
		screen.append('rect').attr('class','background').attr('x',rect[0]).attr('y',rect[2]).attr('width',rect[1]-rect[0]).attr('height',rect[3]-rect[2]).style('fill', 'lightgrey').style('fill-opacity',1);

		//Population Number
		screen.append('text').attr('id','popNum').attr('x',middle(rect[1],rect[0])).attr('y',middle(rect[3],rect[2])).attr('text-anchor','middle').attr('font-size',wP.fontSize*2*fontMulti)
				.style('fill','black').style('opacity',0.8)
				.text(iD.length);
		//Individuals
		screen.append('text').attr('id','individuals').attr('x',middle(rect[1],rect[0])).attr('y',middle(rect[3],rect[2])+wP.fontSize*fontMulti*2).attr('text-anchor','middle').attr('font-size',wP.fontSize*fontMulti*2)
				.style('fill','black').style('opacity',0.8)
				.text('Individuals');
		//Total
		screen.append('line').attr('class','totals').attr('x1', rect[1]+strokeSize/2).attr('y1', rect[3]+strokeSize/2).attr('x2', rect[1] +strokeSize/2+ 50).attr('y2', rect[3]+strokeSize/2).style('stroke-width', strokeSize/4).style('stroke','black').style('opacity',0);
		screen.append('line').attr('class','totals').attr('x1', rect[1]+strokeSize/2).attr('y1', rect[3]+strokeSize/2).attr('x2', rect[1]+strokeSize/2).attr('y2', rect[3] +strokeSize/2 + 50).style('stroke-width', strokeSize/4).style('stroke','black').style('opacity',0);
		screen.append('text').attr('class', 'totals totalsValues').attr('x', rect[1] +strokeSize).attr('y', rect[3] + strokeSize + 25).attr('font-size',wP.fontSize*fontMulti)
				.style('fill','black').style('opacity',0)
				.text(iD.length)
				.attr('count', iD.length)
				.attr('colProp', null)
				.attr('totProp', 1);
		if(controller.showTotal && controller.currentShow != 'None'){
			d3.selectAll('.totals').style('opacity',1);
		}
		setTimeout(function(){self.shiftDown(wP,screen,rect, scale)}, pauseDelay);
	}
	this.shiftDown = function(wP,screen,rect, scale){
		var popNum = d3.select('#popNum');
		var individuals = d3.select('#individuals');
		var pfTitle = screen.append('text').attr('id','pFTitle').attr('x',middle(rect[1],rect[0])).attr('y',wP.fifthsH[4][1]+wP.fontSize*fontMulti*2).attr('text-anchor','middle').attr('font-size',wP.fontSize*fontMulti*2)
				.style('fill','black').style('opacity',0)
				.text(factor1);
		var pfTotal = screen.append('text').attr('id','pFTotal').attr('class','totals').attr('x',rect[0]-strokeSize).attr('y',wP.fifthsH[4][1]+wP.fontSize*fontMulti*2).attr('text-anchor','end').attr('font-size',wP.fontSize*fontMulti)
				.style('fill','black').style('opacity',0)
				.text('total');
		var t0 = screen.transition().delay(pauseDelay).duration(transTime);
		t0.select('#popNum').attr('y',wP.fifthsH[3][1]);
		t0.select('#individuals').attr('y',wP.fifthsH[3][1]+wP.fontSize*fontMulti*2).each('end',function(){
			//self.animateSplit(wP,screen,rect, scale);
			self.stopPoint(wP,screen,rect, scale, self.fadeName);
		});;

	}
	this.fadeName = function(wP,screen,rect, scale){
		var t1 = screen.transition().duration(transTime);
		if(controller.showTotal && controller.currentShow != 'None'){
			d3.select('#pFTotal').transition().duration(transTime).style('opacity',1);
		}
		t1.select('#pFTitle').style('opacity',1).each('end',function(){
			//self.animateSplit(wP,screen,rect, scale);
			self.animateSplit(wP,screen,rect, scale, self.animateSplit);
		});;

	}
	this.animateSplit = function(wP,screen,rect, scale){
		//create containers for each column
		self.pFCols = screen.selectAll('g').data(d3.keys(self.aFs)).enter().append('g').attr('class','pFCols');
		var text = self.pFCols.append('text').attr('class','pgCount').attr('x',middle(rect[1],rect[0])).attr('y',wP.fifthsH[3][1]).attr('text-anchor','middle').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(function(d){return self.aFs[d]['num']});
		var cumulativeProp = 0;
		var textTotalText = self.pFCols.append('text').attr('class','totals totalsValues').attr('x',function(d,i){
				cumulativeProp += self.aFs[d]['prob']; 
				return scale(cumulativeProp - self.aFs[d]['prob']/2)}).attr('y',wP.fifthsH[4][1]+wP.fontSize*fontMulti*2).attr('text-anchor','middle').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(function(d){return self.aFs[d]['num']})
			.attr('count', function(){return d3.select(this).text()})
			.attr('totProp', function(){return Math.round(parseInt(d3.select(this).attr('count'))/iD.length * 100)/100})
			.attr('colProp', 1);
		cumulativeProp = 0;
		var names = self.pFCols.append('text').attr('class','pgName').attr('y',wP.fifthsH[1][1]+wP.fontSize*fontMulti).attr('x',function(d){
				cumulativeProp += self.aFs[d]['prob']; 
				return scale(cumulativeProp - self.aFs[d]['prob']/2)}).attr('text-anchor','middle').attr('font-size',function(d){return wP.fontSize*fontMulti})
			.style('fill','black').style('opacity',0)
			.text(function(d){return d});
		cumulativeProp = 0;
		var count = d3.keys(self.aFs).length;
		text.transition().delay(function(d,i){
			return 0;
			var retVal = i*(transTime+(pauseDelay/5));
			return retVal;}).duration(transTime)
			.attr('y',wP.fifthsH[1][1]).attr('x',function(d,i){
				cumulativeProp += self.aFs[d]['prob']; 
				return scale(cumulativeProp - self.aFs[d]['prob']/2)})
			.style('opacity',1).style('fill','black').style('stroke','black').style('stroke-width',0);
		cumulativeProp = 0;
		names.transition().delay(function(d,i){
			return transTime*0.8;
			var retVal = (i+1)*(transTime)+(i*(pauseDelay/5));
			return retVal;}).duration(100)
			.style('opacity',1).transition().duration(pauseDelay)
			.each('end', function(d,i){count--;if(count==0){self.fadeGN(wP,screen,rect, scale)}});
	}
	this.fadeGN = function(wP,screen,rect, scale){

		var popNum = d3.select('#popNum');
		var individuals = d3.select('#individuals');
		self.pFCols = d3.selectAll('.pFCols');
		var cumulativeProp = 0;
		var count = d3.keys(self.aFs).length;
		// var text = self.pFCols.append('text').attr('class','pgName').attr('y',wP.fifthsH[1][1]+wP.fontSize).attr('x',function(d){
		// 		cumulativeProp += self.aFs[d]['prob']; 
		// 		return scale(cumulativeProp - self.aFs[d]['prob']/2)}).attr('text-anchor','middle').attr('font-size',wP.fontSize)
		// 	.style('fill','grey').style('opacity',0)
		// 	.text(function(d){return d});
		var text = d3.selectAll('.pgName')
		individuals.transition().duration(transTime).style('opacity',0).each('end',function(){d3.select(this).remove()});
		popNum.transition().duration(transTime).style('opacity',0).each('end', function(d,i){
				//count--;
				//if(count == 0){
					self.nameDrop(wP,screen,rect, scale);
				//};
			});
		// text.transition().duration(transTime).style('opacity',1).style('fill','white').style('stroke','black')
		// 	.each('end', function(d,i){
		// 		count--;
		// 		if(count == 0){
		// 			self.nameDrop(wP,screen,rect, scale);
		// 		}
		// 	})

	}
	this.nameDrop = function(wP,screen,rect, scale){
		var count = d3.keys(self.aFs).length;
		d3.select('#pFTitle').transition().duration(transTime).attr('y',wP.fifthsH[4][1] + wP.fontSize*fontMulti*7)
		d3.selectAll('.pgName').transition().duration(transTime)
			.attr('y', function(d,i){return wP.fifthsH[4][1]+wP.fontSize*fontMulti*5 - 5*((i%2))})
			.each('end',function(){
				count--;
				if(count==0){
					self.drawCols(wP,screen,rect, scale);
				}
			});

	}
	this.drawCols = function(wP,screen,rect, scale){
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//left edge
		self.pFCols.append('g').attr('id','colRectHolder');
		self.pFCols.append('line').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			var retVal = cProbX2;
			cProbX2 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[4][1]).attr('class',function(d){
			var fTest = cProbIsOuter;
			cProbIsOuter += self.aFs[d]['prob'];
			var eTest = cProbIsOuter;
			if(fTest == 0){
				return 'outerBound';
			}else{
				return 'innerBound';
			}
		}).style('stroke-width', strokeSize/2).style('stroke','black').style('opacity',0).attr('width', function(){
			return parseInt(d3.select(this).attr('x2')) - parseInt(d3.select(this).attr('x1'));
		});
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//right edge
		self.pFCols.append('line').attr('x1', function(d){
			
			cProbX1 += self.aFs[d]['prob'];
			var retVal = cProbX1;
			return scale(retVal);
		}).attr('x2', function(d){
			
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[4][1]).attr('class',function(d){
			var fTest = cProbIsOuter;
			cProbIsOuter += self.aFs[d]['prob'];
			var eTest = cProbIsOuter;
			if(eTest == 1){
				return 'outerBound';
			}else{
				return 'innerBound';
			}
		}).style('stroke-width', strokeSize/2).style('stroke','black').style('opacity',0).attr('width', function(){
			return parseInt(d3.select(this).attr('x2')) - parseInt(d3.select(this).attr('x1'));
		});
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//top
		self.pFCols.append('line').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[0][0]).attr('class','outerBound')
		.style('stroke-width', strokeSize/2).style('stroke','black').style('opacity',0).attr('width', function(){
			return parseInt(d3.select(this).attr('x2')) - parseInt(d3.select(this).attr('x1'));
		});
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//bottom
		self.pFCols.append('line').attr('id','bLine').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[4][1]).attr('y2',wP.fifthsH[4][1]).attr('class','outerBound')
		.style('stroke-width', strokeSize/2).style('stroke','black').style('opacity',0).attr('width', function(){
			return parseInt(d3.select(this).attr('x2')) - parseInt(d3.select(this).attr('x1'));
		});

		var innerCols = d3.selectAll('.innerBound')
		var count = innerCols.length;
		innerCols.attr('y2', function(d){return d3.select(this).attr('y1')}).style('opacity',1)
			.transition().duration(transTime)
			.attr('y2',wP.fifthsH[4][1])
			.transition().duration(pauseDelay)
			.each('end',function(){
				count--;
				oneFactor = false;
					if(factor2 == '-'){
							oneFactor = true;
						}
				if(count==0){
					if(controller.showTotal){
						d3.selectAll('.totals').style('opacity',1);
					}
					//self.splitCol(d3.select('.pFCols'),0, wP,screen,rect, scale)
					self.stopPoint(wP,screen,rect, scale,self.secondaryTitle);
				}
			});

	}
	this.secondaryTitle = function(wP,screen,rect, scale){
		var sfTitle = screen.append('text').attr('id','sFTitle').attr('y',self.mainWp.fifthsW[0][0] + wP.fontSize*fontMulti*2 + 10).attr('x',self.mainWp.fifthsW[4][0]-20).attr('text-anchor','left').attr('font-size',wP.fontSize*fontMulti*2)
		.style('fill','black').style('opacity',0)
		.text(factor2);
		var sfTotal = screen.append('text').attr('id','sFTotal').attr('class','totals').attr('y',self.mainWp.fifthsW[0][0] + wP.fontSize*fontMulti*2 + 10).attr('x', strokeSize + rect[1]).attr('text-anchor','start').attr('font-size',wP.fontSize*fontMulti)
		.style('fill','black').style('opacity',0)
		.text('total');
		if(controller.showTotal && controller.currentShow != 'None'){
			sfTotal.transition().duration(transTime).style('opacity',1);
		}
		sfTitle.transition().duration(transTime).style('opacity',1).each('end',function(){self.nameSecondary(wP,screen,rect, scale);});

	}
	this.secondSplit = function(wP,screen,rect, scale){
		var count = self.pFCols[0].length;
		self.pFCols[0].reverse();
		self.pFCols.each(function(d,i){
			count--;
			var isLast = (count==0);
			var thisCol = d3.select(this);
			setTimeout(function(){self.splitCol(thisCol,i,wP,screen,rect, scale, isLast)},i*(transTime+pauseDelay));
		})
	}
	this.nameSecondary = function(wP,screen,rect, scale){
		self.colorMap = new Object();
		var secondaryCounts = self.aFs[d3.keys(self.aFs)[d3.keys(self.aFs).length-1]]['secondary'][1];

		var secNames = d3.keys(secondaryCounts).sort();
		var nameSet = new Set(self.secValues);
		secNames.forEach(function(value){
			nameSet.delete(value);
		});

		var prevY = 0;
		var yValue = 0;
		for(var i = 0; i<secNames.length-1;i++){
			yValue = self.yScale(middle(prevY, prevY+secondaryCounts[secNames[i]]));
			prevY += secondaryCounts[secNames[i]];
			screen.append('text').attr('class','sfNames').attr('x',self.mainWp.fifthsW[4][0]+10).attr('y',yValue).attr('text-anchor','left').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(secNames[i]);
			screen.append('text').attr('class','totals totalsValues').attr('x',rect[1] + strokeSize).attr('y',yValue).attr('text-anchor','start').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(self.secC[secNames[i]])
			.attr('count', self.secC[secNames[i]])
			.attr('totProp', Math.round(self.secC[secNames[i]]/iD.length*100)/100)
			.attr('colProp', null);
			screen.append('rect').attr('class','sfColor').attr('x',self.mainWp.fifthsW[4][0]-20).attr('width',20).attr('y',yValue-15).attr('height',20)
				//.style('fill', d3.rgb(pColors[i][0], pColors[i][1],pColors[i][2])).style('opacity',0);
				.style('fill', pColsScale(i)).style('opacity',0).style('stroke','black').style('stroke-width',2).style('stroke-alignment','outer');
			self.colorMap[secNames[i]] = pColsScale(i);
		}
		var colCount = secNames.length-1;
		for(let item of nameSet){
			yValue += wP.fontSize*fontMulti*2;
			screen.append('text').attr('class','sfNames').attr('x',self.mainWp.fifthsW[4][0]+10).attr('y',yValue).attr('text-anchor','left').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(item);
			screen.append('text').attr('class','totals totalsValues').attr('x',rect[1] + strokeSize).attr('y',yValue).attr('text-anchor','start').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('opacity',0)
			.text(self.secC[item])
			.attr('count', self.secC[item])
			.attr('totProp', Math.round(self.secC[item]/iD.length*100)/100)
			.attr('colProp', null);
			screen.append('rect').attr('class','sfColor').attr('x',self.mainWp.fifthsW[4][0]-20).attr('width',20).attr('y',yValue-25).attr('height',20)
				//.style('fill', d3.rgb(pColors[i][0], pColors[i][1],pColors[i][2])).style('opacity',0);
				.style('fill', pColsScale(colCount)).style('stroke','black').style('stroke-width',2).style('stroke-alignment','outer');
			self.colorMap[item] = pColsScale(colCount);
			colCount++;

		}
		var count = secNames.length-1;
		d3.selectAll('.sfColor').transition().duration(transTime).style('opacity', 1);
		d3.selectAll('.sfNames').transition().duration(transTime).style('opacity',1).transition().duration(pauseDelay).each('end', function(){
			count--;
			if(count==0){
				self.secondSplit(wP,screen,rect, scale);
			}
		});
		
	}
	this.splitCol = function(col,colI, wP,screen,rect, scale, isLast){

		var secondaryCounts = self.aFs[col.data()]['secondary'][0];
		var secondaryProbs = self.aFs[col.data()]['secondary'][1];
		var names = d3.keys(secondaryCounts).sort();
		var cProb = 0;
		var cProbY = 0;
		var yValues = [];
		var divPositions = [];
		for(var j =0;j<d3.keys(secondaryCounts).length-1;j++){
			col.select('#colRectHolder').append('rect').attr('class','secondRect').attr('name',names[j]).attr('x', col.select('#bLine').attr('x1')).attr('height',function(d){
				var name = names[j];
				var prob = secondaryProbs[name];
				var retPos = self.yScale(prob)-self.yScale(0);
				return retPos;
			}).attr('y',function(d){
				var retValue = cProbY;
				var name = names[j];
				var prob = secondaryProbs[name];
				cProbY += prob;
				divPositions.push(cProbY);
				return self.yScale(retValue);
			}).attr('width',col.select('#bLine').attr('x2') - col.select('#bLine').attr('x1'))
			.style('fill', function(){
				//var retVal =  pColsScale(j);
				var col = names[j];
				var retVal = self.colorMap[col];
				return retVal;}).style('opacity',0);
			col.append('line').attr('class','sColDivider').attr('x1',col.select('#bLine').attr('x1')).attr('x2',col.select('#bLine').attr('x1'))
				.attr('y1', self.yScale(divPositions[j])).attr('y2',self.yScale(divPositions[j]))
				.style('stroke', 'black').style('stroke-width',2).style('opacity',1).attr('width', function(){
			return parseInt(d3.select(this).attr('x2')) - parseInt(d3.select(this).attr('x1'));
		});
			col.append('text').attr('id',colI+'-'+j+'text').attr('data-name',names[j]).attr('class', 'secondaryCounts').attr('y',wP.fifthsH[1][1]).attr('x',col.select('.pgCount').attr('x')).attr('text-anchor','middle').attr('font-size',wP.fontSize*fontMulti)
			.style('fill','black').style('stroke','black').style('opacity',1).style('stroke-width',0)
			.text(secondaryCounts[names[j]]);


		}
		cProb = 0;
		col.selectAll('.secondRect').transition().duration(transTime)
			.style('opacity',0.8);
		col.selectAll('.sColDivider').transition().duration(transTime).attr('x2',col.select('#bLine').attr('x2'));
		col.selectAll('.secondaryCounts').transition().duration(transTime)
			.attr('y', function(d){
				// var name = d3.select(this).attr('data-name');
				// var prob = secondaryProbs[name];
				// var yPos = middle(cProb, cProb+prob);
				// cProb += prob;
				// var retPos = self.yScale(yPos)
				// return retPos;
				var retValue = cProb;
				var name = d3.select(this).attr('data-name');
				var prob = secondaryProbs[name];
				cProb += prob;
				var ret = self.yScale(middle(retValue,cProb))+wP.fontSize*fontMulti/2;
				yValues.push(ret);
				return ret;
			})
		col.select('.pgCount').transition().duration(transTime).style('opacity',0).transition().duration(pauseDelay*2).each('end',function(){
			d3.select(this).remove()
			if(isLast){
				//self.nameSecondary(wP,screen,rect, scale, yValues);
				controller.getShowData();
				
				
			}});
	}

	this.shiftCols = function(){
		return;
		var newScale = d3.scale.linear().domain([eKRect[0], eKRect[1]]).range([eKRect[0] - 50, eKRect[1] + 50]);
		self.pFCols.selectAll('g').each(function(){
			var gr = d3.select(this);
			var newX = newScale(parseInt(gr.select('rect').attr('x')));
			var difference = parseInt(gr.select('rect').attr('x')) - newX;
			gr.selectAll('*').attr('transform','translate('+difference+',0)');
		})
		d3.selectAll('.background').style('opacity',0);
		d3.selectAll('.outerBound').style('opacity',1);
		d3.selectAll('.innerBound').style('opacity',1);
	}
	this.unshiftCols = function(){
		return;
		var newScale = d3.scale.linear().domain([eKRect[0], eKRect[1]]).range([eKRect[0] - 50, eKRect[1] + 50]);
		self.pFCols.selectAll('g').each(function(){
			var gr = d3.select(this);
			var newX = newScale.invert(parseInt(gr.select('rect').attr('x')));
			var difference = parseInt(gr.select('rect').attr('x')) - newX;
			gr.selectAll('*').attr('transform','translate('+difference+',0)');
		})
		d3.selectAll('.background').style('opacity',1);
		d3.selectAll('.outerBound').style('opacity',0);
		d3.selectAll('.innerBound').style('opacity',1);
	}
	this.calcPrimaryFactor = function(factor, iL){
		fTotals = new Object();
		totalNum = 0;
		for (index in iL){
			var o = iL[index];
			val = o[factor];
			if(val in fTotals){
				fTotals[val] += 1;
			}else{
				fTotals[val] = 1;
			}
			totalNum++;
		}
		fTotals['total'] = totalNum;
		fProbs = new Object();
		for (v in fTotals){
			fProbs[v] = fTotals[v]/totalNum;
		}
		return [fTotals,fProbs];
	}
	this.calcSecondaryFactor = function(pF,sF, iL){
		AllProbs = new Object();
		primeSplit = new Object();
		secValues = new Set();
		this.secC = new Object();
		var self = this;
		for (index in iD){
			var o = iD[index];
			val = o[pF];
			if(!(val in primeSplit)){
				primeSplit[val] = [] ;
			}
			primeSplit[val].push(o);
		}
		sFProbs = new Object();
		//AllProbs['total'] = iL.length;
		for (p in primeSplit){
			AllProbs[p] = new Object();
			AllProbs[p]['num'] = primeSplit[p].length;
			AllProbs[p]['prob'] = AllProbs[p]['num']/iL.length;
			AllProbs[p]['secondary'] = this.calcPrimaryFactor(sF, primeSplit[p]);
			d3.keys(AllProbs[p]['secondary']).forEach(function(n){
				d3.keys(AllProbs[p]['secondary'][n]).forEach(function(name){
					if(name != 'total'){
						secValues.add(name);
					}
					if(n == '0' || n == 0){
						if(!(name in self.secC)){
							self.secC[name] = 0;
						}
						self.secC[name] += AllProbs[p]['secondary'][0][name];
					}
				});
			});
			
		}
		return [AllProbs,secValues];
	}
	this.randSquare = function(screen, wP){
		for(var r = 0; r<5;r++){
			for(var c = 0;c<5;c++){
				screen.append("rect").attr('x',wP.fifthsW[c][0]).attr('y', wP.fifthsH[r][0]).attr('width',wP.oneFifthW).attr('height',wP.oneFifthH).style('fill',function() {
   				return "hsl(" + Math.random() * 360 + ",100%,50%)";
    			});
			}
		}
	}
	this.destroy = function(callback){
		d3.select("#eikosogram").selectAll("*").transition().duration(0).attr('x',0).each('end', function(){d3.select(this).remove();});
		callback();
	}
	this.stopPoint = function(wP,screen,rect, scale,resume){
		self.wP = wP;
		self.screen = screen;
		self.rect = rect;
		self.scale = scale;
		self.resume = resume;
		self.paused = true;
		if(resume == self.secondaryTitle){
			self.F2Ok = true;
		}
		controller.canContinue();
		controller.getShowData();
	}
	this.continue = function(){
		if(self.paused && (!self.F2Ok | !self.oneFactor)){
			controller.cantContinue();
			self.paused = false;
			self.resume(self.wP,self.screen,self.rect,self.scale);
			self.showCounts(true);
		}
		
	}
	this.continueF2 = function(nfactors){
		self.paused = false;
		controller.cantContinue();
		self.F2Ok = false;
		factor2 = nfactors[0];
		//self.aFs = this.calcSecondaryFactor(factor1,factor2, iD)[0];
		calRet =self.calcSecondaryFactor(factor1,factor2, iD);
		self.aFs = calRet[0];
		self.secValues = calRet[1];
		self.showCounts();
		self.secondaryTitle(self.wP,self.screen,self.rect, self.scale);
	}
	this.hideCounts = function(){
		d3.selectAll('.pgCount').style('opacity',0);
		d3.selectAll('.secondaryCounts').style('opacity',0);
		d3.selectAll('.totals').style('opacity',0);
	}
	this.showCounts = function(resuming=false){
		self.unshiftCols();
		d3.selectAll('.pgCount').text(function(d,i){
			return self.aFs[d]['num'];
		}).style('opacity',1);
		d3.selectAll('.totalsValues').text(function(d,i){
			return d3.select(this).attr('count');
		});
		if(!resuming && controller.showTotal){
			d3.selectAll('.totals').style('opacity',1);
		}
		var numDone = 0;
		var cols = d3.selectAll('.pFCols');
		cols.selectAll('.secondaryCounts').text(function(d,i){
			return self.aFs[d]['secondary'][0][d3.keys(self.aFs[d]['secondary'][0]).sort()[i]];
			//return self.aFs[d]['secondary'][0][d3.keys(self.aFs[d]['secondary'][0])[i%(d3.keys(self.aFs[d]['secondary'][0]).length-1)]];
		}).style('opacity',1);
	}
	this.showProportionTotal = function(){
		d3.selectAll('.pgCount').text(function(d,i){
			return Math.round(self.aFs[d]['prob']*100)/100;
		}).style('opacity',1);
		if(controller.showTotal){
			d3.selectAll('.totals').style('opacity',1);
		}
		var cols = d3.selectAll('.pFCols');
		var nums = cols.selectAll('.secondaryCounts');
		nums.text(function(d,i){
			return self.propOutput(d,i);
		}).style('opacity',1);
		var propTypes = controller.getPropType();
		for (type in propTypes){
			d3.selectAll('.totalsValues').text(function(d,i){
			return d3.select(this).attr(propTypes[type]);
		});
		}
	}
	this.showBoth = function(){
		self.unshiftCols();
		d3.selectAll('.pgCount').text(function(d,i){
			return self.aFs[d]['num'] + ' ('+(Math.round(self.aFs[d]['prob']*100)/100)+')';
		}).style('opacity',1);
		if(!resuming && controller.showTotal){
			d3.selectAll('.totals').style('opacity',1);
		}
		var cols = d3.selectAll('.pFCols');
		var nums = cols.selectAll('.secondaryCounts');
		nums.text(function(d,i){
			var retVal = self.aFs[d]['secondary'][0][d3.keys(self.aFs[d]['secondary'][0]).sort()[i]] + ' (' + self.propOutput(d,i) +')';
			return retVal;
		}).style('opacity',1);
	}
	this.propOutput = function(d, i){
		var propTypes = controller.getPropType();
		retString = "";
		for (type in propTypes){
			if(propTypes[type]=='colProp'){
				self.shiftCols();
				retString += Math.round(self.aFs[d]['secondary'][1][d3.keys(self.aFs[d]['secondary'][1]).sort()[i]] * 100)/100;
			}
			else if (propTypes[type] == 'totProp'){
				self.unshiftCols();
				retString += Math.round(self.aFs[d]['secondary'][0][d3.keys(self.aFs[d]['secondary'][0]).sort()[i]]/iD.length * 100)/100;
			}
			retString += ' , ';
		}
		return retString.slice(0,-3);
	}
	this.showTotalChanged = function(show){
		if(show){
			d3.selectAll(".totals").style('opacity',1);
		}else{
			d3.selectAll(".totals").style('opacity',0);
		}
	}
	this.init();
}

function WindowPos(rect){
	//this.width = parseInt(mainEl.style('width'),10);
	//this.height = parseInt(mainEl.style('height'),10);
	this.width = rect[1]-rect[0];
	this.height = rect[3]-rect[2];
	this.fontSize = Math.min(this.width,this.height)/30;
	this.fifthsW = [];
	this.oneFifthW = this.width/5;
	this.fifthsH = [];
	this.oneFifthH = this.height/5;
	for(var i =1; i<=5;i++){
		this.fifthsW.push([this.oneFifthW*(i-1)+rect[0], this.oneFifthW*(i)+rect[0]]);
	}
	for(var i =1; i<=5;i++){
		this.fifthsH.push([this.oneFifthH*(i-1)+rect[2], this.oneFifthH*(i)+rect[2]]);
	}
}
function randRGB(){
	return [Math.random()*255,Math.random()*255,Math.random()*255];
}
function middle(A,B){
	return (A+B)/2;
}
function fontS(A, B, text){
	return Math.min(A, (B)/(text.length*2.5));
}
function randomColors(total)
{
    var i = 360 / (total - 1); // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x=0; x<total; x++)
    {
        r.push(hsvToRgb(i * x, 60, 100)); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;
}
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	s /= 100;
	v /= 100;
	if(s == 0) {
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	h /= 60; 
	i = Math.floor(h);
	f = h - i; 
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default: 
			r = v;
			g = p;
			b = q;
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}