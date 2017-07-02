/**
 * Script para criar o Donnut Chart.
 */

/**
 *  Cria o Donut Char.
 * @param {[type]} idDiv [id da div onde o gráfico será criado.]
 */
function DonutCharts(idDiv) {
	var charts = d3.select('#' + idDiv);
	var chart_m;
	var chart_r;
	var color = d3.scale.category10();
	var idlegend;

	var getCatNames = function(dataset) {
		var catNames = new Array();
		for (var i = 0; i < dataset[0].data.length; i++) {
			catNames.push(dataset[0].data[i].cat);
		}
		return catNames;
	}

	var createLegend = function(catNames, legendCustom) {
		var legends = legendCustom
		.selectAll('g')
		.data(catNames)
		.enter().append('g')
		.attr('transform', function(d, i) {
			return 'translate(' + (i * 200 + (window.innerWidth/3)) + ', 10)';
		});

		legends.append('circle')
		.attr('class', 'legend-icon')
		.attr('r', 6)
		.style('fill', function(d, i) {
			return color(i);
		});

		legends.append('text')
		.attr('dx', '1em')
		.attr('dy', '.3em')
		.text(function(d) {
			return d;
		});
	}

	var createCenter = function(pie) {
		var eventObj = {
			'mouseover': function(d, i) {
				d3.select(this)
				.transition()
				.attr("r", chart_r * 0.65);
			},
			'mouseout': function(d, i) {
				d3.select(this)
				.transition()
				.duration(500)
				.ease('bounce')
				.attr("r", chart_r * 0.6);
			},
			'click': function(d, i) {
				var paths = charts.selectAll('.clicked');
				pathAnim(paths, 0);
				paths.classed('clicked', false);
				resetAllCenterText();
			}
		}

		var donuts = d3.selectAll('.donut');

		donuts.append("svg:circle")
		.attr("r", chart_r * 0.6)
		.style("fill", "#E7E7E7")
		.on(eventObj);

		donuts.append('text')
		.attr('class', 'center-txt type')
		.attr('y', chart_r * -0.16)
		.attr('text-anchor', 'middle')
		.style('font-weight', 'bold')
		.text(function(d, i) {
			return d.type;
		});

		donuts.append('text')
		.attr('class', 'center-txt value')
		.attr('text-anchor', 'middle');

		donuts.append('text')
		.attr('class', 'center-txt percentage')
		.attr('y', chart_r * 0.16)
		.attr('text-anchor', 'middle')
		.style('fill', '#A2A2A2');
	}

	var setCenterText = function(thisDonut) {
		var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
			return d.data.val;
		});

		thisDonut.select('.value')
		.text(function(d) {
			return (sum)? sum.toFixed(0) + d.unit : d.total.toFixed(0) + d.unit;
		});

		thisDonut.select('.percentage')
		.text(function(d) {
			return (sum)? (sum/d.total*100).toFixed(0) + '%': '';
		});
	}

	var resetAllCenterText = function() {
		charts.selectAll('.value')
		.text(function(d) {
			return d.total.toFixed(0) + d.unit;
		});

		charts.selectAll('.percentage')
		.text('');
	}

	var pathAnim = function(path, dir) {
		switch(dir) {
			case 0:
			path.transition()
			.duration(500)
			.ease('bounce')
			.attr('d', d3.svg.arc()
				.innerRadius(chart_r * 0.7)
				.outerRadius(chart_r)
				);
			break;

			case 1:
			path.transition()
			.attr('d', d3.svg.arc()
				.innerRadius(chart_r * 0.7)
				.outerRadius(chart_r * 1.08)
				);
			break;
		}
	}

	var updateDonut = function() {

		var eventObj = {
			'mouseover': function(d, i, j) {
				pathAnim(d3.select(this), 1);
				var thisDonut = charts.select('.type' + j);
				thisDonut.select('.value').text(function(donut_d) {
					return d.data.val.toFixed(0) + donut_d.unit;
				});
				thisDonut.select('.percentage').text(function(donut_d) {
					return (d.data.val/donut_d.total*100).toFixed(2) + '%';
				});
			},
			'mouseout': function(d, i, j) {
				var thisPath = d3.select(this);
				if (!thisPath.classed('clicked')) {
					pathAnim(thisPath, 0);
				}
				var thisDonut = charts.select('.type' + j);
				setCenterText(thisDonut);
			},
			'click': function(d, i, j) {
				var thisDonut = charts.select('.type' + j);
				if (0 === thisDonut.selectAll('.clicked')[0].length) {
					thisDonut.select('circle').on('click')();
				}
				var thisPath = d3.select(this);
				var clicked = thisPath.classed('clicked');
				pathAnim(thisPath, ~~(!clicked));
				thisPath.classed('clicked', !clicked);
				setCenterText(thisDonut);
			}
		};

		var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.val;
		});

		var arc = d3.svg.arc()
		.innerRadius(chart_r * 0.7)
		.outerRadius(function() {
			return (d3.select(this).classed('clicked'))? chart_r * 1.08:chart_r;
		});

		var paths = charts.selectAll('.donut')
		.selectAll('path')
		.data(function(d, i) {
			return pie(d.data);
		});

		paths.transition()
		.duration(1000)
		.attr('d', arc);

		paths.enter()
		.append('svg:path')
		.attr('d', arc)
		.style('fill', function(d, i) {
			return color(i);
		})
		.style('stroke', '#FFFFFF')
		.on(eventObj)

		paths.exit().remove();
		resetAllCenterText();
	}

	this.create = function(properties) {

		var idDiv =  properties.div;
		var dataset =  properties.dataset;

		var $charts = $('#' + idDiv);
		chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
		chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;

		var legendCustom = d3.select('#' + properties.divLegend ).append("svg")
		.attr('class', 'legend')
		.attr('width', '100%')
		.attr('height', 50)
		.attr('transform', 'translate(0, 0)');

		var donut = charts.selectAll('.donut')
		.data(dataset)
		.enter().append('svg:svg')
		.attr('width', (chart_r + chart_m) * 2)
		.attr('height', (chart_r + chart_m) * 2)
		.append('svg:g')
		.attr('class', function(d, i) {
			return 'donut type' + i;
		})
		.attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');

		createLegend(getCatNames(dataset), legendCustom);
		createCenter();
		updateDonut();
	}
}

/**
* Formata os dados para o Donut.
* @param  {[map]} data [dados do gráfico]
*/
function createDataFormatDonut(data){
	var dataset = new Array();
	data.map(function(line, i){
		var value = {};
		var total_interface_internal = Number(line['total_internal_interfaces']);
		var total_interface_public = Number(line['total_public_interfaces']);
		var total = total_interface_internal + total_interface_public;
		var type = line['name'];
		var unit = ' Interfaces';

		var categories = new Array();
		categories.push({'cat': 'Interfaces Internas', 'val': total_interface_internal});
		categories.push({'cat': 'Interfaces Públicas', 'val': total_interface_public});

		dataset.push({
			"type": type,
			"unit": unit,
			"data": categories,
			"total": total
		});
	});
	return dataset;
}

/**
* Cria o Donut Chart na respectiva div.
* @param  {[MAP]} data [metadadis sobre a popularidade de interfaces]
* @return {[type]}      [description]
*/
function createDonutCharPublicAndInternalInterface(data){
	if(data){
		var properties = {};
		properties.div = 'chart3-area-plot';
		properties.divLegend = 'legend-internal-public';
		properties.dataset = createDataFormatDonut(data);
		var donuts = new DonutCharts(properties.div);
		donuts.create(properties);
	}
}
