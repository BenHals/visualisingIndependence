function probView(controller){
	this.init = function(){
		$(document).keypress(function(e){
			var range = $('#speedControl');
			var size = $('#fontControl');
			if(e.which == 97){
				range.val(range.val()-0.1);
				$('#sClabel').text('Visualisation Speed = ' + range.val());
				controller.speedChanged(range.val());
			}
			if(e.which == 100){
				var newVar = parseFloat(range.val())+0.1;
				range.val(newVar);
				$('#sClabel').text('Visualisation Speed = ' + range.val());
				controller.speedChanged(range.val());
			}
			if(e.which == 119){
				var newVar = parseFloat(size.val())+0.1;
				size.val(newVar);
				$('#fSLabel').text('Font Size = ' + size.val());
				controller.fontChanged(size.val());
			}
			if(e.which == 115){
				var newVar = parseFloat(size.val())-0.1;
				size.val(newVar);
				$('#fSLabel').text('Font Size = ' + size.val());
				controller.fontChanged(size.val());
			}
		});
		var IB = document.getElementById("file");
		IB.onchange = function(e){
			controller.impButPressed(e);
		}
	}
	this.getFactors = function(){
		return [$("#fac1").val(), $("#fac2").val()];
	}
	this.suManipTools = function(headings,callback){
		this.suDataUI();
		this.suIndependanceUI();
		this.suFactorSelectors(headings);
		this.suSwapFactorsUI();
		this.setUpControls();
		callback();
	}
	this.suDataUI = function(){
		oC = $('#showDataUI');
		oC.html(`
					<div id='showData' class='form-group'>
						<label class = 'control-label' for='showData'>Show data labels</label>
						<div class='shiny-options-group'>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='None' checked='checked'>
							<span>None</span>
							</label>
						</div>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='Counts'>
							<span>Counts</span>
							</label>
						</div>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='Proportions'>
							<span>Proportions</span>
							</label>
						</div>
					<div class="checkbox">
						<label>
							<input id="colProp" type="radio" value ="colProp" name = "propType" checked="checked">
							<span>Column proportions</span>
							<input id="totProp" type="radio" value ="totProp"name = "propType">
							<span>Total proportions</span>
						</label>
					</div>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='Both'>
							<span>Both</span>
							</label>
						</div>

						</div>
					</div>
				<div id='showTotals' class='form-group'>
						<label class = 'control-label' for='showTotals'>Show Totals</label>
					<div class="checkbox">
						<label>
							<input id="showTotalsCheck" type="checkbox" value ="showTotal" name = "showTotal" checked="checked">
							<span>Show Totals</span>
						</label>
					</div>
				</div>
				`);
		$("input[name='showData']").click(function(){
			controller.showDataChanged(this.value);
		});
		$("input[name='propType']").click(function(){
			controller.showDataChanged($("input[name='showData']:checked").val());
		});
		$("input[name='showTotal']").click(function(){
			controller.showTotalChanged($("input[name='showTotal']:checked").val());
		});

	}
	this.getShowData = function(){
		return $("input[name='showData']:checked").val();
	}
	this.getPropType = function(){
		return [$("input[name='propType']:checked").val()];
		/*
		var retVal = [];
		$('input:checkbox.propType').each(function(){
			var ret = (this.checked ? $(this).val() : "");
			if(ret != ""){
				retVal.push(ret);
			}
		})
		return retVal; */
	}
	this.suIndependanceUI = function(){
		return;
		oC = $('#independenceUI');
		oC.html(`<div class="form-group">
					<div class="checkbox">
						<label>
							<input id="independence" type="checkbox">
							<span>Show independence</span>
						</label>
					</div>
				</div>`);
	}
	this.suFactorSelectors = function(headings){
		oC = $("#factorSelectors");
		oC.html("");
		for(var j =1;j<=2;j++){
			container = $("<div>").attr('class', 'form-group').appendTo(oC);
			container.append($("<label>").text("Factor "+j));
			dC = $("<div>").appendTo(container);
			var s = $("<select>").attr("id","fac"+j).appendTo(dC);
			$("<option>").attr('value', -1).text('-').attr('selected',true).appendTo(s);
			$.each(headings, function(i, val){
				var o = $("<option>").attr('value', i).text(val[0]).appendTo(s);
				// if(i+1 == j){
				// 	o.attr('selected',true);
				// }
			})
		}
		var SM = document.getElementById("fac1");
		SM.onchange = function(){
			controller.primeSelected();
		}
		var SM2 = document.getElementById("fac2");
		SM2.onchange = function(){
			controller.primeSelected();
		}
	}
	this.suSwapFactorsUI = function(){
		oC = $("#swapFactorsUI");
		oC.html("");
		var button = $("<button>").attr('id','swapFactors').attr('type','button').attr('class','btn btn-default action-button').text("Swap factors").appendTo(oC);
		button.click(function(){
			var f1 = $('#fac1').val();
			var f2 = $('#fac2').val();
			$('#fac1').val(f2);
			$('#fac2').val(f1);
			controller.primeSelected();
		})
		var cont = $("<button>").attr('id','continue').attr('type','button').attr('class','btn btn-default action-button').text("Continue").appendTo(oC);
		cont.click(function(){
			controller.continue();
		})
	}
	this.canContinue = function(){
		d3.select('#continue').classed('btn-success',true);
	}
	this.cantContinue = function(){
		d3.select('#continue').classed('btn-success',false);
	}
	this.setUpControls = function(){
		oC = $('#countsGrid');
		oC.html(`<label for='speedControl' id='sClabel'>Visualisation Speed = 1</label>
			<input id='speedControl' name='speedControl' type='range' value='1' min='0.1' max = '5' step='0.1'>
				<label for='fontControl' id ='fSLabel'>Font Size = 1</label>
				<input id='fontControl' name='fontControl' type='range' value='1' min='0.1' max = '2' step='0.1'>`);
		var range = $('#speedControl');
		range.on("change mousemove", function(){
			$('#sClabel').text('Visualisation Speed = ' + range.val());
			controller.speedChanged(range.val());
		});


		var fRange = $('#fontControl');
		fRange.on("change mousemove", function(){
			$('#fSLabel').text('Font Size = ' + fRange.val());
			controller.fontChanged(fRange.val());
		});

	}
	this.getSpeed = function(){
		return $('#speedControl').val();
	}
	this.getFont = function(){
		return $('#fontControl').val();
	}
}