function probability(){
	pColors = [];
	for(var c =0;c<20;c++){
		pColors.push([randRGB(),0.8]);
	}
	var self = this;
	this.view = new probView(this)
	this.view.init()
	this.model = new probModel(this)
	oldFactors = [-2,-2];
	this.showTotal = true;
	this.currentShow = 'None';
	this.getColors = function(){
		return pColors;
	}
	this.impButPressed = function(e){
		this.model.getFile(e);
	}
	this.speedChanged = function(nS){
		this.dataDisplay.speedChanged(nS);
	}
	this.fontChanged = function(nS){
		this.dataDisplay.fontChanged(nS);
	}
	this.finishedModelSU = function(){
		this.view.suManipTools(this.model.getCategorical(), self.finToolSU);
	}
	this.createDisplay = function(){
		factors = self.getFactors();
		self.dataDisplay = new eiko(self,[self.model.getHeading(factors[0]),self.model.getHeading(factors[1])], self.model.getData(), self.view.getSpeed());
	}
	this.finToolSU = function(){
		self.destroyScreen(self.createDisplay);
	}
	this.getFactors = function(){
		return this.view.getFactors();
	}
	this.getShowData = function(){
		var val = this.view.getShowData();
		this.showDataChanged(val);
		this.currentShow = val;
	}
	this.showDataChanged = function(value){
		if(value == 'None') this.dataDisplay.hideCounts();
		if(value == 'Counts') this.dataDisplay.showCounts();
		if(value == 'Proportions') this.dataDisplay.showProportionTotal();
		if(value == 'Both') this.dataDisplay.showBoth();
	}
	this.showTotalChanged = function(value){
		this.showTotal = !this.showTotal;
		this.dataDisplay.showTotalChanged(this.showTotal);
	}
	this.getPropType = function(){
		return this.view.getPropType();
	}
	this.primeSelected = function(){
		var newFactors = this.getFactors();
		if(oldFactors[0] == newFactors[0] && oldFactors[1] == -1 && this.dataDisplay.F2Ok){
			this.dataDisplay.continueF2(self.model.getHeading(newFactors[1]));
		}else{
		
		this.destroyScreen(self.createDisplay);
		}
		oldFactors=newFactors;
	}
	this.destroyScreen = function(callback){
    if(self.dataDisplay != null){
  		this.dataDisplay.destroy(function(){
  			this.dataDisplay = null;
  			callback();
  		});
    }else{
      callback();
    }

	}
	this.continue = function(){
		this.dataDisplay.continue();
	}
	this.canContinue = function(){
		this.view.canContinue();
	}
	this.cantContinue = function(){
		this.view.cantContinue();
	}
}
var mainControl = null;
window.onload = function(){
	mainControl = new probability();
};