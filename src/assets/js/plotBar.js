/**
 * Script para criação e manipulação dos gráficos de barras.
 */

//Configurações de margem.
var margin = {top: 10, right: 20, bottom: 20, left: 60};
var width = - margin.left - margin.right - 40;
var height = 200 - margin.top - margin.bottom;

// Escala de cores.
var color = d3.scale.category20();

//Dados originais dos gráficos.
var dataChartI = null;

/**
 * Cria a legenda do gráfico.
 * @param  {[type]} svg     [description]
 * @param  {[type]} options [description]
 * @param  {[type]} width   [description]
 * @return {[type]}         [description]
 */
function createLegend(svg, options, width){

	var legend = svg.selectAll(".legend")
	.data(options.slice())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

	legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);

	legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) {
		return d;
	});
}

function updateBarChart(svg, properties, x0, x1, y){

	var color = d3.scale.category20();

	var barChart = svg.selectAll(".bar")
	.data(properties.dataset);

	barChart.enter().append("g")
	.attr("class", "rect")
	.style("fill", function(d) {return color(x0(d.library));})
	.attr("transform", function(d) { return "translate(" + x0(d.library) + ",0)"; })

	barChart.exit().remove();

	barChart.append("g")
	.attr("class", "rect")
	.style("fill", function(d) {return color(x0(d.library));})
	.attr("transform", function(d) { return "translate(" + x0(d.library) + ",0)"; })

	barChart.selectAll("rect")
	.data(function(d) { return d.val; })
	.enter().append("rect")
	.attr("width", x1.rangeBand())
	.attr("x", function(d) { return x1(d.name); })
	.attr("y", function(d) { return y(d.value); })
	.attr("value", function(d){return d.name;})
	.attr("height", function(d) { return height - y(d.value); });

	return barChart;
}

//function createBarChart(idDiv, dataset, labelY, width, options, containsLegend){
function createBarChart(properties){
 	
	var max = 0; //Valor máximo do eixo Y.

	//Configura eixos e respectivas escalas.
	var x0 = d3.scale
	.ordinal()
	.rangeRoundBands([0, properties.width], .1);

	var x1 = d3.scale
	.ordinal();

	var y = d3.scale
	.linear()
	.range([height, 0]);

	var xAxis = d3.svg
	.axis()
	.scale(x0)
	.orient("bottom");

	var yAxis = d3.svg
	.axis()
	.scale(y)
	.orient("left")
	.tickFormat(d3.format(".2s"));

	//Customiza metadados para gerar o gráfico.
	properties.dataset.forEach(function(d) {
		d.val = properties.options.map(function(name) {
			var maxOption = d3.max(properties.dataset, function(d) { return +d[name];});
			max = (maxOption > max) ? maxOption : max;
			return {name: name, value: +d[name]};
		});
	});

	d3.select("#" + properties.div + "-svg").remove();
	var svg = d3.select("#" + properties.div).append("svg")
	.attr("id", properties.div + "-svg")
	.attr("width", properties.width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x0.domain(properties.dataset.map(function(d) { return d.library; }));
	x1.domain(properties.options).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, max]);

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 3)
	.attr("dy", "-3em")
	.style("text-anchor", "end")
	.style("font-size", "11px")
	.text(properties.labelY);

	var barChart = updateBarChart(svg, properties, x0, x1, y);

	if(properties.containsLegend){
		createLegend(svg, properties.options, properties.width);
	}

	return barChart;
}



/**
 * Formata os dados para o primeiro gráfico de barras.
 * @param  {[map]} data [metadados do gráfico]
 */
function createDataFormatChartI(data){
	var cols = [];
	data.map(function(line, i){
		var value = line;
		var use = (Number( line['total_internal_interfaces_usage_percentage']));
		var col = {
			"library": line['name'],
			"Interfaces Internas": use,
		};
		cols.push(col);
	});
	return cols;
}

/**
 * Formata os dados para o segundo gráfico de barras.
 * Visualização das Interfaces Internas e Públicas.
 * @param  {[map]} data [metadados do gráfico]
 */
function createDataFormatChartII(data){
	var cols = [];
	data.map(function(line, i){
		var value = line;
		//dados para o gráfico 1;
		var col = {
			"library": line['name'],
			"Interfaces Internas": (Number(line['total_internal_interfaces_usage_percentage'])),
			"Interfaces Públicas": (Number(line['total_public_interfaces_usage_percentage']))
		};
		cols.push(col);
	});
	return cols;
}

/**
 * Retorna HMTL com dados do toolTip para o gráfico I.
 * @param  {[type]} title [description] - Título do ToolTip
 * @param  @param  {[map]} data     [map com os dados] = [key, value]
 */
function createHtmlToolTipBarChartI(title, d, data){
	var html = "<center><b>" + title + "</b></center><table>";
	data.forEach(function(d){
		if(title === d.name){
			html += "<tr align='left'><td>Clientes:   </td><td>" + Number(d.number_clients).toLocaleString() + "</td></tr>"
			html += "<tr align='left'><td>APIs Internas:   </td><td>" + Number(d.total_internal_interfaces).toLocaleString() + "</td></tr>"
			html += "<tr align='left'><td>APIs Internas Usadas:   </td><td>" + Number(d.total_internal_interfaces_usage).toLocaleString() + " (" + d.total_internal_interfaces_usage_percentage + "%)</td></tr>"
		}
	})
	html += "</table>";
	return html;
}

/**
 * Retorna HMTL com dados do toolTip para o gráfico II.
 * @param  {[type]} title [description] - Título do ToolTip
 * @param  @param  {[map]} data     [map com os dados] = [key, value]
 */
function createHtmlToolTipBarChartII(title, d, data){
	var html = "<center><b>" + title + "</b></center><table>";
	data.forEach(function(d){
		if(title === d.name){
			html += "<tr align='left'><td>Total Interfaces Internas:   </td><td>" + Number(d.total_public_interfaces).toLocaleString() + "</td></tr>"
			html += "<tr align='left'><td>Total Interfaces Públicas:   </td><td>" + Number(d.total_internal_interfaces).toLocaleString() + "</td></tr>"
		}
	});
	html += "</table>";
	return html;
}

/**
 * Cria o toolTip para os gráficos de barra.
 * @param  {[type]} chart [gráfico]
 * @param  {[type]} data  [dados]
 * @param  {[type]} type  [tipo de gráfico]
 */
function createToolTipBarChar(chart, data, type){
	var toolTip = d3.select("body").append("div").attr("class", "toolTip");
	chart.on("mousemove", function(d){
		toolTip.style("left", d3.event.pageX+10+"px");
		toolTip.style("top", d3.event.pageY-25+"px");
		toolTip.style("display", "inline-block");
		var html = (type == 1) ? createHtmlToolTipBarChartI(d.library, d, data) : reateHtmlToolTipBarChartII(d.library, d, data);
		toolTip.html(html);
	});
	chart.on("mouseout", function(d){
		toolTip.style("display", "none");
	});
}

function initBarChartI(data){
	dataChartI = data;
	createBarCharI(data);
}

function updateBarCharI(listLibs){
	var data = [];
	dataChartI.forEach(function(d) {
		if(listLibs.indexOf(d.name) != -1){
			data.push(d);
		}
	});
	createBarCharI(data);
}

/**
 * Criar gráfico de barras do percentual de uso das interfaces internas (1º gráfico).
 */
function createBarCharI(data){
	if(data){
		//Seta propriedades
		var properties  = {};
		properties.div = 'chart1-area';
		properties.dataset = createDataFormatChartI(data);
		properties.options = ["Interfaces Internas"];
		properties.labelY = 'Interfaces Internas Usadas (%)';
		properties.width = data.length * 110; //100px para cada barra.
		properties.containsLegend = false;

		var barChart = createBarChart(properties);
		createToolTipBarChar(barChart, data, 1);
	}
}

/**
 * Cria gráfico de barra das interfaces públicas e internas das bibliotecas Mockito e JUnit.
 */
function createBarCharII(data){
	if(data){
		//Seta propriedades
		var properties  = {};
		properties.div = 'chart4-area-plot';
		properties.dataset = createDataFormatChartII(data);
		properties.options = ["Interfaces Internas", "Interfaces Públicas"];
		properties.labelY = 'Interfaces Usadas (%)';
		properties.width = (window.innerWidth/2);
		properties.containsLegend = true;

		var barChart = createBarChart(properties);
		createToolTipBarChar(barChart, data, 1);
	}
}
