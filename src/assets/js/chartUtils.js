/**
 * Script com funções utilitária para manipular os gráficos.
*/


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
		if(type == 1){
			toolTip.html(createHtmlToolTipBarChartI(d.library, d, data));
		}
		else{
			toolTip.html(createHtmlToolTipBarChartII(d.library, d, data));
		}
	});
	chart.on("mouseout", function(d){
	toolTip.style("display", "none");
	});
}



