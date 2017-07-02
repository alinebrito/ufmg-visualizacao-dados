/**
 * Script para criação e manipulação do scatter plot.
 */

 var dataScatter = null;

/**
* Formata o texto do tooltip do ponto.
*/
function createHtmlToolTipDot(d){
	var html = "<b>" + d["api"] + "</b><br/><br/> Usada por " + d.usage.toFixed(1) + "% dos clientes";
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
function createScatter(properties){

	var margin = {top: 5, right: 20, bottom: 70, left: 50};
	var width = properties.width - margin.left - margin.right - 400;
	var height = 250 - margin.top - margin.bottom;

	// Escala de cor.
	color = d3.scale.category20();

	d3.select("#" + properties.div + "-svg").remove();

	// Adiciona Scatter plot na respectiva div.
	var svg = d3.select("#" + properties.div)
	.append("svg")
	.attr("id", properties.div + "-svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Adiciona Tooltip
	var toolTip = d3.select("body").append("div")
	.attr("class", "toolTip")
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

	var max = d3.max(properties.dataset, function(d) { return +d.usage;});

	//Cada grupo/coluna representa uma biblioteca.
	x0.domain(properties.dataset.map(function(d) { return d.library; }));
	y.domain([0, max + max/2]);

	// Adiciona Eixo X previamente configurado e respectivo nome.
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("x", (width / 2) )
	.attr("y",  40 )
	.attr("dy", "0.2em")
	.style("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Bibliotecas");

	// Adiciona Eixo Y previamente configurado.
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "-4.5em")
	.style("font-size", "11px")
	.style("text-anchor", "end")
	.text(properties.labelY);

	//Desenha pontos.
	svg.selectAll(".dot")
	.data(properties.dataset)
	.enter().append("circle")
	.attr("class", "dot")
	.attr("r", function(d) { return d.usage * 2; })//raio do ponto, proporcional a sua popularidade.
	.attr("cx", function(d) {return x0(d.library) + ramdomPoint(30)}) //ramdom para exibir pontos em volta do eixo principal.
	.attr("cy", function(d) { return y(d.usage); })
	.style("fill", function(d) {return color(x0(d.library));})//cor do ponto
	.on("mousemove", function(d) {
		toolTip.transition()
		.duration(1)
		.style("opacity", 1);
		toolTip.style("display", "inline-block");
		toolTip.html(createHtmlToolTipDot(d))
		.style("left", (d3.event.pageX + 5) + "px")
		.style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d) {
		toolTip.transition()
		.duration(500)
		.style("opacity", 0);
	});
}

/**
 * Formata os dados para o Scatter Plot.
 * @param  {[map]} data [metados do gráfico]
 */
function createDataFormatScatterPlot(data){
	data.forEach(function(d) {
		d.library = d.library;
		d["usage"] = +d["usage"];
	});
	return data;
}

/**
 * Atualiza Scatter Plot.
 * @param  {[list]} listLibs [lista de bibliotecas]
 * @param  {[type]} sort [tipo de ordenação, 1=alfabética, 2=popularidade]
 */
function updateScatterPlot(listLibs, sort){
	var data = [];
	dataScatter.forEach(function(d) {
		if(listLibs.indexOf(d.library) != -1){
			data.push(d);
		}
	});

	//Ordena se necessário.
	if(sort == 2){
		data.sort(function(value1, value2){
			var a = Number(libraries[value1.library].total_internal_interfaces_usage_percentage);
			var b = Number(libraries[value2.library].total_internal_interfaces_usage_percentage);
			return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
		});
	}
	createScatterPlot(data, listLibs);
}

/**
 * Cria o Scatter Plot na respectiva div.
 * @param  {[map]} data [metados do gráfico]
 * @param  {[list]} listLibs [lista de bibliotecas]
 */
function createScatterPlot(data, listLibs){
	if(data){
		var properties = {};
		properties.div = 'chart22-area-plot';
		properties.dataset = createDataFormatScatterPlot(data);
		properties.width = listLibs ? ((listLibs.length * 110) + 500) : window.innerWidth;
		properties.labelY = 'Uso da Interface Interna (%)';
		var chart = createScatter(properties);
	}
}

/**
 * Adiciona Scatter Plot inicial.
 * @param  {[map]} data [metadados do gráfico.]
 */
function initScatterPlot(data){
	dataScatter = data;
	createScatterPlot(data);
}

