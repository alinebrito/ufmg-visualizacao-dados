/**
 * Script para criação e manipulação dos gráficos de barras.
 */

//Configurações de margem.
var margin = {top: 40, right: 20, bottom: 50, left: 60};
var width = - margin.left - margin.right - 40;
var height = 250 - margin.top - margin.bottom;

//Dados originais dos gráficos.
var dataChartI = null;

/**
* @param  {[svg]} svg     [description]
* @param  {[type]} options [description]
* @param  {[type]} width   [description]
* @return {[type]}         [description]
*/
/**
 * Cria a legenda do gráfico.
 * @param  {[svg]} svg svg do gráfico.
 * @param  {[object]} properties [objeto com as propriedades do gráfico.]
 */
function createLegend(svg, properties){

	var legend = svg.selectAll(".legend")
	.data(properties.options.slice())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

	legend.append("rect")
	.attr("x", properties.width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", properties.color);

	legend.append("text")
	.attr("x", properties.width - 24)
	.attr("y", 15)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) {
		return d;
	});
}

/**
 * Atualiza gráfico de barras.
 * @param  {[svg]} svg svg do gráfico.
 * @param  {[object]} properties [objeto com as propriedades do gráfico.]
 * @param  {[type]} x0
 * @param  {[type]} x1
 * @param  {[type]} y
 */
function updateBarChart(svg, properties, x0, x1, y){

	var c = properties.color;

	var barChart = svg.selectAll(".bar")
	.data(properties.dataset);

	barChart.enter().append("g")
	.attr("class", "rect")
	.style("fill", function(d, i) {return c(i); })
	.attr("transform", function(d) { return "translate(" + x0(d.library) + ",0)"; })

	//barChart.exit().remove();

	var g = barChart.append("g")
	.attr("class", "rect");


	if(properties.type == 1){
		c = d3.scale.category20();
		g = g.style("fill", function(d) {return c(x0(d.library));})
	}
	g = g.attr("transform", function(d) { return "translate(" + x0(d.library) + ",0)"; })

	//Adiciona label nas barras com o respectivo percentual.
	barChart.selectAll("rect")
	.data(function(d) { return d.val; })
	.enter().append("text")
	.text(function(d){return  format(Number(d.value)) + "%"})
	.attr("class", "labelBar")
	.attr("font-size","12px")
	.style("fill", "#333")
	.attr("transform", function(d) {
		return "translate(" + (x1(d.name)) + "," + (y(0) - (y(properties.max - d.value)) - 2) + ")"; 
	});

	if(properties.type == 1){
		//Adiciona label nas barras com o respectivo percentual.
		barChart.selectAll("rect")
		.data(function(d) { return d.val; })
		.enter().append("text")
		.text(function(d){return Number(libraries[d.library].number_clients).toLocaleString("pt-BR") + " clientes"})
		.attr("class", "labelBar")
		.attr("font-size","12px")
		.style("fill", "#333")
		.attr("transform", function(d) {
			return "translate(" + (x1(d.name)) + "," + (y(0) - (y(properties.max - d.value)) - 15) + ")"; 
		});
	}

	barChart = barChart.selectAll("rect")
	.data(function(d) { return d.val; })
	.enter().append("rect");

	if(properties.type == 2){
		c = d3.scale.category10();
		barChart.style("fill", function(d) {return c(d.name); });
	}

	barChart.attr("width", x1.rangeBand())
	.attr("x", function(d) { return x1(d.name); })
	.attr("y", function(d) { return y(d.value); })
	.attr("value", function(d){return d.name;})
	.attr("height", function(d) { return height - y(d.value); })

	return barChart;
}

/**
 * Cria ou atualiza gráfico de barras.
 * @param  {[object]} properties [objeto com as propriedades do gráfico.]
 */
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
			return {name: name, value: +d[name], library: d.library};
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
	properties.max = max;

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("x", (properties.width/2) )
	.attr("y",  40 )
	.attr("dy", "0.2em")
	.style("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Bibliotecas");

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
		createLegend(svg, properties);
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
		var use = (Number(line['total_internal_interfaces_usage_percentage']));
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
	var html = "<center><b>" + title + "</b></center><br><table>";
	data.forEach(function(d){
		if(title === d.name){
			html += "<tr align='left'><td align='right'>" + Number(d.number_clients).toLocaleString("pt-BR") + "</td><td>&emsp;clientes</td></tr>"
			html += "<tr align='left'><td align='right'>" + Number(d.total_internal_interfaces).toLocaleString("pt-BR") + "</td><td>&emsp;interfaces internas</td></tr>"
			html += "<tr align='left'><td align='right'>" + Number(d.total_internal_interfaces_usage).toLocaleString("pt-BR") + "</td><td>&emsp;interfaces internas usadas (" + Number(d.total_internal_interfaces_usage_percentage).toLocaleString("pt-BR") + "%)</td></tr>"
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
	var html = "<center><b>" + title + "</b></center><br><table>";
	var total = 0;
	data.forEach(function(d){
		if(title === d.name){
			var totalPublic = Number(d.total_public_interfaces);
			var totalPublicUsage = Number(d.total_public_interfaces_usage);
			var totalPublicUsagePercent = Number(d.total_public_interfaces_usage_percentage);

			var totalInternal = Number(d.total_internal_interfaces);
			var totalInternalUsage = Number(d.total_internal_interfaces_usage);
			var totalInternalUsagePercent = Number(d.total_internal_interfaces_usage_percentage);

			total = totalInternal + totalPublic;

			html += "<tr align='left'><td align='right'>" + totalInternal.toLocaleString("pt-BR") + "</td><td>&emsp;interfaces internas</td></tr>"
			html += "<tr align='left'><td align='right'>" + totalInternalUsage.toLocaleString("pt-BR") + "</td><td>&emsp;interfaces internas usadas (" + Number(totalInternalUsagePercent).toLocaleString("pt-BR") + "%)</td></tr>"
			html += "<tr align='left'><td align='right'>" + totalPublic.toLocaleString("pt-BR") + "</td><td>&emsp;interfaces públicas</td></tr>"
			html += "<tr align='left'><td align='right'>" + totalPublicUsage.toLocaleString("pt-BR") + "</td><td>&emsp;interfaces públicas usadas (" + Number(totalPublicUsagePercent).toLocaleString("pt-BR") + "%)</td></tr>"
		}
	});
	html += "</table><center><br><b>" + total + " interfaces</b></center>";
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
		var html = (type == 1) ? createHtmlToolTipBarChartI(d.library, d, data) : createHtmlToolTipBarChartII(d.library, d, data);
		toolTip.html(html);
	});
	chart.on("mouseout", function(d){
		toolTip.style("display", "none");
	});
}

/**
 * Configura e adiciona barChar I inicial.
 * @param  {[map]} data [metados do gráfico]
 */
function initBarChartI(data){
	dataChartI = data;
	createBarCharI(data);
}

/**
 * Atualiza barChar I.
 * @param  {[list]} listLibs [lista de bibliotecas]
 * @param  {[int]} sort [tipo de ordenação]
 */
function updateBarCharI(listLibs, sort){
	var data = [];
	//Filtra bibliotecas.
	dataChartI.forEach(function(d) {
		if(listLibs.indexOf(d.name) != -1){
			data.push(d);
		}
	});
	//Ordena se necessário, por uso de APIs internas.
	if(sort == 2){
		data.sort(function(value1, value2){
			var a = Number(value1.total_internal_interfaces_usage_percentage);
			var b = Number(value2.total_internal_interfaces_usage_percentage);
			return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
		});
	}
	else if(sort == 3){//Ordena se necessário, por popularidade.
		data.sort(function(value1, value2){
			var a = Number(value1.number_clients);
			var b = Number(value2.number_clients);
			return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
		});
	}
	createBarCharI(data);
}

/**
 * Cria barChar I.
 * @param {[map]} data [metados do gráfico]
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
		properties.color = d3.scale.category20();
		properties.type = 1;

		var barChart = createBarChart(properties);
		createToolTipBarChar(barChart, data, 1);
	}
}

/**
 * Cria barChar II.
 * @param {[map]} data [metados do gráfico]
 */
function createBarCharII(data){
	if(data){
		//Seta propriedades
		var properties  = {};
		properties.div = 'chart4-area-plot';
		properties.dataset = createDataFormatChartII(data);
		properties.options = ["Interfaces Internas", "Interfaces Públicas"];
		properties.labelY = 'Interfaces Usadas (%)';
		properties.width = $("#chart4-area-plot").width() - 100;
		properties.top = 600;
		properties.containsLegend = false;
		properties.color = d3.scale.category10();
		properties.type = 2;

		var barChart = createBarChart(properties);
		createToolTipBarChar(barChart, data, 2);
	}
}
