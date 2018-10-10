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
	$param = $data->lista;
	$param = explode(";",$param);
	$lista = array('lista' => array(
								
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

	$conn2 = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn2->connect_error) {
		die("Connection failed: " . $conn2->connect_error);
	}
	
			
	$sql = "select blog_id,nome from wp_blogs b inner join wp_farmacias f on blog_id = f.site_id where blog_id <> 1"; 
	//echo $sql;
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		
		while($res = $result->fetch_assoc()) {
			for ($x = 0; $x <= sizeof($param); $x++) {
				$item = explode(",",$param[$x]);
					//ENTRA AQUI A QUERY BUSCANDO CADA PRODUTO: RESULTADDO (NOME FARMACIA, ENDERECO, TOTAL )
				$sql2 = "select pm.meta_value * " . $item[1] . "  as preco  from wp_" . $res['blog_id'] . "_posts p" .
				" inner join wp_" . $res['blog_id'] . "_postmeta pm on p.id = pm.post_id and pm.meta_key = '_sale_price'" . 
				" inner join wp_" . $res['blog_id'] . "_postmeta pe on p.id = pe.post_id and pe.meta_key = '_stock'" .
				" where post_title = '" . $item[0] . "' and post_content = '" . $item[2] ."'";
				
				$result2 = $conn2->query($sql2);
		//		echo $sql2;
				if ($result2->num_rows > 0) {
					while($res2 = $result2->fetch_assoc()) {
				
						$lista[] = array('nome' => $res["nome"],'total' => number_format(utf8_encode($res2['preco']),2,',','.'));
				
				
					}
				
				}
				
			}
			
					
		}
		
		echo json_encode($lista,JSON_UNESCAPED_UNICODE);	
	}			
	 	  
?>				
		
