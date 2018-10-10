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
	//echo $param;
	$param = explode(";",$param);
	
	$farmacia = $data->farmacia;
//	echo $farmacia;
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
	
	
	// obter id da farmacia escolhida
	$sql = "select site_id from wp_farmacias  where nome = '" . $farmacia . "'" ; 
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		
		while($res = $result->fetch_assoc()) {
			$site_id = $res["site_id"];
			
		}
		
	}
	$conn->close();

	//inserir pedido
	mysqli_set_charset($conn2,"utf8");
	$sql = "insert into wp_" . 	$site_id . "_posts (post_date,post_date_gmt,post_modified,post_modified_gmt,post_status,post_title,ping_status,post_type,post_content,post_excerpt,to_ping,pinged,post_content_filtered) values (CURRENT_DATE(),CURRENT_DATE(),CURRENT_DATE(),CURRENT_DATE(),'wc-completed','Pedido via app Remedin','closed','shop_order','','','','','')";
	if ($conn2->query($sql) === TRUE) {
		$last_id = $conn2->insert_id;
	}
	
	//trocar esse for uma query no banco para pegar o preco do remedio
	for ($x = 0; $x <= sizeof($param) -1; $x++) {
			
			$item = explode(",",$param[$x]);
			$sql = "INSERT INTO wp_" . 	$site_id . "_woocommerce_order_items (order_item_name,order_item_type,order_id) VALUES ('$item[0]','line_item','$last_id')";
			if ($conn2->query($sql) === TRUE) {
				$item_id = $conn2->insert_id;
			}
			$produto_id = 20;
			$total = $item[3] * $item[1];
			
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_qty','$item[1]')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_tax_class','')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_product_id','$produto_id')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_variation_id','')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_line_subtotal','$item[3]')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_line_subtotal_tax','')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_line_total','$total')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) VALUES ('$item_id','_line_tax','')";
			$q=mysqli_query($conn2,$sql);
		
			$sql ="INSERT INTO wp_" . 	$site_id . "_postmeta (post_id,meta_key,meta_value) VALUES ('$last_id','_order_total','$total')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_postmeta (post_id,meta_key,meta_value) VALUES ('$last_id','_shipping_postcode','Rua gogo da ema 34')";
			$q=mysqli_query($conn2,$sql);
		
			$sql ="INSERT INTO wp_" . 	$site_id . "_postmeta (post_id,meta_key,meta_value) VALUES ('$last_id','_billing_phone','3232-3232')";
			$q=mysqli_query($conn2,$sql);
			$sql ="INSERT INTO wp_" . 	$site_id . "_postmeta (post_id,meta_key,meta_value) VALUES ('$last_id','_billing_email','anaxavier26@gmail.com')";
			$q=mysqli_query($conn2,$sql);
							
	}
	
	$conn2->close();
	echo 'foi';
	//inserir itens do pedidmeta
	
	 	  
?>				
		
