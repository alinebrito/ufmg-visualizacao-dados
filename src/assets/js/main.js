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
});