/**
 * Script para criar o Scatter plot com os dados de popularidade das interfaces.
 */


/**
 * Formata o texto do tooltip do ponto.
 */
function createHtmlToolTipDot(d){
	var html = d["api"] + "<br/> (" + d.usage.toFixed(2) + "%)";
	return html;
}


/**
 * Calcula um ramdom variando entre o (value+1) e (value-1)
 * @param  {[float]} value [valor de referência]
 */
function ramdomPoint(value){
    var maximum = value;
    var minimum = (value*-1) -1;
    var randomnumber = Math.random() * (maximum - minimum + 1) + minimum;
    return randomnumber;
}


/**
 * Cria o Scatter Plot.
 * Quanto maior o ponto, mais popular é a interface representada por ele.
 * Adaptado de: http://bl.ocks.org/weiglemc/6185069
 * @param  {[string]} idDiv [id da div onde o gráfico será criado.]
 * @param  {[map]} data  [dados do gráfico.]
 */
function createScatterChart(idDiv, data){
	var margin = {top: 10, right: 50, bottom: 100, left: 70};
	var width = window.innerWidth - margin.left - margin.right - 400;
	var height = 500 - margin.top - margin.bottom;

	// Escala de cor.
	color = d3.scale.category20();

	// Adiciona Scatter plot na respectiva div.
	var svg = d3.select("#" + idDiv).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Adiciona Tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	//Configura Eixos
	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], 1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	//Cada grupo/coluna representa uma biblioteca.
	x0.domain(data.map(function(d) { return d.library; }));
	y.domain([0, 2]);

	// Adiciona Eixo X previamente configurado.
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Adiciona Eixo Y previamente configurado.
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "-3.5em")
		.style("font-size", "16px")
		.style("text-anchor", "end")
		.text("Uso da Interface Interna (%)");

	//Desenha pontos.
	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", function(d) { return d.usage * 15; })//raio do ponto, proporcional a sua popularidade.
		.attr("cx", function(d) {return x0(d.library) + ramdomPoint(30)}) //ramdom para exibir pontos em volta do eixo principal.
		.attr("cy", function(d) { return y(d.usage); })
		.style("fill", function(d) {return color(x0(d.library));})  //cor do ponto
		.on("mouseover", function(d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 1);
			tooltip.html(createHtmlToolTipDot(d))
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});
}


/**
 * Formata os dados para o Scatter Plot.
 */
function createDataFormatChartDonut(data){
	data.forEach(function(d) {
		d.library = d.library;
		d["usage"] = +d["usage"];
	});
	return data;
}

/**
 * Cria o Scatter Plot na respectiva div.
 */
function createScatterChartInternalInterface(data){
  if(data){
    var idDiv = "chart22-area-plot";
    var chart = createScatterChart(idDiv, createDataFormatChartDonut(data));
  }
}