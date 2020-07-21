<?php
	$host = "host = 127.0.0.1";
    $port = "port = 5432";
    $dbname = "dbname = postgres";
    $credentials = "user = postgres password = password";

    $db = pg_connect("$host $port $dbname $credentials");

    date_default_timezone_set('America/New_York');
    $data_date = date("Y-m-j", strtotime('-1 days'));

    $sql = "SELECT * FROM complete_data WHERE data_date = '$data_date'";
    
    $ret = pg_query($db, $sql);
    $numResults = pg_num_rows($ret);

    if($numResults == 0) {
        date_default_timezone_set('America/New_York');
        $data_date = date("Y-m-j", strtotime('-2 days'));
    
        $sql = "SELECT * FROM complete_data WHERE data_date = '$data_date'";
        
        $ret = pg_query($db, $sql);
        $numResults = pg_num_rows($ret);
    }

    while($row = pg_fetch_row($ret)) {
        $json = array("data_date"=>$row[0], "total_cases"=>$row[1], "new_cases"=>$row[2], "total_deaths"=>$row[3], "new_deaths"=>$row[4]);
    }

    echo json_encode($json);
    pg_close($db);
?>