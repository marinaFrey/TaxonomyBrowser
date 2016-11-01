<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $user = $_POST['id'];
    
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
        //echo json_encode($m);
        // updateUser($user_id, $role_id, $user_name, $user_password, $full_name, $email)
		$result = $taxonomy_database->loginUserReturningUserInfo($user['user_name'], $user['password']);
		if($result)
		{
			$result = $taxonomy_database->updateUser($user['id'], $user['role'], $user['user_name'], $user['password'], $user['full_name'], $user['email']);
			
			echo $result;
		}
		else
		{
			echo "phodeu";
		}
        //echo $result;

    }

?>