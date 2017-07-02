/**
 * Script para ler os dados provenientes dos arquivos CSV e criar os respectivos gráficos.
 */

var libraries = {};

/**
 * Inicializa primeiro gráfico de barras.
 */
function readDataAndCreateBarChartI(){
	var file = '/data/data-use-internal-interfaces-by-library.csv';
	d3.csv(file, function(error, data) {
		data.forEach(function(d){
			libraries[d.name] = d;
		});
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
		initBoxPlot(data);
	});
}

/**
 * Inicializa box plot.
 */
function readDataAndCreateTableAbout(){
	var file = '/data/data-use-internal-interfaces-by-library-about.csv';
	d3.csv(file, function(error, data) {
		initTable(data);
	});
}

/**
 * Retorna a lista de bibliotecas selecionadas.
 */
function getLibsSelected(){
	var libs = [];
	$("input:checkbox:checked").each(function(){
    libs.push($(this).val());
	});
	return libs;
}
