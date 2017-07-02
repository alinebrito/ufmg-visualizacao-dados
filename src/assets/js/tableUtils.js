/**
* Script para manipulação de tabelas dinâmicamente.
* 
* Realiza a leitura dos dados em um arquivo CSV e cria a tabela conforme a quantidade de 
* colunas e linhas definidas no arquivo de entrada.
*
* A primeira linha do arquivo CSV define o nome das colunas.
*/

var tableBody; //dados da tabela corrente (exibida).
var tableBodyOrig; // dados da tabela original.
var tableHeader; // cabeçalho da tabela.
var sizePage = 20; //quantidade de elementos na página atual da tabela.
var indexPage = 0; // índice para o início da página exibida.
var indexPageLast = 20; // índice para o final da página exibida.
var sort = 1; // defini se a ordenação é crescente(1) ou decrescente(-1).


/**
* Habilita ou desabilita os botões de paginação.
*/
function enableAndDisableButtons(){

	var buttonNext =  $("#button-next-page");
	var buttonBack = $("#button-back-page");

	if(indexPage == 0){ //desebilita botão voltar.
		buttonBack.attr('disabled','disabled');
	}
	else{//habilita botão voltar.
		buttonBack.removeAttr('disabled');
	}

	var maxPage = Math.floor(tableBody.length/sizePage);
	maxPage += tableBody.length%sizePage!=0?1:0;

	var pageCurrent = Math.floor(indexPageLast/sizePage);
	pageCurrent += indexPageLast%sizePage!=0?1:0;

	if(pageCurrent != maxPage){//habilita botão próximo.
		buttonNext.removeAttr('disabled');
	}
	else{//desabilita botão próximo.
		buttonNext.attr('disabled','disabled');
	}
}


function isUrl(s) {
	var regexp = /(https?:\/\/[^\s]+)/g;
	return regexp.test(s);
}

/**
* Adiciona uma nova linha na tabela.
* @param {map} data - map contendo dados da linha.
*/
function addLine(data){
	var html = '<tr>';
	for(var i= 0; i < data.length; i++){
		var val = data[i];
		html += '<td';
		if(!isNaN(val)){//Se é um número, alinhamento a esquerda.
			html += ' style="text-align:right" ';
		}

		html += '>';
		var separator = ",";

		if(val.indexOf(separator) !== -1){//Se são vários atributos separados por vírgula, formata cada atributo.
			var values = val.split(separator);
			values.forEach(function(d){
				html += isUrl(d) ? '<a href="' + d + '" target="_blank">' + d + '</a>&nbsp;': d + '&nbsp;' ;
			});
		}
		else{
			html += isUrl(val) ? '<a href="' + val + '" target="_blank">' + val + '</a>&nbsp;': val ;
		}
	}
	html += '</td>';
	html += "</tr>";
	$("table").append(html);
}

/**
* Atualiza tabela, limpa os dados da tabela atual e insere os novos dados.
* @param  {map} data - map contendo dados da tabela. Cada posição no map representa uma linha.
*/
function updateTable(data){
	var table = document.getElementById("table");
	if(tableBody && table && data){
		table.innerHTML = ""; //limpa dados existentes.
		addHead();
		for(var i= 0; i < data.length; i++){
			addLine(data[i]);
		}
	}
}

/**
* Desloca a tabela para a próxima página.
* Utiliza as variáveis globais de paginação (indexPage,indexPageLast).
*/
function toPage(){
	enableAndDisableButtons();
	updateTable(tableBody.slice(indexPage,indexPageLast));
}

/**
* Desloca a tabela para a primeira página.
*/
function firtPage(){
	indexPage = 0;
	indexPageLast = sizePage;
	toPage();
}

/**
* Desloca a tabela para a pŕoxima página.
*/
function nextPage(){
	if(isPageValid(indexPage+sizePage,indexPageLast+sizePage)){
		indexPage += sizePage;
		indexPageLast = indexPage+sizePage
		toPage();
	}
}

/**
* Desloca a tabela para a página anterior.
*/
function backPage(){
	if(isPageValid(indexPage-sizePage,indexPage)){
		indexPage -= sizePage;
		indexPageLast = indexPage+sizePage;
		toPage();
	}
}

/**
* Verifica se o dado recebido é uma data.
* @param  {String}  data - texto contendo o dado a ser validado.
* @return {Boolean} - verdadeiro se é uma data válida, falso caso contrário.
*/
function isValidDate(data){
	var date = new Date(data);
	return  (("Invalid Date".localeCompare(date) != 0) && isNaN(data));
}

/**
* Ordena os dados da tabela.
* Verifica se o dado recebido é uma data, número ou texto.
* @param  {int} col - número da coluna de referência da ordenação.
*/
function sortTable(col){
	sort *= -1;
	tableBodyOrig.sort(function(a, b){ 
		if(isValidDate(a[col]) && isValidDate(b[col])){// ordenação de datas.
			return sort > 0 ? new Date(a[col]) - new Date(b[col]) : new Date(b[col]) - new Date(a[col]);
		}
		else if(isNaN(a[col]) && isNaN(b[col])){ // ordenação de string.
			return sort > 0 ? d3.ascending(a[col], b[col]) : d3.descending(a[col], b[col]);
		}
		else{ // ordenação de números.
			return sort > 0 ? (a[col] - b[col]) : (b[col] - a[col]);
		}
	});
	tableBody = tableBodyOrig;
	firtPage();
}


/**
* Adiciona cabeçalho da tabela. Lê dados da variável global 'tableHeader'.
*/
function addHead(){
	var html = '<thead id="table-head" ><tr>';
	for(var i= 0; i < tableHeader.length; i++){
		html += "<th>" + tableHeader[i] + "</th>";
	}
	html += "</tr></thead>";
	$("table").append(html);
}

/**
* Procura linhas na tabela que contém o texto procurado.
* Atualiza a tabela 'tableBody', apenas linhas que contém o texto procurado são adicionadas.
* @param  {String} data -  texto buscado na tabela.
*/
function searchTable(data){
	tableBody = [];
	for(var i= 0; i < tableBodyOrig.length; i++){
		var line = tableBodyOrig[i];
		for(var j= 0; j < line.length; j++){
			if(line[j]){
				var dataLineUpper = line[j].toUpperCase();
				var dataSearchUpper = data.toUpperCase();
				if(dataLineUpper.includes(dataSearchUpper)){
					tableBody.push(line);
				}
			}
		}
	}
	firtPage();
}


/**
* Lê um arquivo CSV e cria a tabelas dinamicamente.
* A primeira linha do arquivo define o cabeçalho da tabela.
*
* A quantidade de colunas no CSV defini a quantidade de colunas da tabela.
* As linhas do CSV são as linhas da tabela.
* 
*/
function initTable(data){
	tableHeader = Object.keys(data[0])
	tableBody = tableBodyOrig = data.map(function(line){
		var lineArray = [];
		for(var j= 0; j < tableHeader.length; j++){
			var key = tableHeader[j];
			lineArray.push(line[key]);
		}
		return lineArray;
	});
	firtPage();
}

/**
* Verifica se é um intervalo de dados válido. Ou seja,
* se o usuário deseja  ir para uma página válida.
* @param  {int}  indexInit - índice para a posição inicial do intervalo.
* @param  {int}  indexLast - índice para a posição final do intervalo.
* @return {Boolean} - Verdadeiro se é uma página válida, falso caso contrário.
*/
function isPageValid(indexInit, indexLast){

//Se começa de um índice negativo.
if(indexInit < 0){
	return false;
}

//Se não ultrapassa a última página.
var maxIndice = tableBody.length + tableBody.length%sizePage
if((indexLast <= tableBody.length) || (indexLast <= maxIndice)){
	return true;
}

return false;
}

