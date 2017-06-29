/**
 * Script para ler os dados provenientes dos arquivos CSV e criar os respectivos gráficos.
 */

/**
 * Inicializa primeiro gráfico de barras.
 */
function readDataAndCreateBarChartI(){
	var file = '/data/data-use-internal-interfaces-by-library.csv';
	d3.csv(file, function(error, data) {
		initBarChartI(data);
	});
}

/**
 * Inicializa segundo gráfico de barras e donut.
 */
function readDataAndCreateBarCharIIAndDonutChart(){
	var file = '/data/data-use-internal-and-public-interfaces-junit-mockito.csv';
	d3.csv(file, function(error, data) {
		createBarCharII(data);
		createDonutCharPublicAndInternalInterface(data);
	});
}

/**
 * Inicializa scatter plot.
 */
function readDataAndCreateScatterChart(){
	var file = '/data/data-use-internal-interface-all-libraries-by-interface.csv';
	d3.csv(file, function(error, data) {
		initScatterPlot(data);
	});
}

/**
 * Inicializa box plot.
 */
function readDataAndCreateBoxPlot(){
	var file = '/data/data-use-internal-interface-all-libraries.csv';
	d3.csv(file, function(error, data) {
		createBoxPlotDistributionInternalInterface(data);
	});
}

