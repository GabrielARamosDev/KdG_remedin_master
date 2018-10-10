<?php

 if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
	$data = json_decode(file_get_contents("php://input"));
	$param = $data->busca;

	$catalogo = array('catalogo' => array(
								
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
	
			
	$sql = "select * from wp_remedios where Med_Des like '%" . $param . "%' OR Med_Clater like '%" . $param . "%'"; 
	//echo $sql;
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		
		while($res = $result->fetch_assoc()) {
			
			$nome = utf8_encode($res['Med_Des']);
			$dosagem = utf8_encode($res['Med_Apr']);
			$bula = utf8_encode($res['Med_Clater']);
			$preco = number_format(utf8_encode($res['Med_Pla']),2,',','.');		
			$catalogo[] = array('nome' => $nome,'dosagem' => $dosagem, 'bula' => $bula, 'preco' => 'R$ ' . $preco);
					
		}
		echo json_encode($catalogo,JSON_UNESCAPED_UNICODE);	
	}			
	 	  
?>				
		
