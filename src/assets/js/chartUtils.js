/**
 * Script com funções utilitária para manipular os gráficos.
*/

function selectVisualization(option){
	if(option === '1'){
		showBoxPlot();
	}
	else{
		showScatterPlot();
	}
}

function updateChartsByLibraries(libs){
	updateBarCharI(libs);
	//updateBoxPlot(libs);
	//updateBarChart(libs);
	//updateScatterPlot(libs)
}

function showScatterPlot(){
	showChartById('scatterPlot');
	hideChartById('boxPlot');
}

function showBoxPlot(){
	showChartById('boxPlot');
	hideChartById('scatterPlot');
}

function showChartById(id){
	$('#' + id).addClass('show');
	$('#' + id).removeClass('hide')
}

function hideChartById(id){
	$('#' + id).addClass('hide');
	$('#' + id).removeClass('show')
}



