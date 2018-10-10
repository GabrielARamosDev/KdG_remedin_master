
var remedios = [];
var lista = [];
var app = angular.module('produtos', []);
	app.controller('ctrlProdutos', function($scope,$compile) {
				
		$scope.buscaini = localStorage.getItem("busca");
		$scope.textobusca = "Buscando por " + $scope.buscaini;
		$scope.lista = [];
		
		$scope.carregar = function(param){
			var busca = param;
			var dataString="busca="+busca+"&select=";	 
				var html = '<img class="aguarde" src="img/aguarde.gif"/>';
				$('#listview').append(html);
				$("#listview").listview("refresh");		 						  
				$.ajax({
					 type: "POST",
					 url : "http://remedin.fourtuna.com.br/wp-content/busca.php",
					 data: dataString,
					 crossDomain: true,
					 cache: false,
					 success: function(data){
						remedios = [];
					
						
						try{
							var dados = JSON.parse(data)
							remedios = $.map(dados, function(value, index) {
								return [value];
								
							});
							
						}catch(ex){
						//	alert(ex.message)	
						}
						
						if (remedios.length == 0){
							var html = '<li class="itRemedios" style="padding-left: 8px;"><p class="wrap1">Nenhum resultado encontrado.</p></li>';
							$('#listview').append(html);
							$("#listview").listview("refresh");
							$('.aguarde').remove();	
							return; 
						}
						for (var i=0;i<remedios.length -1;i++){
							
							
							var html = '<li class="itRemedios" style="padding-left: 8px;"><p id ="p' + i + '"  class="wrap1" ng-model="nome">' + remedios[i].nome + '</p><p id ="d' + i + '" class="wrap2">' + remedios[i].bula + '</p><p class="wrap2">' + remedios[i].dosagem + '</p><a id ="' + i + '" class="wrap4 ui-btn" href="#" ng-click="adicionarLista($event)">Adicionar a lista</a></li>';
							//$('#listview').append(html);
							//$("#listview").listview("refresh");
							var temp = $compile(html)($scope);
							angular.element(document.getElementById('listview')).append(temp);
						}
						$('.aguarde').remove();		
						$("#listview").listview("refresh");
					 }
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







