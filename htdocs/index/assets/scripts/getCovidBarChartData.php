<?php
	$host = "host = 127.0.0.1";
    $port = "port = 5432";
    $dbname = "dbname = postgres";
    $credentials = "user = postgres password = password";

    $db = pg_connect("$host $port $dbname $credentials");

    $sql = "SELECT CONCAT('Date(', EXTRACT(YEAR FROM covid_date), ', ', EXTRACT(MONTH FROM covid_date) - 1, ', ', EXTRACT(DAY FROM covid_date), ')'), daily_cases FROM daily_cases;";

    $ret = pg_query($db, $sql);
    if(!$ret) {
        echo pg_last_error($db);
        exit;
    } 
    
    $json = "{ \"cols\": [ {\"id\":\"\",\"label\":\"Month\",\"pattern\":\"\",\"type\":\"date\"}, {\"id\":\"\",\"label\":\"Daily Number of Coronavirus Cases\",\"pattern\":\"\",\"type\":\"number\"} ], \"rows\": [ ";

	$numResults = pg_num_rows($ret);
	$counter = 0;
    while($row = pg_fetch_row($ret)) {
		if (++$counter == $numResults) {
            $json .= "{\"c\":[{\"v\":\"$row[0]\",\"f\":null},{\"v\":\"$row[1]\",\"f\":null}]}";
		} else {
            $json .= "{\"c\":[{\"v\":\"$row[0]\",\"f\":null},{\"v\":\"$row[1]\",\"f\":null}]},";
		}
    }

    $json .= " ] }";
    echo $json;
    pg_close($db);
?>