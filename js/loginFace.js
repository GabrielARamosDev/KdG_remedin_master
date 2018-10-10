	  var timer;
	  var login = function () {
		  try {
			  $('#loading').css("display", "block");
			  $('#btnface').css("display", "none");
			 		 
			  if (window.cordova.platformId == "browser") {
                    var appId = prompt("Enter FB Application ID", "");
					//alert('aqui testando...');
					
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login( ["email"], 
                    function (response) { console.log(JSON.stringify(response.userID)) 
						timer = setInterval(function(){ 
							//alert('testando...');
							apiTest(); 
						}, 9000);
					},
                    function (response) { console.log(JSON.stringify(response.userID)) }); 
		  }catch(ex)
		  {
			  alert(ex.message);
			  window.location.href = "login.html";
		  }
               
        } 
    
	    var apiTest = function () { 
			try {
				//alert('testando 1 ??...');
				facebookConnectPlugin.api( "me/?fields=id,email,first_name,last_name", ["email"],
                    function (response) { 
					//alert('testando??...');
					
					//alert(JSON.stringify(response)) 
					//alert(response.id);
					//alert(response.email);
					//alert(response.first_name);
					//alert(response.last_name);
					clearInterval(timer);
					var usuario = response.first_name + ' ' + response.last_name;
					//alert('Bem Vindo(a) ' + usuario);
				/* 	navigator.notification.alert(
                       "Bem Vindo(a) " + usuario,  // message
                       alertDismissed,         // callback
                       'Login',            // title
                       'OK'                  // buttonName
                       ); */
					alert( "Bem Vindo(a) " + usuario);  
					
					localStorage.setItem("usuario",usuario);
					localStorage.setItem("id",response.id);
					localStorage.setItem("email",response.email);
					localStorage.setItem('tPedido',1);
					//permitirAcesso(response.email);
					window.location.href = "cadastro.html";
					
					},
                    function (response) { console.log(JSON.stringify(response)) }); 
			}catch(ex)
			{
				alert(ex.message);
				window.location.href = "login.html";
			}
                
		}
		
		 function alertDismissed() {
		     // do something
		     //alert('Abrir perfil do profissional');
		 }