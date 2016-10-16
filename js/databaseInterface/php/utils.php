<?php
//------------------------------------------------------------------------------
// Denison Linus (C) 2009-2010 - dlmtavar@gmail.com
//------------------------------------------------------------------------------
include 'bibtex2html.php';
//include 'Task.php';
//include 'DataFormat.php';

// Extensões
//require_once("Mail.php");
//require_once("Mail/mime.php");

//------------------------------------------------------------------------------
// TaxonomyBrowser Utils
//------------------------------------------------------------------------------
define("__STR_MAX", "100");
define("__ERROR_MESSSAGE_01", "Fix the following problems");
define("__INPUT_MULTIPLE_LINES_SIZE", 15);
define('__GOOGLE_MAPS_API_KEY',       'ABQIAAAA7kCtS9l7tpRW6YgknRBO_xRyO8O1yK-uuyR5sMm1nzfTVF_94BRo8cjmvzH2txA3OOvEF0E2lC6qbA');
define('__GOOGLE_AJAX_SEARCH_API_KEY','ABQIAAAA7kCtS9l7tpRW6YgknRBO_xRyO8O1yK-uuyR5sMm1nzfTVF_94BRo8cjmvzH2txA3OOvEF0E2lC6qbA');
define('__DEFAULT_LATITUDE_LONGITUDE',"['-32.1916667','-52.1583333']");
define('__DEFAULT_ZOOM','12');
//define('__NAVBAR_HEIGHT','500');
//define('__COOKIE_NAVBAR_SCROLLBAR_NAME', __APP_NAME.'_NavBar_ScrollBar');
//define('__COOKIE_SCROLLBAR_NAME', __APP_NAME.'_ScrollBar');
//------------------------------------------------------------------------------

function sendEmail($to,$subject,$body)
{

//parei aqui!!!
//print_r($body);
	return false;

	$from = "Taxonomy Browser";
	$host = "smtp.gmail.com";
	$username = "";
	$password = "";

	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject, 'Content-Type' => 'text/html');
			
	$smtp = Mail::factory('smtp',array ('host' => $host,'auth' => true,'username' => $username,'password' => $password));

	$mail = $smtp->send($to, $headers, $body);

	if (PEAR::isError($mail)) {
		//print($smtp->getMessage());
		return false;
	} else {
		return true;
	}
}
//------------------------------------------------------------------------------
function createPassword($length)
{
	$chars = "1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$i = 0;
	$password = "";
	while ($i <= $length)
	{
		$password .= $chars{mt_rand(0,strlen($chars)-1)};
		$i++;
	}
	return $password;
}
//------------------------------------------------------------------------------
function debugPrint($value)
{
	echo '<pre>';
	print_r($value);
	echo  '</pre>';    
}
//------------------------------------------------------------------------------
/*
function clearAllScrollBarCookies()
{
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'taxonomy');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'specimens');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'characters');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'units');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'bibliography');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'users');
	setcookie(__COOKIE_NAVBAR_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'analysis');
	
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'taxonomy');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'specimens');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'characters');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'units');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'bibliography');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'users');
	setcookie(__COOKIE_SCROLLBAR_NAME, 0, 0, '/'.__APP_NAME.'/'.'analysis');
}*/
//------------------------------------------------------------------------------
function checkIfCharacterGroupIsNone($group)
{
	return ($group['character_group_id'] == '1' && $group['character_group_name'] == 'none');
}
//------------------------------------------------------------------------------
function isfirefox() 
{
	$agent = '';
	// old php user agent can be found here
	if (!empty($HTTP_USER_AGENT))
	{
		$agent = $HTTP_USER_AGENT;
	}
	// newer versions of php do have useragent here.
	if (empty($agent) && !empty($_SERVER["HTTP_USER_AGENT"]))
	{
		$agent = $_SERVER["HTTP_USER_AGENT"];
	}
	if (!empty($agent) && preg_match("/firefox/si", $agent))
	{
		return true;
	}
	return false;
}
//------------------------------------------------------------------------------
function md5Salt()
{
	return "mOKYipPgbGUYMFSM9183rcVw0rsqdWk5";
}
//------------------------------------------------------------------------------
function mysqlDateStringToDayMonthYear($date, &$year, &$month, &$day)
{
	$date_array = date_parse($date);
	$day = $date_array['day'];
	$month = $date_array['month'];
	$year = $date_array['year'];
}
//------------------------------------------------------------------------------
function dayMonthYearToMysqlDate($year, $month, $day)
{
	return $year.'-'.$month.'-'.$day.' 00:00:00';
}
//------------------------------------------------------------------------------
function checkIfDateIsValid($value, $format = 'dd/mm/yyyy')
{
    if(strlen($value) >= 6 && strlen($format) == 10)
	{ 
        
        // find separator. Remove all other characters from $format 
        $separator_only = str_replace(array('m','d','y'),'', $format); 
        $separator = $separator_only[0]; // separator is first character 
        
        if($separator && strlen($separator_only) == 2)
		{ 
            // make regex 
            $regexp = str_replace('mm', '(0?[1-9]|1[0-2])', $format); 
            $regexp = str_replace('dd', '(0?[1-9]|[1-2][0-9]|3[0-1])', $regexp); 
            $regexp = str_replace('yyyy', '(19|20)?[0-9][0-9]', $regexp); 
            $regexp = str_replace($separator, "\\" . $separator, $regexp); 
            if($regexp != $value && preg_match('/'.$regexp.'\z/', $value)){ 

                // check date 
                $arr=explode($separator,$value); 
                $day=$arr[0]; 
                $month=$arr[1]; 
                $year=$arr[2]; 
                if(@checkdate($month, $day, $year)) 
                    return true; 
            } 
        } 
    } 
    return false; 
}
//------------------------------------------------------------------------------
function checkIfTimeIsValid($value)
{
	
	$date_array = date_parse("2000-01-01 ".$value);
	
	$hour = $date_array['hour'];
	$minute = $date_array['minute'];
	$second = $date_array['second'];
	$fraction = $date_array['fraction'];

	//print_r($fraction);
	
	return $date_array['error_count'] == 0 && ($hour > -1 && $hour < 24 && $minute > -1 && $minute < 60 && $second > -1 && $second < 60);
	
}
//------------------------------------------------------------------------------
function checkIfDateTimeIsValid($value)
{
	
	$separator = ' ';
	$arr = explode($separator, $value); 
	
	return (count($arr) == 2) && checkIfDateIsValid($arr[0]) && checkIfTimeIsValid($arr[1]);
	
}
//------------------------------------------------------------------------------
function parseChactersEnums(&$character_enums)
{
	$separator = ',';
	$arr = explode($separator, $character_enums);
	
	return $arr;	
}
//------------------------------------------------------------------------------
function checkIfEnumsIsValid($value)
{
	if(empty($value)) return false;
	
	$arr = parseChactersEnums($value);
	
	foreach($arr as $str)
	{
		if(empty($str))
			return false;
	}
	
	return true;

}
//------------------------------------------------------------------------------
function checkIfEnumIsValid($enum_value, &$character_enums)
{
	
	$arr = parseChactersEnums($character_enums);
	
	
	foreach($arr as $str)
	{
		if($str == $enum_value)
			return true;
	}
	
	return false;
	
}
//------------------------------------------------------------------------------
function printableDate($date)
{
	if(empty($date))
	{
		return '';
	}
	$date_array = date_parse($date);
	$day = $date_array['day'];
	$month = $date_array['month'];
	$year = $date_array['year'];
	$hour = $date_array['hour'];
	$minute = $date_array['minute'];
	$second = $date_array['second'];
	
	if(empty($day) || empty($month) || empty($year))
	{
		return '';
	}
	

	if(empty($hour) || empty($minute) || empty($second))
	{
		return $day.'/'.$month.'/'.$year;
	}
	
	return $day.'/'.$month.'/'.$year.' '.$hour.':'.$minute.':'.$second;
	
}
//------------------------------------------------------------------------------
function stripcomma($string)
{
	$string = str_replace(',', '', $string);
	return $string; 
}
//------------------------------------------------------------------------------
function stripslashesDeep($value)
{
    $value = is_array($value) ? array_map('stripslashesDeep', $value) : stripslashes($value);
    return $value;
}
//------------------------------------------------------------------------------
function isUserAuthenticate()
{
	return isset($_SESSION['user_is_logged_in']) && $_SESSION['user_is_logged_in'] == true;
}
//------------------------------------------------------------------------------
function hasUserPermission($module, $action)
{
	if(!isUserAuthenticate())
	{
		if
		(
		 	(
			//$module == 'homepage' ||
			$module == 'taxonomy' ||
			$module == 'specimens' ||
			$module == 'characters' ||
			$module == 'units' ||
			$module == 'bibliography' ||
			$module == 'analysis' ||
			$module == 'compositeanalysis'
			) &&
			$action == 'view'
		)
		{
			return true;			
		}
	}
	else
	{
	
		$role_id = $_SESSION['user_information']['role_id'];

		//admininstrator
		if($role_id == 1)
			return true;
		
		//level-1
		if($role_id == 2)
		{
			if($module == 'specimens')
			{
				return true;
			}
			else
			{
				if
				(
					(
					//$module == 'homepage' ||
					$module == 'taxonomy' ||
					$module == 'characters' ||
					$module == 'units' ||
					$module == 'bibliography' ||
					$module == 'analysis' ||
					$module == 'compositeanalysis'
					) &&
					$action == 'view'
				)
				{
					return true;			
				}
			}
		}
		
		return false;
	}
	
}
//------------------------------------------------------------------------------
function makeCharacterFieldKey($character_id)
{
	return 'character_id_'.$character_id;
}
//------------------------------------------------------------------------------
function isPhysicalUnitField($character_type_id)
{
	return $character_type_id == 1;
}
//------------------------------------------------------------------------------
function isBooleanField($character_type_id)
{
	return $character_type_id == 5;
}
//------------------------------------------------------------------------------
function isDateField($character_type_id)
{
	return $character_type_id == 6;
}
//------------------------------------------------------------------------------
function isTimeField($character_type_id)
{
	return $character_type_id == 7;
}
//------------------------------------------------------------------------------
function isDateTimeField($character_type_id)
{
	return $character_type_id == 8;
}
//------------------------------------------------------------------------------
function isEnumField($character_type_id)
{
	return $character_type_id == 9;
}
//------------------------------------------------------------------------------
function isFileField($character_type_id)
{
	return $character_type_id == 100 || $character_type_id == 101 || $character_type_id == 102 || $character_type_id == 103;
}
//------------------------------------------------------------------------------
function isImageFile($type)
{
	$img_array = array("image/gif",
					   "image/jpeg",
					   "image/pjpeg",
					   "image/png",
					   "application/x-shockwave-flash",
					   "image/psd",
					   "image/tiff",
					   "image/x-MS-bmp",
					   "image/bmp",
					   "image/x-bmp"
					   );
	
	return in_array($type, $img_array);
}
//------------------------------------------------------------------------------
function isTextFile($type)
{
	$txt_array = array("text/txt",
					   "text/doc",
					   "text/pdf",
					   "text/plain",
					   "application/postscript",
					   "application/msword",
					   "application/rtf",
					   "text/html",
					   "application/x-starwriter",
					   "application/vnd.stardivision.writer",
					   "application/vnd.sun.xml.writerv",
					   "application/vnd.oasis.opendocument.text "
					);
	
	return in_array($type, $txt_array);
}
//------------------------------------------------------------------------------
function isSoundFile($type)
{
	$snd_array = array("audio/mpeg", 
					   "audio/mp3",
					   "audio/x-mp3",
					   "audio/x-mpeg-3",
					   "audio/mpeg-3",
					   "audio/x-flac",
					   "audio/wave",
					   "audio/x-ms-wma",
					   "audio/mpeg3",
					   "audio/x-mpeg3",
					   "audio/mpeg",
					   "audio/x-mpeg",
					   "audio/wav",
					   "audio/x-wav",
					   "audio/midi",
					   "audio/x-midi",
					   "audio/x-ms-wma",
					   "audio/x-ms-cera",
					   );
	
	return in_array($type, $snd_array);
}
//------------------------------------------------------------------------------
function isVideoFile($type)
{
	$snd_array = array("video/quicktime",
						"video/x-quicktime",
						"video/mpeg",
						"video/x-mpeg",
						"video/sgi-movie",
						"video/x-sgi-movie",
						"video/msvideo",
						"video/x-msvideo",
						"application/x-shockwave-flash",
						"video/x-ms-asf",
						"video/x-ms-asf",
						"video/x-ms-wvx",
						"video/x-ms-wm",
						"video/x-ms-wmx",
						"video/x-ms-wmv"
					   );
	return in_array($type, $snd_array);
}
//------------------------------------------------------------------------------
function maxFileSizeInBytes()
{
	//10 Mb
	return 10 * 1024 * 1024;
}
//------------------------------------------------------------------------------
function maxMultiMediaFileSizeInBytes()
{
	//128 Mb
	return 128 * 1024 * 1024;
}
//------------------------------------------------------------------------------
function clearNavigationBar(&$navigation_bar)
{
	//print_r($navigation_bar);
	foreach($navigation_bar as $navigation_bar_items_key => $navigation_bar_items)
	{
		if(empty($navigation_bar[$navigation_bar_items_key]['values']))
		{
			unset($navigation_bar[$navigation_bar_items_key]);
		}
	}
}
//------------------------------------------------------------------------------
function mysql_evaluate($query, $default_value="undefined")
{
    $result = mysql_query($query);
    if(mysql_num_rows($result)==0)
	{
        return $default_value;
	}
    else
	{
        return mysql_result($result,0);
	}
}
//------------------------------------------------------------------------------
function makeMenu()
{
	$menu = array();

	//$menu[] = array('homepage', __SITE_URL);

	if(hasUserPermission('taxonomy', 'view'))
	{
		$menu[] = array('taxonomy', __SITE_URL.'/taxonomy');
	}
	if(hasUserPermission('specimens', 'view'))
	{
		$menu[] = array('specimens', __SITE_URL.'/specimens');
	}
	if(hasUserPermission('analysis', 'view'))
	{
		$menu[] = array('analysis', __SITE_URL.'/analysis');
	}
	if(hasUserPermission('compositeanalysis', 'view'))
	{
		$menu[] = array('composite analysis', __SITE_URL.'/compositeanalysis');
	}

	if(hasUserPermission('characters', 'view'))
	{
		$menu[] = array('characters', __SITE_URL.'/characters');
	}
	if(hasUserPermission('units', 'view'))
	{
		$menu[] = array('units', __SITE_URL.'/units');
	}
	if(hasUserPermission('bibliography', 'view'))
	{
		$menu[] = array('bibliography', __SITE_URL.'/bibliography');
	}
	if(hasUserPermission('users', 'view'))
	{
		$menu[] = array('users', __SITE_URL.'/users');
	}

	if(isUserAuthenticate())
	{
		$menu[] = array('logout', __SITE_URL.'/logout');
	}
	else
	{
		$menu[] = array('login', __SITE_URL.'/login');
	}
	
	return $menu;
}
//------------------------------------------------------------------------------
function limit_characters(&$str, $n = __STR_MAX)
{
	//return $str;
	$tmp = $str;
	
	if(strlen($tmp) <= $n)
	{
		return $tmp;
	}
	else
	{
		return substr( html_entity_decode($tmp), 0 , $n).'...';
	}
}
//------------------------------------------------------------------------------
function is_valid_email($email)
{
	//return preg_match("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email);
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Gera Graficos Parallel
//------------------------------------------------------------------------------
function analysisGeraGraficoCharts($table)
{
	header('Content-type: text/html; charset=utf-8');
	
	/*if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}*/
	
	$out = '<html>
    <head>
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript" src="http://parallel-coordinates.googlecode.com/svn/trunk/parallelC.js"></script>
    <script type="text/javascript">
      google.load("visualization", "1");
      
      // Set callback to run when API is loaded
      google.setOnLoadCallback(drawVisualization); 

      // Called when the Visualization API is loaded.
      function drawVisualization() {
        
        // Create and populate a data table.
        var data = new google.visualization.DataTable();
	';
	
	$cont_lin = -1;
	$cont_col = 0;
	
	$nro_linhas = count($table,0);
	$nro_linhas = $nro_linhas - 1;
	
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$T = str_replace(',', '.', $col);
				
				if ($cont_lin < 0)
				{
					if ($cont_col < 1)
					{
						$out .= "data.addColumn('string'," . "'". $T ."');  ";
					}
					else
					{
						$out .= "data.addColumn('number'," . "'". $T ."');  ";
					}
					$cont_col = $cont_col+1;
				} 
				else
				{
					if ($cont_col < 1)
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .',"'. $T .'");';
					}
					else
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					$cont_col = $cont_col+1;
				}
			}
			if ($cont_lin < 0)
			{
				$out .= 'data.addRows(' . $nro_linhas . ');';
			}
			$cont_lin = $cont_lin+1;
			$cont_col = 0;
		}
	}
	
	$out .= '
        var vis = new vizObj.ParallelC(document.getElementById(\'parallelC\'));
        vis.draw(data, {width: 800, height: 600, title: \'Taxonomy\', lineColor:"#2930FF"});
       }
   </script>
  </head>
  <body>
    <div id="parallelC"></div>
  </body>
</html>
';

	
	echo $out;
	
}
//------------------------------------------------------------------------------
// Gera Graficos bio
//------------------------------------------------------------------------------
function analysisGeraGraficoChartsBio($table)
{
	header('Content-type: text/html; charset=utf-8');
	
	/*if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}*/
	
	$out = '<html>
  <head>
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {});
      google.load("prototype", "1.6");
    </script>
    
    <script type="text/javascript" src="http://systemsbiology-visualizations.googlecode.com/svn/trunk/src/main/js/load.js"></script>
    <script type="text/javascript">
        systemsbiology.load("visualization", "1.0", {packages:["bioheatmap"]});
    </script>

    <script type="text/javascript">
      google.setOnLoadCallback(drawHeatMap);
      function drawHeatMap() {
          var data = new google.visualization.DataTable();';
	
	$cont_lin = -1;
	$cont_col = 0;
	
	$nro_linhas = count($table,0);
	$nro_linhas = $nro_linhas - 1;
	
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$T = str_replace(',', '.', $col);
				
				if ($cont_lin < 0)
				{
					if ($cont_col < 1)
					{
						$out .= "data.addColumn('string'," . "'". $T ."');  ";
					}
					else
					{
						$out .= "data.addColumn('number'," . "'". $T ."');  ";
					}
					$cont_col = $cont_col+1;
				} 
				else
				{
					if ($cont_col < 1)
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .',"'. $T .'");';
					}
					else
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					$cont_col = $cont_col+1;
				}
			}
			if ($cont_lin < 0)
			{
				$out .= 'data.addRows(' . $nro_linhas . ');';
			}
			$cont_lin = $cont_lin+1;
			$cont_col = 0;
		}
	}
	
	$out .= '
        heatmap = new org.systemsbiology.visualization.BioHeatMap(document.getElementById(\'heatmapContainer\'));
          heatmap.draw(data, {});
      }
    </script>
  </head>

  <body>
    <div id="heatmapContainer"></div>
  </body>
</html>';

	echo $out;
	
}
//------------------------------------------------------------------------------
// Gera Graficos Parallel
//------------------------------------------------------------------------------
function analysisGeraGraficoChartsBar($table)
{
	header('Content-type: text/html; charset=utf-8');
	
	/*if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}*/
	
	$out = '<html>
    <head>
	<script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["imagebarchart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = new google.visualization.DataTable();
	';
	
	$cont_lin = -1;
	$cont_col = 0;
	
	$nro_linhas = count($table,0);
	$nro_linhas = $nro_linhas - 1;
	
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$T = str_replace(',', '.', $col);
				
				if ($cont_lin < 0)
				{
					if ($cont_col < 1)
					{
						$out .= "data.addColumn('string'," . "'". $T ."');  ";
					}
					else
					{
						$out .= "data.addColumn('number'," . "'". $T ."');  ";
					}
					$cont_col = $cont_col+1;
				} 
				else
				{
					if ($cont_col < 1)
					{
						$out .= 'data.setValue(' . $cont_lin .','. $cont_col .',"'. $T .'");';
					}
					else
					{
						$out .= 'data.setValue(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					$cont_col = $cont_col+1;
				}
			}
			if ($cont_lin < 0)
			{
				$out .= 'data.addRows(' . $nro_linhas . ');';
			}
			$cont_lin = $cont_lin+1;
			$cont_col = 0;
		}
	}
	
	$out .= '
		var chart = new google.visualization.ImageBarChart(document.getElementById(\'chart_div\'));
        chart.draw(data, {width: 400, height: 240, min: 0});
       }
   </script>
  </head>
  <body>
    <div id="chart_div"></div>
  </body>
</html>
';
	echo $out;
	
}

//------------------------------------------------------------------------------
// Analysis Controler: Gera Graficos magic table
//------------------------------------------------------------------------------
function analysisGeraMagicTable($table)
{
	header('Content-type: text/html; charset=utf-8');
	
/*	if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}
	*/
	
	$out = '<html>
  <head>
  <script type="text/javascript" 
    src=\'http://magic-table.googlecode.com/svn/trunk/magic-table/javascript/magic_table.js\'></script>
  <script type="text/javascript" src="http://www.google.com/jsapi"></script>
	    
  <script type="text/javascript">
    google.load("visualization", "1");
    google.setOnLoadCallback(drawVisualization);
	
    function drawVisualization()
	{
          var data = new google.visualization.DataTable();';
	
	$cont_lin = -1;
	$cont_col = 0;
	
	$nro_linhas = count($table,0);
	$nro_linhas = $nro_linhas - 1;
	
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$T = str_replace(',', '.', $col);
				
				if ($cont_lin < 0)
				{
					
						$out .= "data.addColumn('number'," . "'". $T ."');  ";
					
					$cont_col = $cont_col+1;
				} 
				else
				{
					if ($cont_col < 1)
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					else
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					$cont_col = $cont_col+1;
				}
			}
			if ($cont_lin < 0)
			{
				$out .= 'data.addRows(' . $nro_linhas . ');';
			}
			$cont_lin = $cont_lin+1;
			$cont_col = 0;
		}
	}
	
	$out .= '
              var vis = new greg.ross.visualisation.MagicTable(document.getElementById(\'chart_div\'));

      options = {};
      options.tableTitle = "Taxonomy Browser";
      options.enableFisheye = true;
      options.enableBarFill = true;
      options.defaultRowHeight = 25;
      options.columnWidths = [{column : 0, width : 130}];
      options.defaultColumnWidth = 60;
      options.rowHeaderCount = 0;
      options.columnHeaderCount = 0;
      options.tablePositionX = 0;
      options.tablePositionY = 0;
      options.tableHeight = 403;
      options.tableWidth = 315;
      options.colourRamp = getColourRamp();

      vis.draw(data, options);
  }
  
  function getColourRamp()
  {
      var colour1 = {red:0, green:0, blue:255};
      var colour2 = {red:0, green:255, blue:255};
      var colour3 = {red:0, green:255, blue:0};
      var colour4 = {red:255, green:255, blue:0};
      var colour5 = {red:255, green:0, blue:0};
      return [colour1, colour2, colour3, colour4, colour5];
  }
	
  </script>
		
  </head>
  <body>
    <div id="chart_div"></div>
  </body>
</html>';

	echo $out;
	
}

//------------------------------------------------------------------------------
// Gera TAble
//------------------------------------------------------------------------------
function analysisGeraTable($table)
{
	header('Content-type: text/html; charset=utf-8');
	
/*	if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}
	*/
	
	$out = '<html>
  <head>
    <script type=\'text/javascript\' src=\'http://www.google.com/jsapi\'></script>
    <script type=\'text/javascript\'>
      google.load(\'visualization\', \'1\', {packages:[\'table\']});
      google.setOnLoadCallback(drawTable);
      function drawTable() {
        var data = new google.visualization.DataTable();
	';
	
	$cont_lin = -1;
	$cont_col = 0;
	
	$nro_linhas = count($table,0);
	$nro_linhas = $nro_linhas - 1;
	
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$T = str_replace(',', '.', $col);
				
				if ($cont_lin < 0)
				{
					if ($cont_col < 1)
					{
						$out .= "data.addColumn('string'," . "'". $T ."');  ";
					}
					else
					{
						$out .= "data.addColumn('number'," . "'". $T ."');  ";
					}
					$cont_col = $cont_col+1;
				} 
				else
				{
					if ($cont_col < 1)
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .',"'. $T .'");';
					}
					else
					{
						$out .= 'data.setCell(' . $cont_lin .','. $cont_col .','. $T .');';
					}
					$cont_col = $cont_col+1;
				}
			}
			if ($cont_lin < 0)
			{
				$out .= 'data.addRows(' . $nro_linhas . ');';
			}
			$cont_lin = $cont_lin+1;
			$cont_col = 0;
		}
	}
	
	$out .= '
        var table = new google.visualization.Table(document.getElementById(\'table_div\'));
        table.draw(data, {showRowNumber: true});
      }
    </script>
  </head>

  <body>
    <div id=\'table_div\'></div>
  </body>
</html>
';

	
	echo $out;
	
}


//------------------------------------------------------------------------------
// Analysis Run Script
//------------------------------------------------------------------------------
/*
function analysisRunScript($table,$analysis_id)
{
//	require_once "Task.php";
//	require_once "DataFormat.php";
	
//	debugPrint("AQUI RODA O SCRIPT");	
//	var_dump($table);
	
	$nomes = $table[0];
	
	$table = array_slice($table,1);
	//Novo dataformat
	$df = new DataFormat($table);
	//Pega o nome das colunas
	$df->set_names($nomes);
	
	//cria o processo e executa
	$t = new Task("R","--no-save --interactive --quiet");
	$t->run();
	
	//seta o data pra NULL
	$t->send('data <- NULL;');
	
	//constroi o data frame "data"
	for($i = 0; $i < $df->num_lines(); $i++)
	{
		$t->send($df->line($i));
		//debugPrint($df->line($i)."<br>");
	}
	//envia o nome da imagem
	$t->send('session <- "'.$analysis_id.'.png";');
	
	$script_name = $_POST['script_select'];
	//$script_url = __UPLOAD_SCRIPTS_URL.'/'.$script_name;	//caso precise da URL do script
	$script_path = __UPLOAD_SCRIPTS_FILES.'/'.$script_name;
	
	if(file_exists($script_path))
	{
		//$fh = fopen($script_path, 'r');
		//$script_source = fread($fh, filesize($script_path));
		//fclose($fh);			
		
		//carrega o script
		$t->send('source("'.$script_path.'");');			
		$t->stop();
	}
	else
	{
		echo "Erro";
		$t->stop();
	}
	
	
	
	
	//$table é o conteudo selecionado
	//primeira linha eh o cabeçalho
	//restante das linhas sao conteudo
	//if(isset($table) && !empty($table))
	//{
	//	debugPrint($table);
	//}
	
	//aqui pega o script selecionado
	//if(isset($_POST['script_select']))
	//{
		
		
	//}
	
	
	//PARA O VIEW DO RESULTADO DO SCRIPT
	//cuidado com dar print antes de setar o header, pois nao pode mudar o header do http 2 vezes
	//uma vez que da-se um print, o header eh TEXT. portanto o codigo a seguir so funciona se nao tiver nenhum debugPrint ali em cima
	
	//CASO TENHA O BUFFER DA IMAGEM GERADA (so setar o header pra image e dar um print do buffer):
	
	//$my_img = imagecreate( 500, 80 );
	//$background = imagecolorallocate( $my_img, 0, 0, 255 );
	//$text_colour = imagecolorallocate( $my_img, 255, 255, 0 );
	//$line_colour = imagecolorallocate( $my_img, 128, 255, 0 );
	//imagestring( $my_img, 4, 30, 25, "melhor desse jeito, pq nao mexe no sistema de aquivo", $text_colour );
	//imagesetthickness ( $my_img, 5 );
	//imageline( $my_img, 30, 45, 165, 45, $line_colour );
	
	//header( "Content-type: image/png" );
	//imagepng( $my_img );
	//imagecolordeallocate( $line_color );
	//imagecolordeallocate( $text_color );
	//imagecolordeallocate( $background );
	//imagedestroy( $my_img );	
	
	
	
	//CASO TENHA GERADO UMA IMAGEM NO SISTENA DE ARQUIVO (mesmo processo, ler imagem para um buffer, setar o header pra image e dar um print do buffer):
	//nesse caso, fiz pra forçar o download da imagem
	
	$file = __UPLOAD_SCRIPTS_RESULTS_FILES.'/'.$analysis_id.'.png';
	if (file_exists($file))
	{
	
		header('Content-Description: File Transfer');
		//header('Content-Type: application/octet-stream');
		header('Content-Type: application/image-png');
		header('Content-Disposition: attachment; filename='.basename($file));
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
		header('Content-Length: ' . filesize($file));
		
		flush();
		//ob_clean();
		readfile($file);
		return;
	}
	else echo "not";
	
}*/
//------------------------------------------------------------------------------
// Analysis Controler: Analysis Save In File (CSV)
//------------------------------------------------------------------------------
function analysisSaveInCSVFile($table)
{
	header("Content-type: text/plain"); 
	
/*	if(!hasUserPermission('analysis', 'view'))
	{
		return '';
	}
	*/
	$out = '';
	
	if(isset($table) && !empty($table))
	{
		foreach($table as $line)
		{
			foreach($line as $col)
			{
				$out .= '"'.$col.'"';
				$out .= ', ';
			}
			$out .= "\n";
		}
	}
	
	//limpa ultima virgula
	$out = str_replace(", \n", "\n", $out);
		
	echo $out;
	
}


?>
