 
var remedios = [];
var lista = [];
var app = angular.module('produtos', []);
	app.controller('ctrlProdutos', function($scope,$http) {
				
		$scope.buscaini = localStorage.getItem("busca");
		$scope.textobusca = "Buscando por " + $scope.buscaini;
	   	
		$scope.carregar = function(param){
			var busca = param;
			var dataString="busca="+busca+"&select=";	
			
				/* var html = '<img class="aguarde" src="img/aguarde.gif"/>';
				$('#listview').append(html);
				$("#listview").listview("refresh");		 */ 	
				
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/busca.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  data: dataString
				   }).then(function (data){
						 /*  var hotel_sel = [];
						  hotel_sel = data.data;
						  $scope.hotel = hotel_sel;
						  $scope.opcoes = hotel_sel.options;  */
				   },function (error){
					//alert('Error: ' + data);
				   });
				}
		
		
		
		
		$scope.keydown = function (event) {
		 	if (event.keyCode === 13) {
				$scope.textobusca = "Buscando por " + $scope.campobusca;
				localStorage.setItem("busca",$scope.campobusca);
				$('.itRemedios').remove();
				$scope.carregar($scope.campobusca);
			} 
		};
				
		
		
		$(document).ready(function(){
			if (localStorage.getItem("add") == "true") $('.ftLista').css('visibility','visible')
			$('a').removeClass('ui-shadow')
				
		});	
		
				
				
		$scope.adicionarLista = function(event){
			localStorage.setItem("add","true") 
			$scope.lista.push({
				codigo: event.target.id,
				nome: $('#p' + event.target.id).html(),
				dosagem: $('#d' + event.target.id).html(),
				qtd: 1
			});
			lista = $scope.lista;
			$('.ftLista').css('visibility','visible')
				navigator.notification.alert(
					'Remédio adicionado a lista com sucesso!',  // message
					alertDismissed,         // callback
					'Lista',            // title
					'OK'                  // buttonName
			); 
												
		}
		
		function alertDismissed(){}//location.href='produtos.html#pageone'}
		
			
		$scope.somar = function() {
		
			var Vi = 1;
			var total = $scope.lista.qtd; 
			$scope.lista.qtd = Vi + total;
			lista = $scope.lista;
		}
		
		$scope.subt = function() {
			var total = $scope.list.qtd; 
			if (total > 1)
			$scope.list.qtd = total - 1;
			lista = $scope.lista;
		}
		
	});
 
	function voltarLista(){
				if (localStorage.getItem('listaHome')=="true"){
					location.href='index.html'
				}else
				{
					location.href='produtos.html'
				}
	}







