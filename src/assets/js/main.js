/**
 * Script principal, responsável por ler os dados e criar os gráficos default.
 */

$( document ).ready(function() {
	readDataAndCreateBarChartI();
	readDataAndCreateBarCharIIAndDonutChart();
	readDataAndCreateBoxPlot();
	readDataAndCreateScatterChart();
	showScatterPlot();

	$("#typeChart label").click(function() {
    	var option = $(this).find('input').attr('value')
    	selectVisualization(option);
	});

	$("#libs label").click(function() {
		var libs = [];
		$("input:checkbox:checked").each(function(){
		    libs.push($(this).val());
		});
		updateChartsByLibraries(libs);
	});
});