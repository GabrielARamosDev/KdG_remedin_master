 
var t = [];
var lista = [];
if (localStorage.getItem("lista") !== "" && localStorage.getItem("lista") !== "null"){
	lista = JSON.parse(localStorage.getItem("lista"));
}
var listaF =[];
var farmacias = []
var remedios = [];
var app = angular.module('produtos', []);
	app.controller('ctrlProdutos', function($scope,$http,$compile) {
		//$scope.farmacias = [{ nome:"Viver Mais",endereco:"Rua das FLores, 25 - Centro - Rj",preco: "R$ 32,90"},
		//				   				{ nome:"Remedin Pharma",endereco:"Rua Oito de Dezembro, 77 - Flamengo - Rj",preco: "R$ 47,90"
		//								}];
		
		
		//document.addEventListener("deviceready", onDeviceReady, false)
		$scope.obterDevice= function (){
		try{
					var push = PushNotification.init({
					
					android: {
						senderID: "521237507632"
					},
					browser: {
						pushServiceURL: 'http://push.api.phonegap.com/v1/push'
					},
					ios: {
						alert: "true",
						badge: "true",
						sound: "true"
					},
					windows: {}
					});

					push.on('registration', function(data) {
						
						
						
						if (localStorage.getItem('usuario') != null){
				 
							var regID = data.registrationId;
			
							$http({
								  method: 'POST',
								  url: 'http://remedin.fourtuna.com.br/wp-content/updateid.php',
								  headers: {'Access-Control-Allow-Origin': '*'},
								  //data: {'lista' : lista}
								data: {"nome" : localStorage.getItem('usuario'), "regid" : regID}
							   }).then(function (data){
									console.log('sucesso');
									
							   },function (error){
								//alert('Error: ');
							   });
						 }

											
					});

					push.on('notification', function(data) {
						//alert('oi2');
						//alert(data.message);
						navigator.notification.alert(
							data.message,  // message
							alertDismissed,         // callback
							'Notificação',            // title
							'OK'                  // buttonName
						); 	
						// data.title,
						// data.count,
						// data.sound,
						// data.image,
						// data.additionalData
					});

					push.on('error', function(e) {
						//alert('iiii');
						alert (e.message)
					});
				}catch(ex){
					//alert(ex.message)
				}
		}
			
		
		$scope.buscaini = localStorage.getItem("busca");
		$scope.textobusca = "Buscando por " + $scope.buscaini;
	   	$scope.lista = [];
		$scope.fcompra= "Informe o endereço de entrega:";
		$scope.carregar = function(param){
			var busca = param;
				 
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/busca.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  data: {'busca' : busca}
				   }).then(function (data){
					  	remedios = (data.data);
						if (typeof(remedios) == "string"){
							$scope.remedios = [{ nome:"Remédio não encontrado"}];
							
						}else{
							
							var x = JSON.stringify(remedios);
							remedios = JSON.parse(x.slice(0, -15) + "}")
							$scope.remedios = remedios;
						}
					    
						//$scope.$apply();
						// var dados = JSON.parse(data.data)
						
				   },function (error){
					//alert('Error: ' + data);
				   });
		}
		
		$scope.cadastrarUsuario = function (){
						
				
				if ($('#nome').val() == "" || $('#email').val() =="" ){
					navigator.notification.alert(
							'Favor preencher todos os campos.',  // message
							alertDismissed,         // callback
							'Atenção',            // title
							'OK'                  // buttonName
					); 
					return;
				}
				localStorage.setItem('usuario',$('#nome').val());
				localStorage.setItem('email',$('#email').val());
			
				var dados = $('#nome').val() + ";" + $('#email').val() + ";" +  $('#idface').val();
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/cadastrouser.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  //data: {'lista' : lista}
					  data: {'dados' : dados }
				   }).then(function (data){
							
							
						navigator.notification.alert(
							'Dados salvos com sucesso!',  // message
							alertDismissed,         // callback
							'Cadastro',            // title
							'OK'                  // buttonName
						); 
							if (localStorage.getItem('tPedido') == 1){
								window.location.href = "produtos.html#confirmacao";
								$scope.endereco = localStorage.getItem('endereco');
								//$scope.confirmaPedido();
							}else{
								window.location.href = "produtos.html";
							}
							
						//confirmar se user quer fazer o pedido
		
						
				   },function (error){
					alert('Erro ao realizar o cadastro. ');
				   });
			//}
		}
		
		$scope.carregarOrcamento = function (){
			
			//if ($scope.lista.length > 0){
				lista = $scope.lista;
				var busca = "";
				for (var i=0 ; i<lista.length ; i++){
					busca += lista[i].nome + '|' + lista[i].qtd + '|' + lista[i].dosagem + '|' + lista[i].preco + ';';
				}
				busca = busca.substring(0,busca.length -1)
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/farmacialista.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  //data: {'lista' : lista}
					data: {'lista' : busca}
				   }).then(function (data){
						
						farmacias = (data.data); 
						if (Object.keys(farmacias).length == 1){
							$scope.farmacias = [{ nome:"Nenhuma farmácia encontrada"}];
							var t = setInterval(function() {
								$('.orcamento').css('display','none');
								clearInterval(t);
							 }, 1000);
							
							return;
						}
					
						var x = JSON.stringify(farmacias);
						farmacias = JSON.parse(x.slice(0, -12) + "}")
						var tam = Object.keys(farmacias).length;
					
						l = []
						var aux;
						var total = 0;
											
						for (var i=0;i<tam;i++){ 
							if ( aux == farmacias[i].farmacia) {
								total+=farmacias[i].total;
							}else{
								if (total != 0) l.push({"nome" : aux, "total": total.toFixed(2),"lista" : []});
								aux = farmacias[i].farmacia;
								total=farmacias[i].total;
								
							}
						}
						l.push({"nome" : aux, "total": total.toFixed(2),"lista" : []});
											
						for (var x=0;x<lista.length;x++){
							for (var i=0;i<tam;i++){
								if (farmacias[i].nome == lista[x].nome){
									for (var y=0;y<l.length;y++){
										if (farmacias[i].farmacia == l[y].nome && farmacias[i].dosagem == lista[x].dosagem) l[y].lista.push({"remedio": farmacias[i].nome,"dosagem": farmacias[i].dosagem , "total" : farmacias[i].total.toFixed(2)});
									}
								}
							}
						}
						
						var achou = false;
						for (var x=0;x<lista.length;x++){
							for (var y=0;y<l.length;y++){
								for (var b=0;b<l[y].lista.length;b++){
									if (lista[x].nome == l[y].lista[b].remedio && l[y].lista[b].dosagem == lista[x].dosagem ) achou = true;
								}
								if (!achou){
									l[y].lista.push({"remedio": lista[x].nome,"dosagem": lista[x].dosagem,"total" : "Não disponível"});
								}
								achou = false;
								l[y].lista.sort(function(a,b) {return (a.remedio > b.remedio) ? 1 : ((b.remedio > a.remedio) ? -1 : 0);} );
							}
						}
					
						$scope.farmacias = l;
						//var tam = Object.keys(farmacias).length;
						//var f = [];
						//t = farmacias;
						//var nao_existe = true;
						//for (var i =0; i< tam; i++){
						//	farmacias[i].total = parseFloat(farmacias[i].total.replace(",","."));
							//for (var x =0; x< f.length; x++){
							//	if (f[x].nome == farmacias[i].nome) {
							//		f[x].total += parseFloat(farmacias[i].total);
							//		nao_existe = false;
							//	}
							//}
							
							//if (nao_existe) f.push(farmacias[i]);
							
						//}
						
						//for (var x =0; x< f.length; x++){
						//	f[x].total = f[x].total.toString().replace('.','.');
						//}
					
						console.log('aqui');
						//$scope.farmacias = f;
						
						
				   },function (error){
					//alert('Error: ');
				   });
			//}
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
			if (localStorage.getItem("add") == "true") {
				$('#btnOrcamento').css('visibility','visible');
				if (localStorage.getItem("lista") !== "" && localStorage.getItem("lista") !== "null"){
					$scope.lista = JSON.parse(localStorage.getItem("lista"));
				}
				//$scope.lista = localStorage.getItem("lista") == "" ? [] : JSON.parse(localStorage.getItem("lista"));
			}else{
			
				$('#btnOrcamento').css('visibility','hidden');
			}
			$('a').removeClass('ui-shadow')
				
		});
				
		$scope.adicionarLista = function(event){
			//alert('jj')
						
			//for (var i =0; i< lista.length ; i++){
				 //if (lista[i].nome == $('#p' + event.target.id).html() && lista[i].dosagem == $('#d' + event.target.id).html()) {
					//alert('Este remédio já está na sua lista.');
				//	 return;
				// }
			//}
			
			try {
				if (lista == null) lista = [];
				for (var i =0; i< lista.length ; i++){
					 if (lista[i].nome == $('#p' + event.target.id).html() && lista[i].dosagem == $('#d' + event.target.id).html()) {
						navigator.notification.alert(
							'Esse remédio já está na sua lista.',  // message
							alertDismissed,         // callback
							'Lista',            // title
							'OK'                  // buttonName
						); 
						 return;
					 }
				  }
				
				localStorage.setItem("add","true") 
				$('.listaVazia').css('display','none');
				lista.push({
					'codigo': event.target.id,
					'nome': $('#p' + event.target.id).html(),
					'dosagem': $('#d' + event.target.id).html(),
					'qtd': 1,
					'preco': $('#pr' + event.target.id).html(),
				});
				$scope.lista = lista;
				localStorage.setItem("lista",JSON.stringify(lista));
				//$scope.$apply();
				$("#listaview").listview("refresh");	
				$('#btnOrcamento').css('visibility','visible')
				//alert('Remédio adicionado com sucesso!');
				navigator.notification.alert(
						'Remédio adicionado na lista com sucesso!',  // message
						alertDismissed,         // callback
						'Lista',            // title
						'OK'                  // buttonName
				);  
			}catch(ex){
				alert('erro' + ex.message);
			}
			
												
		}
		
		 $scope.removeItem = function(index){
			$scope.lista.splice(index, 1);
		  }
		 
		 $scope.fazerPedido = function (nome){
			 $scope.irAcompanhamento();
			 $scope.nome = nome;
			 localStorage.setItem('farmacia',nome);
			 //$scope.fcompra = nome + " por favor informe o endereço de entrega!";
			 $scope.fcompra = "Confirmar pedido para farmácia " + nome + "  no endereço abaixo ?";
		 }
		
		
	 $scope.retornarStatusPedido = function (){
			 var tmr = setInterval(function() {
						 
				$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/consultastatus.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  //data: {'lista' : lista}
					  data: {'idpedido' : localStorage.getItem('pedido') , 'farmacia' : localStorage.getItem('farmacia')}
				   }).then(function (data){
						
							
							if (data.data.indexOf("liberado") > -1){
								console.log('iberado display')
								$('.btnLiberado').css('display','block');
								$('#btnPendente').css('display','none');
								clearInterval(tmr);
							}else{
								$('.btnLiberado').css('display','none');
								$('#btnPendente').css('display','block');
							}
								//confirmar se user quer fazer o pedido
		
						
				   },function (error){
					//alert('Erro ao realizar o cadastro. ');
				   });
						 
			 }, 3000);
			
		 }
		 
		 
		$scope.confirmaPedido = function (){
			 if ($('#forma').val() == ""){
				 navigator.notification.alert(
							'Favor preencher forma de pagamento.',  // message
							alertDismissed,         // callback
							'Atenção',            // title
							'OK'                  // buttonName
						); 
				 return;
			 }	
			 lista = $scope.lista;
			 var busca = "";
			 farmacias = JSON.parse(localStorage.getItem('listaPed'));
			 var tam = Object.keys(farmacias).length;
			 for (var i=0;i<tam;i++){
				if (farmacias[i].farmacia ==  localStorage.getItem('farmacia')){
					var preco = farmacias[i].preco;
					busca += farmacias[i].nome + ',' + farmacias[i].qtd + ',' + farmacias[i].dosagem + ',' + preco + ';';
				}
				
			}
			localStorage.setItem('endereco',$('#c_endereco').val()) 
			busca = busca.substring(0,busca.length -1)
			// if (localStorage.getItem('usuario') != null && localStorage.getItem('usuario') != "null") {
				 
				 	$http({
					  method: 'POST',
					  url: 'http://remedin.fourtuna.com.br/wp-content/farmaciaped.php',
					  headers: {'Access-Control-Allow-Origin': '*'},
					  //data: {'lista' : lista}
					data: {'lista' : busca, "farmacia" : localStorage.getItem('farmacia'), "endereco" : localStorage.getItem('endereco'), "email" : localStorage.getItem('email'),"nome" : localStorage.getItem('usuario'), "forma": $('#forma').val(), "troco":  $('#troco').val()}
				   }).then(function (data){
						console.log('sucesso');
						console.log(data.data);
						 localStorage.setItem('pedido',data.data.replace(" ",""))
						window.location.href="produtos.html#acompanhamento";	    
						$scope.endereco = localStorage.getItem('endereco');
						$('#endereco').html('Endereço: ' + localStorage.getItem('endereco'));
						$scope.obterDevice();
						$('.btnLiberado').css('display','none');
						$('#btnPendente').css('display','block');
						lista = [];
						localStorage.setItem('lista','');
						
				
						$scope.retornarStatusPedido();
				   },function (error){
					//alert('Error: ');
				   });
			// }else{
			//	 window.location.href="login.html";
			// }
		 }
		 
		 $scope.atualizaLista = function(index){
			 lista = $scope.lista;
			 localStorage.setItem('lista',JSON.stringify(lista));
			 if ($scope.lista.length  == 0) {
				 localStorage.setItem('lista','');
			 	 localStorage.setItem("add","false");
				 $('#btnOrcamento').css('visibility','hidden');
				 $('.listaVazia').css('display','block');
			  }
			 
		  }
		 
		$scope.irAcompanhamento = function () {
				$('#c_endereco').val(localStorage.getItem('endereco'));
				$('#c_endereco').css('width','95%');
				localStorage.setItem('listaPed',JSON.stringify(farmacias))
				 if (localStorage.getItem('usuario') != null && localStorage.getItem('usuario') != "null") {
					location.href='produtos.html#confirmacao';
				 }else{
					 location.href="login.html";
				 }
		}
		
		$scope.carregarFarmacias = function(){
			
		}
	});
	
	function alertDismissed(){}//location.href='produtos.html#pageone'}
		
 
	function voltarLista(){
		if (localStorage.getItem('listaHome')=="true"){
			location.href='index.html';
		}else
		{
			location.href='produtos.html#pageone';
		}
	}

			
	function onConfirm(buttonIndex) {
			if (buttonIndex == 1){
					localStorage.setItem('usuario',null);
					localStorage.setItem('email',null);
					verificaLogin();
			}
	}
				
	function sair(){
			navigator.notification.confirm(
					'Deseja mesmo sair?', // message
					 onConfirm,            // callback to invoke with index of button pressed
					'Atenção',           // title
					['Sair','Cancelar']     // buttonLabels
			);
	}
					
										
					
					
	function verificaLogin(){
						
			if (localStorage.getItem('usuario') != null && localStorage.getItem('usuario') != "null") {
							$('#aviso').css('display','none');
							$('#botoes').css('display','block');
							
			}else{
							$('#aviso').css('display','block');
							$('#botoes').css('display','none');
							
			}
	}









