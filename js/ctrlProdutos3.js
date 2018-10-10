 
var remedios = [];
var lista = [];
var farmacias = []

var app = angular.module('produtos', []);
	app.controller('ctrlProdutos', function($scope,$http,$compile) {
				
		$scope.buscaini = localStorage.getItem("busca");
		$scope.textobusca = "Buscando por " + $scope.buscaini;
		$scope.farmacias = [{ nome: "Drogaria Pacheco", endereco: "Rua Barata Ribeiro , 56 - Copacabana - RJ. Tel:(21)2556-8765",preco:"R$ 90,00"},
					{nome: "Drogaria Mundial", endereco: "Av Nossa Senhora de Copacabana , 1016 - Copacabana - RJ Tel:(21)2504-8125",preco:"R$ 45,00"},
					{nome: "Drogaria Candido", endereco: "Rua Barata Ribeiro , 56 - Copacabana - RJ. Tel:(21)2556-8765",preco:"R$ 65,00"},
					{nome: "Fármacia Mais", endereco: "Rua Barata Ribeiro , 56 - Copacabana - RJ. Tel:(21)2556-8765",preco:"R$ 35,50"}];
		farmacias = $scope.farmacias;
	   	
		$scope.carregar = function(param){
			var busca = param;

				 
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/busca.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  data: {'busca' : busca}
				   }).then(function (data){
					  
					     remedios = (data.data);
						 $scope.remedios = remedios;
						//$scope.$apply();
						// var dados = JSON.parse(data.data)
						
				   },function (error){
					//alert('Error: ' + data);
				   });
		}
		
		
		
		
		$scope.keydown = function (event) {
		 	if (event.keyCode === 13) {
				$scope.textobusca = "Buscando por " + $scope.campobusca;
				localStorage.setItem("busca",$scope.campobusca);
				//$('.itRemedios').remove();
				$scope.carregar($scope.campobusca);
			} 
		};
				
		
		
		$(document).ready(function(){
			if (localStorage.getItem("add") == "true") $('.ftLista').css('visibility','visible')
			$('a').removeClass('ui-shadow')
				
		});	
		
				
				
		$scope.adicionarLista = function(event){
			//alert('jj')
			localStorage.setItem("add","true") 
			
			lista.push({
				'codigo': event.target.id,
				'nome': $('#p' + event.target.id).html(),
				'dosagem': $('#d' + event.target.id).html(),
				'qtd': 1
			});
			$scope.lista = lista;
			//$scope.$apply();
			$("#listaview").listview("refresh");	
			$('.ftLista').css('visibility','visible')
			//alert('Remédio adicionado com sucesso!');
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
			location.href='index.html';
		}else
		{
			location.href='produtos.html#pageone';
		}
	}







