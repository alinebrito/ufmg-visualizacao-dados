/**
 * Script com funções utilitária para manipular os gráficos.
*/

/**
 * Alterna tipo de visualização conforme seleção do usuário.
 * @param  {[type]} option [opção selecionada pelo usuário]
 */
function selectVisualization(option){
	if(option === '1'){
		showBoxPlot();
	}
	else{
		showScatterPlot();
	}
}

/**
 * Atualiza gráficos conforme as bibliotecas selecionas pelo usuário.
 * @param  {[list]} libs [lista de bibliotecas]
 * @param  {[int]} sort [tipo de ordenação]
 */
function updateChartsByLibraries(libs, sort){
	updateBarCharI(libs, sort);
	updateScatterPlot(libs, sort);
	updateBoxPlot(libs, sort);
}

/**
 * Exibe ScatterPlot e oculta BoxPlot.
 */
function showScatterPlot(){
	showChartById('scatterPlot');
	hideChartById('boxPlot');
}

/**
 * Exibe BoxPlot e oculta ScatterPlot.
 */
function showBoxPlot(){
	showChartById('boxPlot');
	hideChartById('scatterPlot');
}

/**
 * Exibe um gráfico.
 * @param  {[string]} id [id da div do gráfico.]
 */
function showChartById(id){
	$('#' + id).addClass('show');
	$('#' + id).removeClass('hide')
}

/**
 * Oculta um gráfico.
 * @param  {[string]} id [id da div do gráfico.]
 */
function hideChartById(id){
	$('#' + id).addClass('hide');
	$('#' + id).removeClass('show')
}



