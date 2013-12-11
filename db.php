<?php
// host, login, password, db
$host = 'localhost';
$login = '2014dsi';
$password = $login;
$db = '2014dsi18';
$dsn = "mysql:host={$host};dbname={$db}";

$db = new PDO($dsn, $login, $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//$stm = $db->query('SELECT * FROM categories');

//while ($row = $stm->fetch(PDO::FETCH_OBJ)) {
//	echo json_encode($row);
//}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	if ($_POST['entity'] == 'categories') {
		echo addCategory($db, $_POST['category']);
	}
}

function addCategory($db, $category) {
	return $db->exec("INSERT INTO categories (name, created_at) VALUES ('{$category}', NOW())");
}
