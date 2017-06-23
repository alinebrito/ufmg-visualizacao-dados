/**
 * Script para criar os gráficos de barras I e II.
 */


// Escala de cores.
var colorRange = d3.scale.category10();
var color = d3.scale.ordinal()
	.range(colorRange.range());


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



/**
 * Cria um gráfico de barras.
 * @param  {[type]} idDiv -  identificador da div.
 * @param  {[type]} data  - dados do gráfico.
 */
function createBarChart(idDiv, dataset, labelY, fator, containsLegend, options){

	dataset.forEach(function(d) {
		d.val = options.map(function(name) {
			return {name: name, value: +d[name]};
		});
	});

	var margin = {top: 20, right: 30, bottom: 30, left: 60};
	var width = (window.innerWidth/fator) - margin.left - margin.right - 40;
	var height = 500 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#"+idDiv).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x0.domain(dataset.map(function(d) { return d.library; }));
	x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, 100]);

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
		.style("font-size", "16px")
		.text(labelY);

	var barChart = svg.selectAll(".bar")
		.data(dataset)
		.enter().append("g")
		.attr("class", "rect")
		.attr("transform", function(d) { return "translate(" + x0(d.library) + ",0)"; });

	barChart.selectAll("rect")
		.data(function(d) { return d.val; })
		.enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("value", function(d){return d.name;})
		.attr("height", function(d) { return height - y(d.value); })
		.style("fill", function(d) { return color(d.name); });

	if(containsLegend){
		createLegend(svg, options, width);
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
		var col = {
			"library": line['name'],
			"Interfaces Internas": (Number( line['total_internal_interfaces_usage_percentage']))
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
 * Formata os dados para o segundo gráfico de barras. Visualização do uso das Interfaces Internas.
 */
function createDataFormatChartI(data){
	var cols = [];
	data.map(function(line, i){
		var value = line;
		var col = {
			"library": line['name'],
			"Interfaces Internas": (Number(line['total_internal_interfaces_usage_percentage']))
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
 * Criar gráfico de barras do percentual de uso das interfaces internas (1º gráfico).
 */
function createBarCharUseInternalInterface(data){
	if(data){
		var idDiv = "chart1-area";
		var labelY = 'Interfaces Internas Usadas (%)';
		var options = ["Interfaces Internas"];
		var barChart = createBarChart(idDiv, createDataFormatChartI(data), labelY, 1.02, false, options);
		createToolTipBarChar(barChart, data, 1);
	}
}

/**
 * Cria gráfico de barra das interfaces públicas e internas das bibliotecas Mockito e JUnit.
 */
function createBarCharPublicAndInternalInterface(data){
	var idDiv = "chart4-area-plot";
	var labelY = 'Interfaces Usadas (%)';
	var options = ["Interfaces Internas", "Interfaces Públicas"];
	var barChart = createBarChart(idDiv, createDataFormatChartII(data), labelY, 2, true, options);
	createToolTipBarChar(barChart, data, 2);
}