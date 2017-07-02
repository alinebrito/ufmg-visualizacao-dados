/**
 * Script para criar os gráficos de BoxPlot.
 */

var dataBoxPlot;

/**
 * Função para criar os BoxPlot.
 * Adaptado de: http://bl.ocks.org/jensgrubert/7789216
 * Incluído function setX, color, ajustes dos metadados, escala de cores.
 */
(function() {
	d3.box = function() {
	var width = 1;
	var height = 1;
	var duration = 0;
	var domain = null;
	var value = Number;
	var whiskers = boxWhiskers;
	var quartiles = boxQuartiles;
	var showLabels = true;
	var numBars = 4;
	var curBar = 1;
	var tickFormat = null;
	var x = null;
	var color = d3.scale.category20(); // cor dos box plot.

		function box(g) {
			g.each(function(data, i) {
				var d = data[1].sort(d3.ascending);
				var g = d3.select(this),
				n = d.length,
				min = d[0],
				max = d[n - 1];

				// Calcula os 3 quartiles
				var quartileData = d.quartiles = quartiles(d);

				// Calculas os "bigodes" do boxplot. Retorna o inicial e o final.
				var whiskerIndices = whiskers && whiskers.call(this, d, i),
				whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });

				// Calcula os  outliers.
				var outlierIndices = whiskerIndices	? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n)): d3.range(n);

				// Configura escala do eixo X.
				var x1 = d3.scale.linear()
				.domain(domain && domain.call(this, d, i) || [min, max])
				.range([height, 0]);

				var x0 = this.__chart__ || d3.scale.linear()
				.domain([0, Infinity])
				.range(x1.range());

				// Set a nova escala.
				this.__chart__ = x1;

				//Linha central do box plot (entre os "bigodes")
				var center = g.selectAll("line.center")
				.data(whiskerData ? [whiskerData] : []);

				//Adiciona linha vertical.
				center.enter().insert("line", "rect")
				.attr("class", "center")
				.attr("x1", width / 2)
				.attr("y1", function(d) { return x0(d[0]); })
				.attr("x2", width / 2)
				.attr("y2", function(d) { return x0(d[1]); })
				.style("opacity", 1e-6)
				.transition()
				.duration(duration)
				.style("opacity", 1)
				.attr("y1", function(d) { return x1(d[0]); })
				.attr("y2", function(d) { return x1(d[1]); });

				center.transition()
				.duration(duration)
				.style("opacity", 1)
				.attr("y1", function(d) { return x1(d[0]); })
				.attr("y2", function(d) { return x1(d[1]); });

				center.exit().transition()
				.duration(duration)
				.style("opacity", 1e-6)
				.attr("y1", function(d) { return x1(d[0]); })
				.attr("y2", function(d) { return x1(d[1]); })
				.remove();

				//Configura e adiciona caixa do boxplot.
				var box = g.selectAll("rect.box")
				.data([quartileData]);

				box.enter().append("rect")
				.style("fill", function(d) {return color(x(data[0]));}) // cor das caixas.
				.attr("class", "box")
				.attr("x", 0)
				.attr("y", function(d) { return x0(d[2]); })
				.attr("width", width)
				.attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
				.transition()
				.duration(duration)
				.attr("y", function(d) { return x1(d[2]); })
				.attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

				box.transition()
				.duration(duration)
				.attr("y", function(d) { return x1(d[2]); })
				.attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

				//Configura e adiciona a linha da mediana.
				var medianLine = g.selectAll("line.median")
				.data([quartileData[1]]);

				medianLine.enter().append("line")
				.attr("class", "median")
				.attr("x1", 0)
				.attr("y1", x0)
				.attr("x2", width)
				.attr("y2", x0)
				.transition()
				.duration(duration)
				.attr("y1", x1)
				.attr("y2", x1);

				medianLine.transition()
				.duration(duration)
				.attr("y1", x1)
				.attr("y2", x1);

				//Atualiza os "bigodes"
				var whisker = g.selectAll("line.whisker")
				.data(whiskerData || []);

				whisker.enter().insert("line", "circle, text")
				.attr("class", "whisker")
				.attr("x1", 0)
				.attr("y1", x0)
				.attr("x2", 0 + width)
				.attr("y2", x0)
				.style("opacity", 1e-6)
				.transition()
				.duration(duration)
				.attr("y1", x1)
				.attr("y2", x1)
				.style("opacity", 1);

				whisker.transition()
				.duration(duration)
				.attr("y1", x1)
				.attr("y2", x1)
				.style("opacity", 1);

				whisker.exit().transition()
				.duration(duration)
				.attr("y1", x1)
				.attr("y2", x1)
				.style("opacity", 1e-6)
				.remove();

				// Atualiza os outliers.
				var outlier = g.selectAll("circle.outlier")
				.data(outlierIndices, Number);

				outlier.enter().insert("circle", "text")
				.style("fill", '#FFFFFF') // cor dos círculos/outliers, branco.
				.attr("class", "outlier")
				.attr("r", 5)
				.attr("cx", width / 2)
				.attr("cy", function(i) { return x0(d[i]); })
				.style("opacity", 1e-6)
				.transition()
				.duration(duration)
				.attr("cy", function(i) { return x1(d[i]); })
				.style("opacity", 1);

				outlier.transition()
				.duration(duration)
				.attr("cy", function(i) { return x1(d[i]); })
				.style("opacity", 1);

				outlier.exit().transition()
				.duration(duration)
				.attr("cy", function(i) { return x1(d[i]); })
				.style("opacity", 1e-6)
				.remove();

				//Calcula o forma dos ticks
				var format = tickFormat || x1.tickFormat(8);

				// Atualiza os boxTicks.
				var boxTick = g.selectAll("text.box")
				.data(quartileData);

				if(showLabels == true) {
					boxTick.enter().append("text")
					.attr("class", "box")
					.attr("dy", ".3em")
					.attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
					.attr("x", function(d, i) { return i & 1 ?  + width : 0 })
					.attr("y", x0)
					.attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
					.text(format)
					.transition()
					.duration(duration)
					.attr("y", x1);
				}

				boxTick.transition()
				.duration(duration)
				.text(format)
				.attr("y", x1);

				// Atualiza ticks.
				var whiskerTick = g.selectAll("text.whisker")
				.data(whiskerData || []);
				if(showLabels == true) {
					whiskerTick.enter().append("text")
					.attr("class", "whisker")
					.attr("dy", ".3em")
					.attr("dx", 6)
					.attr("x", width)
					.attr("y", x0)
					.text(format)
					.style("opacity", 1e-6)
					.transition()
					.duration(duration)
					.attr("y", x1)
					.style("opacity", 1);
				}
				whiskerTick.transition()
				.duration(duration)
				.text(format)
				.attr("y", x1)
				.style("opacity", 1);

				whiskerTick.exit().transition()
				.duration(duration)
				.attr("y", x1)
				.style("opacity", 1e-6)
				.remove();
			});
			d3.timer.flush();
		}

		box.width = function(x) {
			if(!arguments.length){
				return width;
			}
			width = x;
			return box;
		};

		box.height = function(x) {
			if(!arguments.length){
				return height;
			}
			height = x;
			return box;
		};

		box.tickFormat = function(x) {
			if(!arguments.length){
				return tickFormat;
			}
			tickFormat = x;
			return box;
		};

		box.duration = function(x) {
			if(!arguments.length){
				return duration;
			}
			duration = x;
			return box;
		};

		box.domain = function(x) {
			if(!arguments.length)
				return domain;
			domain = (x == null) ? x : d3.functor(x);
			return box;
		};

		//Seta escala X com nome das bibliotecas.
		//Utilizado na configraçãod as cores dos boxPlot.
		box.setX = function(value) {
			if(!arguments.length)
				return domain;
			x = value;
			return box;
		};

		box.value = function(x) {
			if (!arguments.length){
				return value;
			}
			value = x;
			return box;
		};

		box.whiskers = function(x) {
			if (!arguments.length){
				return whiskers;
			}
			whiskers = x;
			return box;
		};

		box.showLabels = function(x) {
			if (!arguments.length){
				return showLabels;
			}
			showLabels = x;
			return box;
		};

		box.quartiles = function(x) {
			if (!arguments.length){
				return quartiles;
			}
			quartiles = x;
			return box;
		};
		return box;
	};

	function boxWhiskers(d) {
		return [0, d.length - 1];
	}

	function boxQuartiles(d) {
		return [
		d3.quantile(d, .25),
		d3.quantile(d, .5),
		d3.quantile(d, .75)
		];
	}
})();

/**
 * Formata os dados para o BoxPlot.
 * @param  {[type]} csv  [csv do gráfico]
 * @param  {[type]} sort [tipo de ordenação]
 */
function createDataFormatBoxPlot(csv, sort){
	var header = Object.keys(csv[0]);
	var data = [];
	for(var i=0; i<header.length; i++){
		data[i] = [];
		data[i][1] = [];
		data[i][0] = header[i];
	}
	csv.forEach(function(d) {
		for(var i=0; i<header.length; i++){
			var key = header[i];
			var value =  Number(d[key]);
			data[i][1].push(value);
		}
	});

	//Ordena por popularidade se necessário.
	if(sort == 2){
		data.sort(function(value1, value2){
			var a = Number(libraries[value1[0]].total_internal_interfaces_usage_percentage);
			var b = Number(libraries[value2[0]].total_internal_interfaces_usage_percentage);
			return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
		});
	}
	return data;
}


/**
 * Cria o Box Plot.
 * Adaptado de: http://bl.ocks.org/jensgrubert/7789216
 * @param  {[String]} idDiv [id da div onde o gráfico será criado]
 * @param  {[map]} data  [metadados do gráfico]
 */
 function createBoxPlot(properties){

	var labels = true; // mostrar os labels ao lado de cada boxplot.
	var margin = {top: 10, right: 20, bottom: 70, left: 60};
	var width = properties.width - margin.left - margin.right - 400;
	var height = 250 - margin.top - margin.bottom;
	var min = 0;
	var max = 0;

	//Calcula limite do eixo Y.
	properties.dataset.forEach(	function(d) {
		var maxOption = d3.max(d[1], function(val) { return +val;});
		max = (maxOption > max) ? maxOption : max;
	});

	// Configura eixo X.
	var x = d3.scale.ordinal()
	.domain(properties.dataset.map(function(d) { return d[0] } ) )
	.rangeRoundBands([0 , width], 0.7, 0.3);

	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

	// Configura eixo Y.
	var y = d3.scale.linear()
	.domain([0, max])
	.range([height + margin.top, 0 + margin.top]);

	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	var chart = d3.box()
	.setX(x)
	.whiskers(iqr(1.5))
	.height(height)
	.domain([min, max])
	.showLabels(labels);

	d3.select("#" + properties.div + "-svg").remove();

	var svg = d3.select("#" + properties.div).append("svg")
	.attr("id", properties.div + "-svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("class", "box")
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Desenha os boxplots
	svg.selectAll(".box")
	.data(properties.dataset)
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
	.call(chart.width(x.rangeBand()));

	// Adiciona eixo Y.
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "-3.5em")
	.style("text-anchor", "end")
	.style("font-size", "11px")
	.text("Uso das Interfaces Internas (%)");

	// Adiciona eixo X.
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
	.call(xAxis)
	.append("text")
	.attr("x", (width / 2) )
	.attr("y",  40 )
	.attr("dy", "0.2em")
	.style("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Bibliotecas");

	//Calcula o interquartile.
	function iqr(k) {
		return function(d, i) {
			var q1 = d.quartiles[0],
			q3 = d.quartiles[2],
			iqr = (q3 - q1) * k,
			i = -1,
			j = d.length;
			while (d[++i] < q1 - iqr);
			while (d[--j] > q3 + iqr);
			return [i, j];
		};
	}
}

/**
 * Cria o box Plot na respectiva Div.
 * @param  {[map]} data [metadados do gráfico]
 * @param  {[list]} listLibs [lista de bibliotecas]
 * @param  {[int]} sort [tipo de ordenação]
 */
function updateOrCreateBoxPlot(data, listLibs, sort){
	if(data){
		var properties = {};
		properties.div = 'chart2-area';
		properties.dataset = createDataFormatBoxPlot(data, sort);
		properties.width = listLibs ? ((listLibs.length * 110) + 500) : window.innerWidth;
		createBoxPlot(properties);
	}
}

/**
 * Atualiza boxPlot com a nova lista de bibliotecas.
 * @param  {[list]} listLibs [lista de bibliotecas]
 * @param  {[int]} sort [tipo de ordenação]
 */
function updateBoxPlot(listLibs, sort){
	var data = [];
	dataBoxPlot.forEach(function(d) {
		var map = {};
		listLibs.forEach(function(lib){
			if(d[lib]){
				map[lib] = Number(d[lib]);
			}
		});
		data.push(map);
	});
	updateOrCreateBoxPlot(data, listLibs, sort);
}

/**
 * Configura e adiciona boxPlot inicial.
 * @param  {[map]} data [metadados do gráfico]
 */
function initBoxPlot(data){
	dataBoxPlot = data;
	updateOrCreateBoxPlot(data);
}