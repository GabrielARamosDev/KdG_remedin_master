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

	$farmacias = array('farmacias' => array(
								
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
	
		$sql =  "select distinct sum(r.Med_Pla) as total from wp_remedios r" .
								" left outer join wp_posts p on r.Med_Des = post_title and post_content = r.Med_Apr and post_type = 'product' and post_status = 'publish' ".
								" left outer join wp_postmeta m on p.id = m.post_id and m.meta_key = '_stock' ".
								" left outer join wp_postmeta pm on p.id = pm.post_id and pm.meta_key = '_sale_price'" .
							 	" where Med_Des ='" . $nome . "%' OR Med_Clater like '%" . dosagem . "%'"; 
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
		echo json_encode($farmacias,JSON_UNESCAPED_UNICODE);	
	}			
	 	  
?>				
		
