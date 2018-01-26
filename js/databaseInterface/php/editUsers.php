<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $users = $_POST['id'];
    
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
        //echo json_encode($m);
        // updateUser($user_id, $role_id, $user_name, $user_password, $full_name, $email)
		//$result = $taxonomy_database->loginUserReturningUserInfo($user['user_name'], $user['password']);
		//updateUserRole($user_id, $role_id)
		foreach($users as $user)
		{
			$result = $taxonomy_database->updateUserRole($user['user_id'], $user['role_id']);
			if($user['user_groups'])
				$result2 = $taxonomy_database->updateUserGroups($user['user_id'], $user['user_groups']);
			else
				$result2 = $taxonomy_database->updateUserGroups($user['user_id'], []);
		}
        echo $result + $result2;

    }

?>