/**
 * Script principal, responsável por ler os dados e criar os gráficos default.
 */

 $( document ).ready(function() {

 	var typeSort = 1;

	//Visão inicial da página.
	readDataAndCreateBarChartI();
	readDataAndCreateBarCharIIAndDonutChart();
	readDataAndCreateBoxPlot();
	readDataAndCreateScatterChart();
	showScatterPlot();
	readDataAndCreateTableAbout();

	//Alterna entre os tipos de gráficos (Box Plot e Scatter Plot)
	$("#typeChart label").click(function() {
		var option = $(this).find('input').attr('value');
		selectVisualization(option);
	});

	//Alterna entre os tipos de ordenação (alfabética, por popularidade.)
	$("#typeSort label").click(function() {
		typeSort =  $(this).find('input').attr('value');
		var libs = getLibsSelected();
		updateChartsByLibraries(libs, typeSort);
	});

	//Atualiza os gráfico com a nova lista de bibliotecas selecionadas.
	$("#libs label").click(function() {
		var libs = getLibsSelected();
		updateChartsByLibraries(libs, typeSort);
	});

	//Marca ou desmarca todas as opções de bibliotecas e atualiza o gráfico.
	$("#checkAll").click(function () {
		$(".check").prop('checked', $(this).prop('checked'));
	});

	//Ordenação da tabela.
  $("#table").on("click", "thead th", function(){
    sortTable($(this)[0].cellIndex);
  });

});