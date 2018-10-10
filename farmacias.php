<?php
 if(isset($_POST['select'])){
			
	header("Content-Type: text/html; charset=UTF-8",true);
	header("Access-Control-Allow-Origin: *");


	$farmacia = array('farmacia' => array(
								
				));
								
	$servername = "localhost";
	$username = "wpuser_remedin";
	$password = "tanarede";
	$dbname = "wpdb_remedin"; 
			
			
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
    $cep1 = $_POST['cep'];
	$cep2 = $_POST['cep'] + 3;	
	$sql = "select * from wp_farmacias where cep >='" . $cep1 . "' and cep <= '" . $cep2 . "' order by cep limit 20"; 
	//echo $sql;
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		
		while($res = $result->fetch_assoc()) {
			
			$nome = ($res['nome']);
			$endereco = ($res['endereco']);
			$numero = ($res['numero']);
			$complemento = ($res['complemento']);
			$bairro = ($res['bairro']);
			$cidade = ($res['cidade']);
			$estado = ($res['estado']);
			$telefone = ($res['telefone1']);
			$lat = ($res['latitude']);
			$long = ($res['longitude']);
			$cep = ($res['cep']);
			$farmacia[] = array('nome' => $nome,'endereco' => $endereco, 'numero' => $numero,'complemento' => $complemento,'bairro' => $bairro, 'cidade' => $cidade,'estado' => $estado,'telefone' => $telefone, 'lat' => $lat, 'long' => $long, 'distancia' => '','cep' => $cep );
					
		}
		echo json_encode($farmacia,JSON_UNESCAPED_UNICODE);	
		//echo $sql;
		//echo $farmacia[0].bairro;
	}

	/* function calcDistancia($lat1, $long1, $lat2, $long2)
	{
		
		$d2r = 0.017453292519943295769236;

		$dlong = ($long2 - $long1) * $d2r;
		$dlat = ($lat2 - $lat1) * $d2r;

		$temp_sin = sin($dlat/2.0);
		$temp_cos = cos($lat1 * $d2r);
		$temp_sin2 = sin($dlong/2.0);
		
		$a = ($temp_sin * $temp_sin) + ($temp_cos * $temp_cos) * ($temp_sin2 * $temp_sin2);
		$c = 2.0 * atan2(sqrt($a), sqrt(1.0 - $a));
		
		echo (6368.1 * $c) * 3;
	}
	
	
	calcDistancia(-22.936009, -43.244067, -22.972563,-43.396806); */
	
 }	 	  
?>				
		
