<?php
//------------------------------------------------------------------------------
// Denison Linus (C) 2009-2010 - dlmtavar@gmail.com
//------------------------------------------------------------------------------
// TaxonomyBrowser Model (MYSQL VERSION)
//------------------------------------------------------------------------------

include 'utils.php';

class taxonomybrowser
{
//------------------------------------------------------------------------------
	private $Connection;
	//private static $instances = 0;
//------------------------------------------------------------------------------
// TaxonomyBrowser Model __construct Method
//------------------------------------------------------------------------------
	public function __construct($server, $user, $password, $database)
	{
		$this->Connection = mysql_pconnect($server, $user, $password);
		if(empty($this->Connection))
		{
			throw new web2bbException('Não foi possível conectar na base de dados.');
		}
		if(!mysql_select_db($database, $this->Connection))
		{
			throw new web2bbException('Não foi possível selecionar a base de dados.');
		}
		
		mysql_query("SET NAMES 'utf8'");
		mysql_query('SET character_set_connection=utf8');
		mysql_query('SET character_set_client=utf8');
		mysql_query('SET character_set_results=utf8');
	
		//TaxonomyBrowser::$instances++;
		
		//print_r(TaxonomyBrowser::$instances);
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model __destruct Method
//------------------------------------------------------------------------------
	public function __destruct()
	{
		if(isset($this->Connection))
		{
			mysql_close($this->Connection);
			unset($this->Connection);
		}
		//TaxonomyBrowser::$instances--;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (getSpecimensFromAnalysis)
//------------------------------------------------------------------------------
	private function getSpecimensFromAnalysis(&$Analysis, &$AnalysisFilters)
	{
		$taxonomy_id = $Analysis['taxonomy_id'];

//print_r($taxonomy_id);
		
		$array_out = array();
		
		$empty = true;
		
		if(empty($AnalysisFilters))
		{
			$empty = true;
		}
		else
		{
			$Selects = array();
			
			$size = sizeof($AnalysisFilters);
		
			for($i = 0; $i < $size; $i++)
			{
				$query_i = "SELECT distinct(specimens.specimen_id) FROM taxonomybrowser.specimens, taxonomybrowser.measures WHERE specimens.taxonomy_id = '$taxonomy_id' AND (specimens.latitude IS NOT NULL && specimens.longitude IS NOT NULL) AND specimens.specimen_id = measures.specimen_id AND "; 
				$AnalysisFilter = $AnalysisFilters[$i];
				$character_id = $AnalysisFilter['character_id'];
				$operation_id = $AnalysisFilter['operation_id'];
				$Operation = $this->getOperation($operation_id);
				
				$sql_instruction = 	$Operation['sql_instruction'];
				
				$value1 = 	$AnalysisFilter['value1'];
				$value2 = 	$AnalysisFilter['value2'];
				
				
				//se for falso entao nao precisa pesquisar, pq o field boolean nao vai existir mesmo no banco
				$char = $this->getCharacter($character_id);
				
				//print_r("opa2".$value1.$char['character_type_id'].isBooleanField($char['character_type_id']));
				
				
				/*if(isBooleanField($char['character_type_id']) && $value1 == 'false')
				{
					continue;
				}*/
				
				$mesuresValue = 'measures.value';
				$value1 = "'".$value1."'";
				$value2 = "'".$value2."'";
				
				if(isDateField($char['character_type_id']))
				{
					$mesuresValue = "STR_TO_DATE(measures.value,'%d/%m/%Y')";
					$value1 = "STR_TO_DATE($value1,'%d/%m/%Y')";
					$value2 = "STR_TO_DATE($value2,'%d/%m/%Y')";
				}
				else if(isTimeField($char['character_type_id']))
				{
					$mesuresValue = "STR_TO_DATE(measures.value,'%H:%i:%s.%f')";
					$value1 = "STR_TO_DATE($value1,'%H:%i:%s.%f')";
					$value2 = "STR_TO_DATE($value2,'%H:%i:%s.%f')";
				}
				else if(isDateTimeField($char['character_type_id']))
				{
					$mesuresValue = "STR_TO_DATE(measures.value,'%d/%m/%Y %H:%i:%s.%f')";
					$value1 = "STR_TO_DATE($value1,'%d/%m/%Y %H:%i:%s.%f')";
					$value2 = "STR_TO_DATE($value2,'%d/%m/%Y %H:%i:%s.%f')";
				}				
			
				$query_i .= " ( measures.character_id = '$character_id' AND ";
				
				if($operation_id == 8) //BETWEEN
				{
					$query_i .= "$mesuresValue $sql_instruction $value1 AND $value2";
				}
				else
				{
					$query_i .= "$mesuresValue $sql_instruction $value1";
				}
				
				$query_i .= " ) ";
				
				//print_r($query_i);
				
				$result = mysql_query($query_i, $this->Connection);
				$nodes = array();
				
				for($j = 0; $j < mysql_num_rows($result); $j++)
				{
					$specimen_id = mysql_result($result ,$j, "specimen_id");
					array_push($nodes, $specimen_id);
				}
				
				
				
				array_push($Selects, $nodes);
			}
			
			
			
			if(!empty($Selects))
			{
				
				$empty = false;
				
				$array_out = $Selects[0];
				for($jj = 0; $jj < sizeof($Selects); $jj++)
				{
					$array_out = array_intersect($array_out, $Selects[$jj]);
				}
			}
		}

		
		if($empty)
		{
			$query = "SELECT distinct(specimen_id), taxonomy_id, collection_id, collected_by, collected_data, latitude, longitude, information FROM taxonomybrowser.specimens WHERE taxonomy_id = '$taxonomy_id' and (latitude IS NOT NULL && longitude IS NOT NULL)";

//print_r($query);

			
			$result = mysql_query($query, $this->Connection);
			for($i = 0; $i < mysql_num_rows($result); ++$i)
			{
				$specimen_id = mysql_result($result ,$i, "specimen_id");
				array_push($array_out, $specimen_id);
			}			
		}		
		
		return $array_out;
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model execAnalysis Method
//------------------------------------------------------------------------------
	public function execAnalysis($analysis_id)
	{

		
		$analysis_id = mysql_real_escape_string($analysis_id);
		
		$Analysis = $this->getAnalysis($analysis_id);
		$AnalysisFilters = $this->getAnalysisFilters($analysis_id);
		$Specimens = $this->getSpecimensFromAnalysis($Analysis, $AnalysisFilters);


		
		//print_r($Specimens);
		//return array();
		
		$nodes = array();
		
		foreach($Specimens as $specimen_id)
		{
			//print_r($specimen_id);
			
			$Specimen = $this->getSpecimen($specimen_id);
			
			$tmp = array();
			$tmp['specimen_id'] = $Specimen["specimen_id"];
			$tmp['taxonomy_id'] = $Specimen["taxonomy_id"];
			$tmp['collection_id'] = $Specimen["collection_id"];
			$tmp['collected_by'] = $Specimen["collected_by"];
			$tmp['collected_data'] = $Specimen["collected_data"];
			$tmp['latitude'] = $Specimen["latitude"];
			$tmp['longitude'] = $Specimen["longitude"];
			$tmp['information'] = $Specimen["information"];
			array_push($nodes, $tmp);
		}
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addAnalysis Method
//------------------------------------------------------------------------------
	public function addAnalysis($taxonomy_id, $analysis_name, $analysis_color, $information, $analysisFilters)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$analysis_name = mysql_real_escape_string($analysis_name);
		$analysis_color = mysql_real_escape_string($analysis_color);
		$information = mysql_real_escape_string($information);
		
		$query = "INSERT INTO taxonomybrowser.analysis
		(
			`taxonomy_id` ,
			`analysis_name` ,
			`analysis_color` ,
			`information`
		)
		VALUES
		(
			'$taxonomy_id' ,
			'$analysis_name' ,
			'$analysis_color',
			'$information'
		)";
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}
		
		$analysis_id = mysql_insert_id();
		
		if(!$this->updateAnalysisFilters($analysis_id, $analysisFilters))
			return false;

		return true;
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAllAnalysis Method
//------------------------------------------------------------------------------
	public function getAllAnalysis()
	{
		
		$query = "SELECT analysis_id, taxonomy_id, analysis_name, analysis_color, information FROM taxonomybrowser.analysis";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['analysis_id'] = mysql_result($result ,$i, "analysis_id");
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['analysis_name'] = mysql_result($result ,$i, "analysis_name");
			$tmp['analysis_color'] = mysql_result($result ,$i, "analysis_color");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAnalysis Method
//------------------------------------------------------------------------------
	public function getAnalysis($analysis_id)
	{
		$analysis_id = mysql_real_escape_string($analysis_id);

		$query = "SELECT analysis_id, taxonomy_id, analysis_name, analysis_color, information, overlay_shapes, overlay_convex_hulls FROM taxonomybrowser.analysis WHERE analysis_id = '$analysis_id'";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		
		if(!$result || mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}

		
		$node['analysis_id'] = mysql_result($result, 0, "analysis_id");
		$node['taxonomy_id'] = mysql_result($result, 0, "taxonomy_id");
		$node['analysis_name'] = mysql_result($result, 0, "analysis_name");
		$node['analysis_color'] = mysql_result($result, 0, "analysis_color");
		$node['information'] = mysql_result($result, 0, "information");
		$node['overlay_shapes'] = mysql_result($result, 0, "overlay_shapes");
		$node['overlay_convex_hulls'] = mysql_result($result, 0, "overlay_convex_hulls");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;	
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeAnalysis Method
//------------------------------------------------------------------------------
	public function removeAnalysis($analysis_id)
	{	
	
		$analysis_id = mysql_real_escape_string($analysis_id);

		
		$query = "DELETE FROM taxonomybrowser.analysis WHERE analysis_id = '$analysis_id'";
		$result = mysql_query($query, $this->Connection);
		if(!$result)
		{
			return false;
		}
		
		
		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstAnalysis Method
//------------------------------------------------------------------------------
	public function getFirstAnalysis(&$ok)
	{
		$ok = false;
		//$analysis = $this->getAllAnalysis();
		$node = array();
		
		/*for($i = 0; $i < sizeof($analysis); $i++)
		{
		
			$firstAnalysisId = $analysis[$i]['analysis_id'];
			$query = "SELECT analysis_id, taxonomy_id, analysis_name, analysis_color, information FROM taxonomybrowser.analysis WHERE analysis.analysis_id = '$firstAnalysisId' ORDER BY analysis_name LIMIT 1";
			
		
			$result = mysql_query($query, $this->Connection);
			$node['analysis_id'] = '';
			$node['taxonomy_id'] = '';
			$node['analysis_name'] = '';
			$node['analysis_color'] = '';
			$node['information'] = '';
			
			if(mysql_num_rows($result) == 0)
			{
				mysql_free_result($result);
				continue;
			}
			
			$node['analysis_id'] = mysql_result($result , 0, "analysis_id");
			$node['taxonomy_id'] = mysql_result($result , 0, "taxonomy_id");
			$node['analysis_name'] = mysql_result($result , 0, "analysis_name");
			$node['analysis_color'] = mysql_result($result, 0, "analysis_color");
			$node['information'] = mysql_result($result, 0, "information");
			
			mysql_free_result($result);
			
			$ok = true;
			break;
		}*/
		
		$query = "SELECT analysis_id, taxonomy_id, analysis_name, analysis_color, information FROM taxonomybrowser.analysis ORDER BY analysis_name LIMIT 1";
	
		$result = mysql_query($query, $this->Connection);
		$node['analysis_id'] = '';
		$node['taxonomy_id'] = '';
		$node['analysis_name'] = '';
		$node['analysis_color'] = '';
		$node['information'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}
		
		$node['analysis_id'] = mysql_result($result , 0, "analysis_id");
		$node['taxonomy_id'] = mysql_result($result , 0, "taxonomy_id");
		$node['analysis_name'] = mysql_result($result , 0, "analysis_name");
		$node['analysis_color'] = mysql_result($result, 0, "analysis_color");
		$node['information'] = mysql_result($result, 0, "information");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);
		
		$ok = true;

		return $node;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateAnalysis Method
//------------------------------------------------------------------------------
	public function updateAnalysis($analysis_id, $taxonomy_id, $analysis_name, $analysis_color, $information, $overlay_shapes, $overlay_convex_hulls, $analysisFilters)
	{
		$analysis_id = mysql_real_escape_string($analysis_id);
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$analysis_name = mysql_real_escape_string($analysis_name);
		$analysis_color = mysql_real_escape_string($analysis_color);
		$information = mysql_real_escape_string($information);
		$overlay_shapes = mysql_real_escape_string($overlay_shapes);
		$overlay_convex_hulls = mysql_real_escape_string($overlay_convex_hulls);
		
		//debugPrint($overlay_shapes);
		//debugPrint($overlay_convex_hulls);
		
		
		$query = "UPDATE taxonomybrowser.analysis
		SET taxonomy_id = '$taxonomy_id',
		analysis_name = '$analysis_name',
		analysis_color = '$analysis_color',
		information = '$information',
		overlay_shapes = '$overlay_shapes',
		overlay_convex_hulls = '$overlay_convex_hulls'
		WHERE analysis.analysis_id = '$analysis_id'";
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}
		
		if(!$this->updateAnalysisFilters($analysis_id, $analysisFilters))
			return false;

		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getOperation Method
//------------------------------------------------------------------------------
	public function getOperation($operation_id)
	{
		
		$operation_id = mysql_real_escape_string($operation_id);

		$query = "SELECT operation_id, name, sql_instruction, full_name FROM taxonomybrowser.operations WHERE operation_id = '$operation_id'";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		
		if(!$result || mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}
		
		$node['operation_id'] = mysql_result($result, 0, "operation_id");
		$node['name'] = mysql_result($result, 0, "name");
		$node['sql_instruction'] = mysql_result($result, 0, "sql_instruction");
		$node['full_name'] = mysql_result($result, 0, "full_name");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;			
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getOperations Method
//------------------------------------------------------------------------------
	public function getOperations()
	{
		
		$query = "SELECT operation_id, name, sql_instruction, full_name FROM taxonomybrowser.operations";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['operation_id'] = mysql_result($result ,$i, "operation_id");
			$tmp['name'] = mysql_result($result ,$i, "name");
			$tmp['sql_instruction'] = mysql_result($result ,$i, "sql_instruction");
			$tmp['full_name'] = mysql_result($result ,$i, "full_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAnalysisFilters Method
//------------------------------------------------------------------------------
	public function getAnalysisFilters($analysis_id)
	{
		
		$analysis_id = mysql_real_escape_string($analysis_id);
		$query = "SELECT analysis_filters_id, analysis_id, character_id, operation_id, value1, value2 FROM taxonomybrowser.analysisfilters WHERE analysis_id = '$analysis_id'";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['analysis_filters_id'] = mysql_result($result ,$i, "analysis_filters_id");
			$tmp['analysis_id'] = mysql_result($result ,$i, "analysis_id");
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['operation_id'] = mysql_result($result ,$i, "operation_id");
			$tmp['value1'] = mysql_result($result ,$i, "value1");
			$tmp['value2'] = mysql_result($result ,$i, "value2");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAnalysisFiltersByCharacter Method
//------------------------------------------------------------------------------
	public function getAnalysisFiltersByCharacter($analysis_id, $character_id)
	{
		$analysis_id = mysql_real_escape_string($analysis_id);
		$analysis_id = mysql_real_escape_string($character_id);
		$query = "SELECT analysis_filters_id, analysis_id, character_id, operation_id, value1, unit_id1, value2, unit_id2 FROM taxonomybrowser.analysisfilters WHERE analysis_id = '$analysis_id' AND character_id = '$character_id'";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['analysis_filters_id'] = mysql_result($result ,$i, "analysis_filters_id");
			$tmp['analysis_id'] = mysql_result($result ,$i, "analysis_id");
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['operation_id'] = mysql_result($result ,$i, "operation_id");
			$tmp['value1'] = mysql_result($result ,$i, "value1");
			$tmp['value2'] = mysql_result($result ,$i, "value2");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (updateAnalysisFilters)
//------------------------------------------------------------------------------
	private function updateAnalysisFilters($analysis_id, &$analysisFilters)
	{
		$query = "DELETE FROM taxonomybrowser.analysisfilters WHERE analysis_id = '$analysis_id'";
		$result = mysql_query($query, $this->Connection);
			
		for($i = 0; $i < sizeof($analysisFilters); $i++)
		{
			$character_id = $analysisFilters[$i]['character_id'];
			$operation_id = $analysisFilters[$i]['operation_id'];
			$value1 = $analysisFilters[$i]['value1'];
			$value2 = $analysisFilters[$i]['value2'];
			
			$query = "INSERT INTO taxonomybrowser.analysisfilters (character_id, operation_id, analysis_id, value1, value2) VALUES('$character_id', '$operation_id', '$analysis_id', '$value1', '$value2')";
			
			//print_r($query);
			

			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;
		
	}
	
	
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// AQUI COMEÇA O COMPOSITE ANALYSIS
//------------------------------------------------------------------------------
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function addCompositeAnalysis($composite_analysis_name, $analysisCompositeAnalysis)
	{
		$composite_analysis_name = mysql_real_escape_string($composite_analysis_name);
		
		$query = "INSERT INTO taxonomybrowser.compositeanalysis
		(
			`composite_analysis_id`,
			`composite_analysis_name`
		)
		VALUES
		(
			NULL,
			'$composite_analysis_name'
		)";
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}
		
		$composite_analysis_id = mysql_insert_id();
		
		if(!$this->updateAnalysisCompositeAnalysis($composite_analysis_id, $analysisCompositeAnalysis))
			return false;

		return true;
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAllCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function getAllCompositeAnalysis()
	{
		$query = "SELECT composite_analysis_id, composite_analysis_name FROM taxonomybrowser.compositeanalysis";
		
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['composite_analysis_id'] = mysql_result($result ,$i, "composite_analysis_id");
			$tmp['composite_analysis_name'] = mysql_result($result ,$i, "composite_analysis_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function getCompositeAnalysis($composite_analysis_id)
	{
		$composite_analysis_id = mysql_real_escape_string($composite_analysis_id);

		$query = "SELECT composite_analysis_id, composite_analysis_name FROM taxonomybrowser.compositeanalysis WHERE composite_analysis_id = '$composite_analysis_id'";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		
		if(!$result || mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}

		$node['composite_analysis_id'] = mysql_result($result, 0, "composite_analysis_id");
		$node['composite_analysis_name'] = mysql_result($result, 0, "composite_analysis_name");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;			
	}
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAnalysisIdsByCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function getAnalysisIdsByCompositeAnalysis($composite_analysis_id)
	{
		$composite_analysis_id = mysql_real_escape_string($composite_analysis_id);
		
		$query = "SELECT analysis_id FROM taxonomybrowser.analysiscompositeanalysis WHERE composite_analysis_id = '$composite_analysis_id'";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['analysis_id'] = mysql_result($result ,$i, "analysis_id");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	}	
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function removeCompositeAnalysis($composite_analysis_id)
	{
		$composite_analysis_id = mysql_real_escape_string($composite_analysis_id);

		$query = "DELETE FROM taxonomybrowser.compositeanalysis WHERE composite_analysis_id = '$composite_analysis_id'";
		$result = mysql_query($query, $this->Connection);
		if(!$result)
		{
			return false;
		}
		
		
		return true;		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstCompositeAnalysis Method
//------------------------------------------------------------------------------
	public function getFirstCompositeAnalysis(&$ok)
	{
		$ok = false;
		
		$node = array();
		
		$query = "SELECT composite_analysis_id, composite_analysis_name FROM taxonomybrowser.compositeanalysis ORDER BY composite_analysis_name LIMIT 1";
		
		$result = mysql_query($query, $this->Connection);
		$node['composite_analysis_id'] = '';
		$node['composite_analysis_name'] = '';
				
		if(mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}
		
		$node['composite_analysis_id'] = mysql_result($result , 0, "composite_analysis_id");
		$node['composite_analysis_name'] = mysql_result($result , 0, "composite_analysis_name");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);
		
		$ok = true;

		return $node;		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateAnalysis Method
//------------------------------------------------------------------------------
	public function updateCompositeAnalysis($composite_analysis_id, $composite_analysis_name, $analysisCompositeAnalysis)
	{
		$composite_analysis_id = mysql_real_escape_string($composite_analysis_id);
		$composite_analysis_name = mysql_real_escape_string($composite_analysis_name);
		
		$query = "UPDATE taxonomybrowser.compositeanalysis
		SET composite_analysis_name = '$composite_analysis_name'
		WHERE composite_analysis_id = '$composite_analysis_id'";
		
		//print_r($query);
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}
		
		if(!$this->updateAnalysisCompositeAnalysis($composite_analysis_id, $analysisCompositeAnalysis))
			return false;

		return true;
	}	
	


//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (updateAnalysisCompositeAnalysis)
//------------------------------------------------------------------------------
	private function updateAnalysisCompositeAnalysis($composite_analysis_id, &$analysisCompositeAnalysis)
	{
		#debugPrint($analysisCompositeAnalysis);
		
		$query = "DELETE FROM taxonomybrowser.analysiscompositeanalysis WHERE composite_analysis_id = '$composite_analysis_id'";
		$result = mysql_query($query, $this->Connection);
			
		for($i = 0; $i < sizeof($analysisCompositeAnalysis); $i++)
		{
			//$composite_analysis_id = $analysisCompositeAnalysis[$i]['composite_analysis_id'];
			
			#$analysis_id = $analysisCompositeAnalysis[$i]['analysis_id'];
			$analysis_id = $analysisCompositeAnalysis[$i];
			
			#debugPrint($analysis_id);
			
			$query = "INSERT INTO taxonomybrowser.analysiscompositeanalysis (composite_analysis_id, analysis_id) VALUES('$composite_analysis_id', '$analysis_id')";
			
			#debugPrint($query);

			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;
		
	}	
	
	
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
	
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (updateMeasures)
//------------------------------------------------------------------------------
	private function updateMeasures($specimen_id, &$charactersMeasures)
	{
		$query = "DELETE FROM taxonomybrowser.measures WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
			
		foreach($charactersMeasures as $character_id => $character_measures)
		{
			$character_type_id = $charactersMeasures[$character_id]['character_type_id'];
			$value = '';
			$file_name = '';
			$file_name_full = '';
			$file_type = '';
			$file_size = 0;
			if(isFileField($character_type_id))
			{
				$value = $charactersMeasures[$character_id]['value'];
				$tmp_name = $charactersMeasures[$character_id]['tmp_name'];
				$file_name = uniqid('file_');
				$file_type = $charactersMeasures[$character_id]['type'];
				$file_size = $charactersMeasures[$character_id]['size'];
				$extension = '';
				$path_parts = pathinfo($value);
				$extension = $path_parts['extension'];
				$file_name_full = $file_name.'.'.$extension;
				
				//print_r(__UPLOAD_FILES.'/'.$tmp_name);
				//print_r(__UPLOAD_FILES.'/'.$file_name_full);
				
				//if(!file_exists(__UPLOAD_FILES.'/'.$tmp_name))
				{
					rename(__UPLOAD_FILES.'/'.$tmp_name, __UPLOAD_FILES.'/'.$file_name_full);
				}
				
			}
			else
			{
				$value = $charactersMeasures[$character_id]['value'];
			}
			
			$query = "INSERT INTO taxonomybrowser.measures (character_id, specimen_id, value, file_name, file_type, file_size) VALUES('$character_id', '$specimen_id', '$value', '$file_name_full', '$file_type', '$file_size')";
			
			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (updateExtraTaxonomy)
//------------------------------------------------------------------------------
	private function updateExtraTaxonomy($specimen_id, $extra_taxonomy_ids)
	{
		$query = "DELETE FROM taxonomybrowser.extrataxonomy WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
			
		foreach($extra_taxonomy_ids as $taxonomy_id)
		{
			$query = "INSERT INTO taxonomybrowser.extrataxonomy (specimen_id, taxonomy_id) VALUES('$specimen_id', '$taxonomy_id')";
			
			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getBibliographiesFromSpecimen Method
//------------------------------------------------------------------------------
	public function getExtraTaxonomyFromSpecimen($specimen_id)
	{
		$specimen_id = mysql_real_escape_string($specimen_id);
		
		//taxonomy_id	taxonomy_rank_id	parent_id	scientific_name	information
		
		$query ="SELECT taxonomy.taxonomy_id, taxonomy.taxonomy_rank_id,
				 taxonomy.parent_id, taxonomy.scientific_name, taxonomy.information
		         FROM taxonomybrowser.specimens, taxonomybrowser.extrataxonomy, taxonomybrowser.taxonomy
		         WHERE specimens.specimen_id = extrataxonomy.specimen_id AND
		         extrataxonomy.taxonomy_id = taxonomy.taxonomy_id AND
		         specimens.specimen_id = '$specimen_id'
				 ORDER BY taxonomy.scientific_name";
				 
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['taxonomy_rank_id'] = mysql_result($result ,$i, "taxonomy_rank_id");
			$tmp['parent_id'] = mysql_result($result ,$i, "parent_id");
			$tmp['scientific_name'] = mysql_result($result ,$i, "scientific_name");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateSpecimen Method
//------------------------------------------------------------------------------
	public function updateSpecimen($specimen_id, $taxonomy_id, $extra_taxonomy_ids, $collection_id, $collected_by, $collected_data, $latitude, $longitude, $information, $bibliographies_ids, $charactersMeasures)
	{
		$specimen_id = mysql_real_escape_string($specimen_id);
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$collection_id = mysql_real_escape_string($collection_id);
		$collected_by = mysql_real_escape_string($collected_by);
		$collected_data = mysql_real_escape_string($collected_data);
		$latitude = mysql_real_escape_string($latitude);
		$longitude = mysql_real_escape_string($longitude);
		
		if(empty($collected_data))
		{
			$collected_data = 'NULL';
		}
		else
		{
			$collected_data = "'$collected_data'";
		}
		if(empty($latitude) && !is_numeric($latitude))
		{
			$latitude = 'NULL';
		}
		else
		{
			$latitude = "'$latitude'";
		}
		if(empty($longitude) || !is_numeric($longitude))
		{
			$longitude = 'NULL';
		}
		else
		{
			$longitude = "'$longitude'";
		}
		
		
		$query = "UPDATE taxonomybrowser.specimens SET
			taxonomy_id = '$taxonomy_id',
			collection_id = '$collection_id',
			collected_by = '$collected_by',
			collected_data = $collected_data,
			latitude = $latitude,
			longitude = $longitude,
			information = '$information'
			WHERE taxonomybrowser.specimens.specimen_id = '$specimen_id'";
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}
		
		//talvez colocar transactions para manter consistencia nesse tipo de acao
		//todos que retornar falso tem que removert o insert anterior pra manter o banco consistente
	
		if(!empty($extra_taxonomy_ids) && !$this->updateExtraTaxonomy($specimen_id, $extra_taxonomy_ids))
		{
			return false;
		}
		if(!empty($bibliographies_ids) && !$this->updateBibliographySpecimen($specimen_id, $bibliographies_ids))
		{
			return false;
		}
		if(!$this->updateMeasures($specimen_id, $charactersMeasures))
		{
			return false;
		}

		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addSpecimen Method
//------------------------------------------------------------------------------
	public function addSpecimen($taxonomy_id, $extra_taxonomy_ids, $collection_id, $collected_by, $collected_data, $latitude, $longitude, $information, $bibliographies_ids, $charactersMeasures)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$collection_id = mysql_real_escape_string($collection_id);
		$collected_by = mysql_real_escape_string($collected_by);
		$collected_data = mysql_real_escape_string($collected_data);
		$latitude = mysql_real_escape_string($latitude);
		$longitude = mysql_real_escape_string($longitude);
		
		
		//debugPrint($bibliographies_ids);
		//debugPrint($extra_taxonomy_ids);
		
		//return false;
		
		if(empty($collected_data))
		{
			$collected_data = 'NULL';
		}
		else
		{
			$collected_data = "'$collected_data'";
		}
		if(empty($latitude) && !is_numeric($latitude))
		{
			$latitude = 'NULL';
		}
		else
		{
			$latitude = "'$latitude'";
		}
		if(empty($longitude) || !is_numeric($longitude))
		{
			$longitude = 'NULL';
		}
		else
		{
			$longitude = "'$longitude'";
		}
		
		
		$specimen_id = -1;
		
		$query = "INSERT INTO taxonomybrowser.specimens
		(
			`taxonomy_id` ,
			`collection_id` ,
			`collected_by` ,
			`collected_data` ,
			`latitude` ,
			`longitude` ,
			`information`
		)
		VALUES
		(
			'$taxonomy_id' ,
			'$collection_id' ,
			'$collected_by' ,
			$collected_data,
			$latitude ,
			$longitude ,
			'$information'
		)";
		
		$result = mysql_query($query, $this->Connection);
		
		
		
		if(!$result)
		{
			return false;
		}
		
		
		
		$specimen_id = mysql_insert_id();
		
		if(!empty($extra_taxonomy_ids) && !$this->updateExtraTaxonomy($specimen_id, $extra_taxonomy_ids))
			return false;
		if(!empty($bibliographies_ids) && !$this->updateBibliographySpecimen($specimen_id, $bibliographies_ids))
			return false;
		if( !$this->updateMeasures($specimen_id, $charactersMeasures))
			return false;

		return true;
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getMeasures Method
//------------------------------------------------------------------------------
	public function getMeasures($specimen_id)
	{
		
		$specimen_id = mysql_real_escape_string($specimen_id);
		$query = "SELECT measure_id, character_id, specimen_id, value, file_name, file_type, file_size FROM taxonomybrowser.measures WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['measure_id'] = mysql_result($result ,$i, "measure_id");
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['specimen_id'] = mysql_result($result ,$i, "specimen_id");
			$tmp['value'] = mysql_result($result ,$i, "value");
			$tmp['file_name'] = mysql_result($result ,$i, "file_name");
			$tmp['file_type'] = mysql_result($result ,$i, "file_type");
			$tmp['file_size'] = mysql_result($result ,$i, "file_size");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;			
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getSpecimens Method
//------------------------------------------------------------------------------
	public function getSpecimens()
	{

		$query = "SELECT specimen_id, taxonomy_id, collection_id, collected_by, collected_data, latitude, longitude, information FROM taxonomybrowser.specimens ORDER BY collection_id";
		$result = mysql_query($query, $this->Connection);
        
		$nodes = array();
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['specimen_id'] = mysql_result($result ,$i, "specimen_id");
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['collection_id'] = mysql_result($result ,$i, "collection_id");
			$tmp['collected_by'] = mysql_result($result ,$i, "collected_by");
			$tmp['collected_data'] = mysql_result($result ,$i, "collected_data");
			$tmp['latitude'] = mysql_result($result ,$i, "latitude");
			$tmp['longitude'] = mysql_result($result ,$i, "longitude");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getSpecimen Method
//------------------------------------------------------------------------------
	public function getSpecimen($specimen_id)
	{
		$specimen_id = mysql_real_escape_string($specimen_id);

		$query = "SELECT specimen_id, taxonomy_id, collection_id, collected_by, collected_data, latitude, longitude, information FROM taxonomybrowser.specimens WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		
		if(!$result || mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}
		
		$node['specimen_id'] = mysql_result($result, 0, "specimen_id");
		$node['taxonomy_id'] = mysql_result($result, 0, "taxonomy_id");
		$node['collection_id'] = mysql_result($result, 0, "collection_id");
		$node['collected_by'] = mysql_result($result, 0, "collected_by");
		$node['collected_data'] = mysql_result($result, 0, "collected_data");
		$node['latitude'] = mysql_result($result, 0, "latitude");
		$node['longitude'] = mysql_result($result, 0, "longitude");
		$node['information'] = mysql_result($result, 0, "information");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;	
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getSpecimensByTaxonomyId Method by taxonomyId
//------------------------------------------------------------------------------
	public function getSpecimensByTaxonomyId($taxonomy_id)
	{

		$query = "SELECT specimen_id, taxonomy_id, collection_id, collected_by, collected_data, latitude, longitude, information FROM taxonomybrowser.specimens WHERE taxonomy_id = '$taxonomy_id' ORDER BY collection_id";
		$result = mysql_query($query, $this->Connection);
        
		$nodes = array();
		
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['specimen_id'] = mysql_result($result ,$i, "specimen_id");
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['collection_id'] = mysql_result($result ,$i, "collection_id");
			$tmp['collected_by'] = mysql_result($result ,$i, "collected_by");
			$tmp['collected_data'] = mysql_result($result ,$i, "collected_data");
			$tmp['latitude'] = mysql_result($result ,$i, "latitude");
			$tmp['longitude'] = mysql_result($result ,$i, "longitude");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeSpecimen Method
//------------------------------------------------------------------------------
	public function removeSpecimen($specimen_id)
	{	
		$specimen_id = mysql_real_escape_string($specimen_id);
	
		$Measures = $this->getMeasures($specimen_id);
		
		foreach($Measures as $m)
		{
			$c = $this->getCharacter($m['character_id']);
			if(isFileField($c['character_type_id']))
			{
				if(!unlink(__UPLOAD_FILES.'/'.$m['file_name']))
				{
					return false;
				}
			}
		}
		
		$query = "DELETE FROM taxonomybrowser.measures WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
		if(!$result)
		{
			return false;
		}
		
	
		$query = "DELETE FROM taxonomybrowser.specimens WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
		if(!$result)
		{
			return false;
		}
		
		
		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstSpecimen Method
//------------------------------------------------------------------------------
	public function getFirstSpecimen(&$ok)
	{
		$ok = false;
		$node = array();
		
			
		$query = "SELECT taxonomy.scientific_name, specimens.specimen_id, specimens.taxonomy_id, specimens.collection_id, specimens.collected_by, specimens.collected_data, specimens.latitude, specimens.longitude, specimens.information FROM taxonomybrowser.specimens, taxonomybrowser.taxonomy WHERE taxonomy.taxonomy_id = specimens.taxonomy_id ORDER BY taxonomy.scientific_name LIMIT 1";
		
		
		$result = mysql_query($query, $this->Connection);
		$node['specimen_id'] = '';
		$node['taxonomy_id'] = '';
		$node['collection_id'] = '';
		$node['collected_by'] = '';
		$node['collected_data'] = '';
		$node['latitude'] = '';
		$node['longitude'] = '';
		$node['information'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			mysql_free_result($result);
			return $node;
		}
		
		$node['specimen_id'] = mysql_result($result , 0, "specimen_id");
		$node['taxonomy_id'] = mysql_result($result , 0, "taxonomy_id");
		$node['collection_id'] = mysql_result($result, 0, "collection_id");
		$node['collected_by'] = mysql_result($result, 0, "collected_by");
		$node['collected_data'] = mysql_result($result, 0, "collected_data");
		$node['latitude'] = mysql_result($result, 0, "latitude");
		$node['longitude'] = mysql_result($result, 0, "longitude");
		$node['information'] = mysql_result($result, 0, "information");
		
		mysql_free_result($result);
		
		$ok = true;
	
		
		$node = stripslashesDeep($node);

		return $node;
	}		
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeTaxonomy Method
//------------------------------------------------------------------------------
	public function removeTaxonomy($taxonomy_id)
	{	
		if($this->isRoot($taxonomy_id))
		{
			return false;
		}
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query = "DELETE FROM taxonomybrowser.taxonomy WHERE taxonomy.taxonomy_id = '$taxonomy_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			return true;
		}
		return false;
	}

	
	public function removeTaxonomyFromAllTables($taxonomy_id)
	{	

		if($this->isRoot($taxonomy_id))
		{
			return false;
		}
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query = "DELETE FROM taxonomybrowser.taxonomy WHERE taxonomy.taxonomy_id = '$taxonomy_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			$query2 = "DELETE FROM taxonomybrowser.characterstaxonomy WHERE taxonomy_id = '$taxonomy_id'";
			$result2 = mysql_query($query2, $this->Connection);
			
			if($result2)
			{
				$specimens = $this->getSpecimensByTaxonomyId($taxonomy_id);
				
				foreach($specimens as $s)
				{
					$result3 = $this->removeSpecimen($s['specimen_id']);
					
					if($result3 != true)
					{	
						return false;
					}
				}
				return true;

			}
			
			return false;
			
		}			
		return false;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (getCharactersRecursive)
//------------------------------------------------------------------------------
	private function getCharactersRecursive($taxonomy_id, &$characters)
	{
		if(empty($taxonomy_id))
		{
			return;
		}
		$node = $this->getTaxonomyNode($taxonomy_id);
		$chs = $this->getCharactersFromTaxonomyNode($node['taxonomy_id']);
		foreach($chs as $c)
		{
			$c['inherits_from'] = $node['taxonomy_id'];
			array_push($characters, $c);
		}
		$this->getCharactersRecursive($node['parent_id'], $characters);		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharactersFromTaxonomyNode Method
//------------------------------------------------------------------------------
	public function getCharactersFromTaxonomyNode($taxonomy_id)
	{
		//$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query ="SELECT characters.character_id, characters.character_group_id,
				 characters.character_type_id, characters.unit_id, characters.character_name, characters.information, characters.character_enums
		         FROM taxonomybrowser.taxonomy, taxonomybrowser.characterstaxonomy, taxonomybrowser.characters
		         WHERE taxonomy.taxonomy_id = characterstaxonomy.taxonomy_id AND
		         characterstaxonomy.character_id = characters.character_id AND
		         taxonomy.taxonomy_id = '$taxonomy_id'
				 ORDER BY characters.character_name";
				 
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['character_group_id'] = mysql_result($result ,$i, "character_group_id");
			$tmp['character_type_id'] = mysql_result($result ,$i, "character_type_id");
			$tmp['unit_id'] = mysql_result($result ,$i, "unit_id");
			$tmp['character_name'] = mysql_result($result ,$i, "character_name");
			$tmp['character_enums'] = mysql_result($result ,$i, "character_enums");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAllCharactersFromTaxonomyNode Method
//------------------------------------------------------------------------------
	public function getAllCharactersFromTaxonomyNode($taxonomy_id)
	{
		$characters = array();
		$this->getCharactersRecursive($taxonomy_id, $characters);
		return $characters;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getBibliographiesFromSpecimen Method
//------------------------------------------------------------------------------
	public function getBibliographiesFromSpecimen($specimen_id)
	{
		$specimen_id = mysql_real_escape_string($specimen_id);
		$query ="SELECT bibliographies.bibliography_id, bibliographies.authors,
				 bibliographies.title, bibliographies.year_of_publication, bibliographies.bibtex
		         FROM taxonomybrowser.specimens, taxonomybrowser.bibliographyspecimen, taxonomybrowser.bibliographies
		         WHERE specimens.specimen_id = bibliographyspecimen.specimen_id AND
		         bibliographyspecimen.bibliography_id = bibliographies.bibliography_id AND
		         specimens.specimen_id = '$specimen_id'
				 ORDER BY bibliographies.authors";
				 
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['bibliography_id'] = mysql_result($result ,$i, "bibliography_id");
			$tmp['title'] = mysql_result($result ,$i, "title");
			$tmp['authors'] = mysql_result($result ,$i, "authors");
			$tmp['year_of_publication'] = mysql_result($result ,$i, "year_of_publication");
			$tmp['bibtex'] = mysql_result($result ,$i, "bibtex");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getBibliographiesFromTaxonomyNode Method
//------------------------------------------------------------------------------
	public function getBibliographiesFromTaxonomyNode($taxonomy_id)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query ="SELECT bibliographies.bibliography_id, bibliographies.authors,
				 bibliographies.title, bibliographies.year_of_publication, bibliographies.bibtex
		         FROM taxonomybrowser.taxonomy, taxonomybrowser.bibliographytaxonomy, taxonomybrowser.bibliographies
		         WHERE taxonomy.taxonomy_id = bibliographytaxonomy.taxonomy_id AND
		         bibliographytaxonomy.bibliography_id = bibliographies.bibliography_id AND
		         taxonomy.taxonomy_id = '$taxonomy_id'
				 ORDER BY bibliographies.authors";
				 
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['bibliography_id'] = mysql_result($result ,$i, "bibliography_id");
			$tmp['title'] = mysql_result($result ,$i, "title");
			$tmp['authors'] = mysql_result($result ,$i, "authors");
			$tmp['year_of_publication'] = mysql_result($result ,$i, "year_of_publication");
			$tmp['bibtex'] = mysql_result($result ,$i, "bibtex");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateTaxonomy Method
//------------------------------------------------------------------------------
	public function updateTaxonomy($taxonomy_id, $taxonomy_rank_id, $parent_id, $scientific_name, $information, $characters_ids, $bibliographies_ids)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$taxonomy_rank_id = mysql_real_escape_string($taxonomy_rank_id);
		$parent_id = mysql_real_escape_string($parent_id);
		$scientific_name = mysql_real_escape_string($scientific_name);
		
		if(!empty($parent_id))
		{
			$query = "UPDATE taxonomybrowser.taxonomy
			SET taxonomy_id = '$taxonomy_id',
			taxonomy_rank_id = '$taxonomy_rank_id',
			parent_id = '$parent_id',
			scientific_name = '$scientific_name',
			information = '$information'
			WHERE taxonomy.taxonomy_id = '$taxonomy_id'";
		}
		else
		{
			$query = "UPDATE taxonomybrowser.taxonomy
			SET taxonomy_id = '$taxonomy_id',
			taxonomy_rank_id = '$taxonomy_rank_id',
			scientific_name = '$scientific_name',
			information = '$information'
			WHERE taxonomy.taxonomy_id = '$taxonomy_id'";
		}
		
		$result = mysql_query($query, $this->Connection);
		
		if(!$result)
		{
			return false;
		}	
		
		if(!empty($bibliographies_ids) &&!$this->updateBibliographyTaxonomy($taxonomy_id, $bibliographies_ids))
			return false;
		if(!empty($characters_ids) && !$this->updateCharactersTaxonomy($taxonomy_id, $characters_ids))
			return false;

		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addTaxonomy Method
//------------------------------------------------------------------------------
	public function addTaxonomy($taxonomy_rank_id, $parent_id, $scientific_name, $information, $characters_ids, $bibliographies_ids)
	{
		$taxonomy_rank_id = mysql_real_escape_string($taxonomy_rank_id);
		$parent_id = mysql_real_escape_string($parent_id);
		$scientific_name = mysql_real_escape_string($scientific_name);
		$taxonomy_id = -1;
		
		$query = "INSERT INTO taxonomybrowser.taxonomy
		(
			`taxonomy_rank_id` ,
			`parent_id` ,
			`scientific_name` ,
			`information`		
		)
		VALUES
		(
			'$taxonomy_rank_id',
			'$parent_id',
			'$scientific_name',
			'$information'
		)";

		$result = mysql_query($query, $this->Connection);
		
	
		if(!$result)
		{
			return false;
		}
		
		$taxonomy_id = mysql_insert_id();
		
		if(!empty($bibliographies_ids) &&!$this->updateBibliographyTaxonomy($taxonomy_id, $bibliographies_ids))
			return false;
		if(!empty($characters_ids) && !$this->updateCharactersTaxonomy($taxonomy_id, $characters_ids))
			return false;
		

		return true;		
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateBibliographyTaxonomy Method
//------------------------------------------------------------------------------
	private function updateBibliographyTaxonomy($taxonomy_id, &$bibliographies_ids)
	{
		$query = "DELETE FROM taxonomybrowser.bibliographytaxonomy WHERE taxonomy_id = '$taxonomy_id'";
		$result = mysql_query($query, $this->Connection);
		foreach($bibliographies_ids as $b_id)
		{
			$query = "INSERT INTO  taxonomybrowser.bibliographytaxonomy (bibliography_id, taxonomy_id) VALUES('$b_id',  '$taxonomy_id')";
			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateBibliographySpecimen Method
//------------------------------------------------------------------------------
	private function updateBibliographySpecimen($specimen_id, &$bibliographies_ids)
	{
		$query = "DELETE FROM taxonomybrowser.bibliographyspecimen WHERE specimen_id = '$specimen_id'";
		$result = mysql_query($query, $this->Connection);
		foreach($bibliographies_ids as $b_id)
		{
			$query = "INSERT INTO  taxonomybrowser.bibliographyspecimen (bibliography_id, specimen_id) VALUES('$b_id',  '$specimen_id')";
			$result_2 = mysql_query($query, $this->Connection);
			if(!$result_2)
			{
				return false;
			}
		}	
		return true;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (charactersIds)
//------------------------------------------------------------------------------
	private function charactersIds(&$characters)
	{
		$characters_ids = array();
		foreach($characters as $ch)
		{
			array_push($characters_ids, $ch['character_id']);
		}	
		return $characters_ids;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (updateCharactersTaxonomy)
//------------------------------------------------------------------------------
	private function updateCharactersTaxonomy($taxonomy_id, &$characters_ids)
	{
		$CharactersFromTaxonomyNodeIds = $this->charactersIds($this->getCharactersFromTaxonomyNode($taxonomy_id));
		
		//print_r($CharactersFromTaxonomyNodeIds);
		
		$removed_characters_ids = array();
		//foreach($CharactersFromTaxonomyNodeIds as $ch) //nao eh assim essa m! de foreach
		foreach($CharactersFromTaxonomyNodeIds as $key => $value)
		{
			if(!in_array($value, $characters_ids))
			{
				array_push($removed_characters_ids, $value);
			}
		}
		
		
		
		$add_characters_ids = array();
		foreach($characters_ids as $key => $value)
		{
			if(!in_array($value, $CharactersFromTaxonomyNodeIds))
			{
				array_push($add_characters_ids, $value);
			}
		}

	
		foreach($removed_characters_ids as $c_id)
		{
			$this->ajustCharactersTaxonomyRecursive($taxonomy_id, $c_id);
		}		
		foreach($add_characters_ids as $c_id)
		{
			$this->ajustCharactersTaxonomyRecursive($taxonomy_id, $c_id);
		}			
	
		foreach($add_characters_ids as $key => $c_id)
		{
			$query = "INSERT INTO taxonomybrowser.characterstaxonomy (character_id, taxonomy_id) VALUES('$c_id', '$taxonomy_id')";
			$result = mysql_query($query, $this->Connection);
			if(!$result)
			{
				return false;
			}
		}
		
		return true;
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (ajustCharactersTaxonomyRecursive)
//------------------------------------------------------------------------------
	private function ajustCharactersTaxonomyRecursive($taxonomy_id, $character_id)
	{
		$break_recursion = false;
		$childs = $this->getChilds($taxonomy_id);
		if(empty($childs))
		{
			$break_recursion = true;
		}
		
		$query = "DELETE FROM taxonomybrowser.characterstaxonomy WHERE taxonomy_id = '$taxonomy_id' AND character_id = '$character_id'";
		

		$result = mysql_query($query, $this->Connection);

		if($break_recursion || !$result)
		{
			return;
		}		
	
		foreach($childs as $c)
		{
			$this->ajustCharactersTaxonomyRecursive($c['taxonomy_id'], $character_id);
		}		
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getChildTaxonomyRank Method
//------------------------------------------------------------------------------
	public function getChildTaxonomyRank($taxonomy_rank_id)
	{
		
		$childRank = array();
		$ranks = $this->getTaxonomyRanks();
		
		foreach($ranks as $rank)
		{
			if($rank['taxonomy_rank_id'] > $taxonomy_rank_id)
			{
				$childRank = $rank;
				break;
			}
		}
		return $childRank;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getChildrenTaxonomyRank Method
//------------------------------------------------------------------------------
	public function getChildrenTaxonomyRank($taxonomy_rank_id)
	{
		
		$childRank = array();
		$ranks = $this->getTaxonomyRanks();
		
		foreach($ranks as $rank)
		{
			if($rank['taxonomy_rank_id'] > $taxonomy_rank_id)
			{
				array_push($childRank, $rank);
				
			}
		}
		return $childRank;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyRanks Method
//------------------------------------------------------------------------------
	public function getTaxonomyRanks()
	{
	
		//$query = "SELECT taxonomy_rank_id, taxonomy_rank_name FROM taxonomyrank ORDER BY taxonomy_rank_name";
		$query = "SELECT taxonomy_rank_id, taxonomy_rank_name FROM taxonomybrowser.taxonomyrank";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['taxonomy_rank_id'] = mysql_result($result ,$i, "taxonomy_rank_id");
			$tmp['taxonomy_rank_name'] = mysql_result($result, $i, "taxonomy_rank_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		//$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
		
	}

//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyRanks Method
//------------------------------------------------------------------------------
	public function getTaxonomyRanksWithAssociativeArray()
	{
	
		//$query = "SELECT taxonomy_rank_id, taxonomy_rank_name FROM taxonomyrank ORDER BY taxonomy_rank_name";
		$query = "SELECT taxonomy_rank_id, taxonomy_rank_name FROM taxonomybrowser.taxonomyrank";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			//$tmp = array();
			//$tmp['taxonomy_rank_id'] = mysql_result($result ,$i, "taxonomy_rank_id");
			//$tmp['taxonomy_rank_name'] = mysql_result($result, $i, "taxonomy_rank_name");
			$nodes[mysql_result($result ,$i, "taxonomy_rank_id")] = mysql_result($result, $i, "taxonomy_rank_name");
			//array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		//$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyRankName Method
//------------------------------------------------------------------------------
	public function getTaxonomyRankName($taxonomy_rank_id)
	{
		$taxonomy_rank_id = mysql_real_escape_string($taxonomy_rank_id);
		$query = "SELECT taxonomy_rank_name FROM taxonomybrowser.taxonomyrank where taxonomy_rank_id = '$taxonomy_rank_id'";
		$result = mysql_query($query, $this->Connection);

		$taxonomy_rank_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $taxonomy_rank_name;
		}
		
		$taxonomy_rank_name = mysql_result($result, 0, "taxonomy_rank_name");
		
		mysql_free_result($result);
		
		//$taxonomy_rank_name = stripslashesDeep($taxonomy_rank_name);
		
		return $taxonomy_rank_name;	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyNode Method
//------------------------------------------------------------------------------
	public function getTaxonomyNode($taxonomy_id)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query = "SELECT taxonomy_id, parent_id, taxonomy_rank_id, scientific_name, information FROM taxonomybrowser.taxonomy where taxonomy_id = '$taxonomy_id'";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		if(!$result || mysql_num_rows($result) == 0)
		{
			return $node;
		}
		$node['taxonomy_id'] = mysql_result($result ,0, "taxonomy_id");
		$node['parent_id'] = mysql_result($result ,0, "parent_id");
		$node['taxonomy_rank_id'] = mysql_result($result, 0, "taxonomy_rank_id");
		$node['scientific_name'] = mysql_result($result, 0, "scientific_name");
		$node['information'] = mysql_result($result, 0, "information");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);
		
		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyNodeFromTaxonomyRank Method
//------------------------------------------------------------------------------
	public function getTaxonomyNodeFromTaxonomyRank($taxonomy_rank_id)
	{
		$taxonomy_rank_id = mysql_real_escape_string($taxonomy_rank_id);

		$query = "SELECT DISTINCT(taxonomy.taxonomy_id), taxonomy.parent_id, taxonomy.taxonomy_rank_id, taxonomy.scientific_name, taxonomy.information
		FROM taxonomybrowser.taxonomy, taxonomybrowser.taxonomyrank
		WHERE taxonomy.taxonomy_rank_id = taxonomyrank.taxonomy_rank_id AND
		taxonomyrank.taxonomy_rank_id = '$taxonomy_rank_id'
		ORDER BY taxonomy.scientific_name";
		
		//print_r($query);

		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['parent_id'] = mysql_result($result ,$i, "parent_id");
			$tmp['taxonomy_rank_id'] = mysql_result($result, $i, "taxonomy_rank_id");
			$tmp['scientific_name'] = mysql_result($result, $i, "scientific_name");
			$tmp['information'] = mysql_result($result, $i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getTaxonomyNodeRoot Method
//------------------------------------------------------------------------------
	public function getTaxonomyNodeRoot()
	{
		$query = "SELECT taxonomy_id, parent_id, taxonomy_rank_id, scientific_name, information FROM taxonomybrowser.taxonomy where parent_id IS NULL LIMIT 1";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}

		$node['taxonomy_id'] = mysql_result($result ,0, "taxonomy_id");
		$node['parent_id'] = mysql_result($result, 0, "parent_id");
		$node['taxonomy_rank_id'] = mysql_result($result, 0, "taxonomy_rank_id");
		$node['scientific_name'] = mysql_result($result, 0, "scientific_name");
		$node['information'] = mysql_result($result, 0, "information");

		mysql_free_result($result);
		
		$node = stripslashesDeep($node);
		
		return $node;		
	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model isRoot Method
//------------------------------------------------------------------------------
	public function isRoot($taxonomy_id)
	{
		$query = "SELECT taxonomy_id FROM taxonomybrowser.taxonomy where parent_id IS NULL LIMIT 1";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		if(mysql_num_rows($result) == 0)
		{
			return false;
		}

		$node['taxonomy_id'] = mysql_result($result ,0, "taxonomy_id");

		mysql_free_result($result);
		
		return $node['taxonomy_id'] == $taxonomy_id;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (getChildsIdRecursive)
//------------------------------------------------------------------------------
	private function getChildsIdRecursive(&$Childs_Ids, $taxonomy_id)
	{
		$childs = $this->getChilds($taxonomy_id);
		if(empty($childs))
		{
			array_push($Childs_Ids, $taxonomy_id);
			return;
		}
		
		array_push($Childs_Ids, $taxonomy_id);
		
		foreach($childs as $c)
		{
			$this->getChildsIdRecursive($Childs_Ids, $c['taxonomy_id']);
		}
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getAllPossibleParents Method
//------------------------------------------------------------------------------
	public function getAllPossibleParents($taxonomy_id)
	{
		$Childs_Ids = array();
		$this->getChildsIdRecursive($Childs_Ids, $taxonomy_id);
		
		
		$query = "SELECT taxonomy_id, taxonomy_rank_id, scientific_name FROM taxonomybrowser.taxonomy ORDER BY scientific_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['taxonomy_rank_id'] = mysql_result($result, $i, "taxonomy_rank_id");
			$tmp['scientific_name'] = mysql_result($result, $i, "scientific_name");
			$taxonomy_rank_name = $this->getTaxonomyRankName($tmp['taxonomy_rank_id']);
			$tmp['taxonomy_rank_name'] = $taxonomy_rank_name;
			
			$ok = true;
			if($tmp['taxonomy_id'] == $taxonomy_id)
			{
				$ok = false;
			}
			else
			{
				foreach($Childs_Ids as $id)
				{
					if($tmp['taxonomy_id'] == $id)
					{
						$ok = false;
						break;
					}
				}
			}
			if($ok)
			{
				array_push($nodes, $tmp);
			}
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getChilds Method
//------------------------------------------------------------------------------
	public function getChilds($taxonomy_id)
	{
		$taxonomy_id = mysql_real_escape_string($taxonomy_id);
		$query = "SELECT taxonomy_id, parent_id, taxonomy_rank_id, scientific_name, information FROM taxonomybrowser.taxonomy where parent_id = '$taxonomy_id' ORDER BY scientific_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['taxonomy_id'] = mysql_result($result ,$i, "taxonomy_id");
			$tmp['parent_id'] = mysql_result($result ,$i, "parent_id");
			$tmp['taxonomy_rank_id'] = mysql_result($result, $i, "taxonomy_rank_id");
			$tmp['scientific_name'] = mysql_result($result, $i, "scientific_name");
			$tmp['information'] = mysql_result($result, $i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (lineageRecursive)
//------------------------------------------------------------------------------
	private function lineageRecursive($node, &$nodes)
	{
		if(empty($node['parent_id']))
		{
			return;
		}
		
		$parent_node = $this->getTaxonomyNode($node['parent_id']);
		array_push($nodes, $parent_node);
		$this->lineageRecursive($parent_node, $nodes);
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getLineage Method
//------------------------------------------------------------------------------
	public function getLineage($taxonomy_id)
	{
		$lineage = array();
		$root_node = $this->getTaxonomyNode($taxonomy_id);
		//array_push($lineage, $root_node);
		$this->lineageRecursive($root_node, $lineage);
		$lineage = array_reverse($lineage);
		return $lineage;
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model logoutUser Method
//------------------------------------------------------------------------------
	public function logoutUser()
	{
		
		//mata os cookies dos scrollbars
		//clearAllScrollBarCookies();
		
		unset($_SESSION['user_is_logged_in']);
		unset($_SESSION['user_information']);
		session_destroy();
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model loginUser Method
//------------------------------------------------------------------------------
	public function loginUser($username, $password)
	{
		
		$username = mysql_real_escape_string($username);
		$password = mysql_real_escape_string($password);
		
		$password = $password . md5Salt();
		
		
		//echo md5($password);
		
		$query = "SELECT user_id, user_name, user_password, role_id, full_name FROM taxonomybrowser.users WHERE user_name = '$username'";
		$result = mysql_query($query, $this->Connection);

		if(mysql_num_rows($result) == 0)
		{
			return false;
		}
		

		$user_id = mysql_result($result , 0, "user_id");
		$role_id = mysql_result($result , 0, "role_id");
		$user_name = mysql_result($result , 0, "user_name");
		$user_password = mysql_result($result, 0, "user_password");
		$full_name = mysql_result($result, 0, "full_name");
		
		/*print_r($user_name);
		print_r($password);
		print_r($user_password);
		echo '---';
		print_r(md5($password));
		*/
		
		
		//if($username == $user_name && md5($password) == $user_password)
		if(md5($password) == $user_password)
		{
			$current_datatime = date( 'Y-m-d H:i:s');
			$query = "UPDATE taxonomybrowser.users SET last_login = '$current_datatime' WHERE users.user_id = '$user_id' LIMIT 1";
			$result = mysql_query($query, $this->Connection);
			if(!$result)
			{	
				return false;
			}
			
			$user_information = array();
			$user_information['user_id'] = $user_id;
			$user_information['user_name'] = $user_name;
			$user_information['full_name'] = $full_name;
			$user_information['role_id'] = $role_id;
			
			//session_start();
			
			$_SESSION['user_is_logged_in'] = true;
			$_SESSION['user_information'] = $user_information;
			
			//mata os cookies dos scrollbars
			//clearAllScrollBarCookies();

			return true;
		}
		return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model resetPassword Method
//------------------------------------------------------------------------------
	public function resetPassword($username, $email)
	{
	
		$username = mysql_real_escape_string($username);
		$email = mysql_real_escape_string($email);
		
		$query = "SELECT user_id, user_name, user_password, role_id, full_name, email FROM taxonomybrowser.users WHERE user_name = '$username' AND email = '$email'";
		
		//print_r($query);
		
		$result = mysql_query($query, $this->Connection);

		if(mysql_num_rows($result) == 0)
		{
			return false;
		}
		
		$user_id = mysql_result($result , 0, "user_id");
		$role_id = mysql_result($result , 0, "role_id");
		$user_name = mysql_result($result , 0, "user_name");
		$user_password = mysql_result($result, 0, "user_password");
		$full_name = mysql_result($result, 0, "full_name");
		$user_email = mysql_result($result, 0, "email");
		
		//b730daf9faebd047dd0325a597fa1fcb
		
		$new_password = createPassword(8);
		print_r($new_password);
		$passwordMd5 = md5($new_password . md5Salt());
		$ok1 = !empty($new_password) && !empty($passwordMd5);
		
		//mand email pro usuario com o novo password
		$to = $user_email;
		$subject = "TaxonomyBrowser Password Reset";
		$body = "
		<html><body>
		<p>Hi there,</p>
		<p>There was recently a request to change the password on your account.</p>
		<p>Here is your new password: __PASSWORD__</p>
		<p>Thanks,</p>
		<p>The TaxonomyBrowser Team.</p>
		</body></html>";
		
		$keys = array('__PASSWORD__');
		$values = $new_password;
		$body = str_replace($keys,$values,$body);
		
		$ok2 = sendEmail($to,$subject,$body);
		
		//salva no banco novo password
		if($ok1 && $ok2)
		{
			$query = "UPDATE taxonomybrowser.users SET user_password = '$passwordMd5' WHERE users.user_id = '$user_id' LIMIT 1";
			$result = mysql_query($query, $this->Connection);
			if(!$result)
			{	
				return false;
			}
			
			return true;
		}
		
		return false;
		
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addUser Method
//------------------------------------------------------------------------------
	public function addUser($role_id, $user_name, $user_password, $full_name, $email)
	{
		$role_id = mysql_real_escape_string($role_id);
		$user_name = mysql_real_escape_string($user_name);
		$user_password = mysql_real_escape_string($user_password);
		
		$user_password = $user_password . md5Salt();
		
		$user_password = md5($user_password);
		$full_name = mysql_real_escape_string($full_name);
		$email = mysql_real_escape_string($email);
		$registration_date = date('Y-m-d H:i:s');
		$query = "INSERT INTO taxonomybrowser.users(role_id, user_name, user_password, full_name, email, registration_date)
		VALUES('$role_id',  '$user_name',  '$user_password',  '$full_name', '$email' , '$registration_date')";
		
		//print_r($query);

		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateUser Method
//------------------------------------------------------------------------------
	public function updateUser($user_id, $role_id, $user_name, $user_password, $full_name, $email)
	{
		$user_id = mysql_real_escape_string($user_id);
		$role_id = mysql_real_escape_string($role_id);
		$user_name = mysql_real_escape_string($user_name);
		$user_password = mysql_real_escape_string($user_password);
		
		//echo $user_password;
		
		$full_name = mysql_real_escape_string($full_name);
		$email = mysql_real_escape_string($email);
		
		$query = '';
		if(empty($user_password))
		{
			$query = "UPDATE taxonomybrowser.users
			SET role_id = '$role_id',
			user_name = '$user_name',
			full_name = '$full_name',
			email = '$email'
			WHERE users.user_id = '$user_id'";
		}
		else
		{
		
			$user_password = $user_password . md5Salt();
			$user_password = md5($user_password);
		
		
			$query = "UPDATE taxonomybrowser.users
			SET role_id = '$role_id',
			user_name = '$user_name',
			user_password = '$user_password',
			full_name = '$full_name',
			email = '$email'
			WHERE users.user_id = '$user_id'";
		}
		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeUser Method
//------------------------------------------------------------------------------
	public function removeUser($user_id)
	{	
	
		$user = $this->getUser($user_id);
		$role_id = $user['role_id'];
		$is_admin = $this->getRoleName($role_id) == 'administrator';
	
		if($is_admin && $this->countAdministratorUsers($user_id) < 2)
		{
			return false;
		}
		
		$user_id = mysql_real_escape_string($user_id);
		$query = "DELETE FROM taxonomybrowser.users WHERE users.user_id = '$user_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			return true;
		}
		return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model Private Function (countAdministratorUsers)
//------------------------------------------------------------------------------
	private function countAdministratorUsers()
	{
		$query = "SELECT COUNT( users.user_id ) FROM taxonomybrowser.users, taxonomybrowser.roles WHERE users.role_id = roles.role_id AND roles.role_name =  'administrator'";
		return (int)mysql_evaluate($query);
	}		

	public function getUsers()
	{
		$query = "SELECT user_id, role_id, user_name, full_name FROM taxonomybrowser.users ORDER BY full_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['user_id'] = mysql_result($result ,$i, "user_id");
			$tmp['role_id'] = mysql_result($result ,$i, "role_id");
			$tmp['user_name'] = mysql_result($result, $i, "user_name");
			$tmp['full_name'] = mysql_result($result, $i, "full_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getUser Method
//------------------------------------------------------------------------------
	public function getUser($user_id)
	{
		$user_id = mysql_real_escape_string($user_id);
		$query = "SELECT user_id, role_id, user_name, user_password, full_name, email, registration_date, last_login FROM taxonomybrowser.users WHERE user_id = '$user_id'";
		
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['user_id'] = '';
		$node['role_id'] = '';
		$node['user_name'] = '';
		$node['user_password'] = '';
		$node['full_name'] = '';
		$node['email'] = '';
		$node['registration_date'] = '';
		$node['last_login'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}
		
		$node['user_id'] = mysql_result($result , 0, "user_id");
		$node['role_id'] = mysql_result($result , 0, "role_id");
		$node['user_name'] = mysql_result($result, 0, "user_name");
		$node['user_password'] = mysql_result($result, 0, "user_password");
		$node['full_name'] = mysql_result($result, 0, "full_name");
		$node['email'] = mysql_result($result, 0, "email");
		$node['registration_date'] = mysql_result($result, 0, "registration_date");
		$node['last_login'] = mysql_result($result, 0, "last_login");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstUser Method
//------------------------------------------------------------------------------
	public function getFirstUser()
	{
		$firstRoleId = $this->getRoles();
		$firstRoleId = $firstRoleId[0]['role_id'];
		
		$query = "SELECT user_id, role_id, user_name, user_password, full_name, email, registration_date, last_login FROM taxonomybrowser.users WHERE users.role_id = '$firstRoleId' ORDER BY user_name LIMIT 1";
		
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['user_id'] = '';
		$node['role_id'] = '';
		$node['user_name'] = '';
		$node['user_password'] = '';
		$node['full_name'] = '';
		$node['email'] = '';
		$node['registration_date'] = '';
		$node['last_login'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}
		
		$node['user_id'] = mysql_result($result , 0, "user_id");
		$node['role_id'] = mysql_result($result , 0, "role_id");
		$node['user_name'] = mysql_result($result, 0, "user_name");
		$node['user_password'] = mysql_result($result, 0, "user_password");
		$node['full_name'] = mysql_result($result, 0, "full_name");
		$node['email'] = mysql_result($result, 0, "email");
		$node['registration_date'] = mysql_result($result, 0, "registration_date");
		$node['last_login'] = mysql_result($result, 0, "last_login");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getRoles Method
//------------------------------------------------------------------------------
	public function getRoles()
	{
		$query = "SELECT role_id, role_name FROM taxonomybrowser.roles ORDER BY role_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['role_id'] = mysql_result($result ,$i, "role_id");
			$tmp['role_name'] = mysql_result($result, $i, "role_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getRoleName Method
//------------------------------------------------------------------------------
	public function getRoleName($role_id)
	{
		$role_id = mysql_real_escape_string($role_id);
		$query = "SELECT role_name FROM taxonomybrowser.roles where role_id = '$role_id'";
		$result = mysql_query($query, $this->Connection);

		$role_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $role_name;
		}
		
		$role_name = mysql_result($result, 0, "role_name");
			
		mysql_free_result($result);
		
		
		$role_name = stripslashesDeep($role_name);
		
		return $role_name;	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getQuantities Method
//------------------------------------------------------------------------------
	public function getQuantities()
	{
		$query = "SELECT quantity_id, quantity_name FROM taxonomybrowser.quantities ORDER BY quantity_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['quantity_id'] = mysql_result($result ,$i, "quantity_id");
			$tmp['quantity_name'] = mysql_result($result ,$i, "quantity_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getQuantityName Method
//------------------------------------------------------------------------------
	public function getQuantityName($quantity_id)
	{
		$quantity_id = mysql_real_escape_string($quantity_id);
		$query = "SELECT quantity_name FROM taxonomybrowser.quantities WHERE quantity_id = '$quantity_id'";
		$result = mysql_query($query, $this->Connection);

		$quantity_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $quantity_name;
		}
		
		$quantity_name = mysql_result($result, 0, "quantity_name");
		
		mysql_free_result($result);
		
		$quantity_name = stripslashesDeep($quantity_name);
		
		return $quantity_name;	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getUnits Method
//------------------------------------------------------------------------------
	public function getUnits()
	{
		$query = "SELECT unit_id, quantity_id, unit_name, symbol, si_multiple FROM taxonomybrowser.units ORDER BY unit_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['unit_id'] = mysql_result($result ,$i, "unit_id");
			$tmp['quantity_id'] = mysql_result($result ,$i, "quantity_id");
			$tmp['unit_name'] = mysql_result($result ,$i, "unit_name");
			$tmp['symbol'] = mysql_result($result ,$i, "symbol");
			$tmp['si_multiple'] = mysql_result($result ,$i, "si_multiple");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		
		$nodes = stripslashesDeep($nodes);
		
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getUnit Method
//------------------------------------------------------------------------------
	public function getUnit($unit_id)
	{
		$unit_id = mysql_real_escape_string($unit_id);
		$query = "SELECT unit_id, quantity_id, unit_name, symbol, si_multiple FROM taxonomybrowser.units WHERE unit_id = '$unit_id'";
		
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['unit_id'] = '';
		$node['quantity_id'] = '';
		$node['unit_name'] = '';
		$node['symbol'] = '';
		$node['si_multiple'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}
		
		$node['unit_id'] = mysql_result($result , 0, "unit_id");
		$node['quantity_id'] = mysql_result($result , 0, "quantity_id");
		$node['unit_name'] = mysql_result($result, 0, "unit_name");
		$node['symbol'] = mysql_result($result, 0, "symbol");
		$node['si_multiple'] = mysql_result($result, 0, "si_multiple");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getUnitsFromQuantity Method
//------------------------------------------------------------------------------
	public function getUnitsFromQuantity($quantity_id)
	{
		$quantity_id = mysql_real_escape_string($quantity_id);
		$query = "SELECT unit_id, quantity_id, unit_name, symbol, si_multiple FROM taxonomybrowser.units WHERE quantity_id = '$quantity_id' ORDER BY unit_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['unit_id'] = mysql_result($result ,$i, "unit_id");
			$tmp['quantity_id'] = mysql_result($result ,$i, "quantity_id");
			$tmp['unit_name'] = mysql_result($result ,$i, "unit_name");
			$tmp['symbol'] = mysql_result($result ,$i, "symbol");
			$tmp['si_multiple'] = mysql_result($result ,$i, "si_multiple");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;	
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getUnitName Method
//------------------------------------------------------------------------------
	public function getUnitName($unit_id)
	{
		$unit_id = mysql_real_escape_string($unit_id);
		$query = "SELECT unit_name FROM taxonomybrowser.units WHERE unit_id = '$unit_id'";
		$result = mysql_query($query, $this->Connection);

		$quantity_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $quantity_name;
		}
		
		$quantity_name = mysql_result($result, 0, "unit_name");
		
		mysql_free_result($result);
		
		return $quantity_name;	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addUnit Method
//------------------------------------------------------------------------------
	public function addUnit($quantity_id, $unit_name, $symbol, $si_multiple)
	{
		$quantity_id = mysql_real_escape_string($quantity_id);
		$unit_name = mysql_real_escape_string($unit_name);
		$symbol = mysql_real_escape_string($symbol);
		$si_multiple = mysql_real_escape_string($si_multiple);
		$query = "INSERT INTO taxonomybrowser.units(quantity_id, unit_name, symbol, si_multiple)
		VALUES('$quantity_id',  '$unit_name',  '$symbol',  '$si_multiple')";

		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateUnit Method
//------------------------------------------------------------------------------
	public function updateUnit($unit_id, $quantity_id, $unit_name, $symbol, $si_multiple)
	{	
		$unit_id = mysql_real_escape_string($unit_id);
		$quantity_id = mysql_real_escape_string($quantity_id);
		$unit_name = mysql_real_escape_string($unit_name);
		$symbol = mysql_real_escape_string($symbol);
		$si_multiple = mysql_real_escape_string($si_multiple);
		
		$query = "UPDATE taxonomybrowser.units
		SET unit_id = '$unit_id',
		quantity_id = '$quantity_id',
		unit_name = '$unit_name',
		symbol = '$symbol',
		si_multiple = '$si_multiple'
		WHERE units.unit_id = '$unit_id'";

		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeUnit Method
//------------------------------------------------------------------------------
	public function removeUnit($unit_id)
	{	
		$unit_id = mysql_real_escape_string($unit_id);
		$query = "DELETE FROM taxonomybrowser.units WHERE units.unit_id = '$unit_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			return true;
		}
		return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstUnit Method
//------------------------------------------------------------------------------
	public function getFirstUnit(&$ok)
	{
		$ok = false;
		$quantities = $this->getQuantities();
		$node = array();
		
		for($i = 0; $i < sizeof($quantities); $i++)
		{
		
			$firstQuantityId = $quantities[$i]['quantity_id'];
			$query = "SELECT unit_id, quantity_id, unit_name, symbol, si_multiple FROM taxonomybrowser.units WHERE units.quantity_id = '$firstQuantityId' ORDER BY unit_name LIMIT 1";
			
			$result = mysql_query($query, $this->Connection);
			$node['unit_id'] = '';
			$node['quantity_id'] = '';
			$node['unit_name'] = '';
			$node['symbol'] = '';
			$node['si_multiple'] = '';
			
			if(mysql_num_rows($result) == 0)
			{
				mysql_free_result($result);
				continue;
			}
			
			$node['unit_id'] = mysql_result($result , 0, "unit_id");
			$node['quantity_id'] = mysql_result($result , 0, "quantity_id");
			$node['unit_name'] = mysql_result($result, 0, "unit_name");
			$node['symbol'] = mysql_result($result, 0, "symbol");
			$node['si_multiple'] = mysql_result($result, 0, "si_multiple");
			
			mysql_free_result($result);
			
			$ok = true;
			break;
		}
		
		$node = stripslashesDeep($node);

		return $node;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getBibliographies Method
//------------------------------------------------------------------------------
	public function getBibliographies()
	{
		$query = "SELECT bibliography_id, authors, title, year_of_publication, bibtex FROM taxonomybrowser.bibliographies ORDER BY title";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['bibliography_id'] = mysql_result($result ,$i, "bibliography_id");
			$tmp['title'] = mysql_result($result ,$i, "title");
			$tmp['authors'] = mysql_result($result ,$i, "authors");
			$tmp['year_of_publication'] = mysql_result($result ,$i, "year_of_publication");
			$tmp['bibtex'] = mysql_result($result ,$i, "bibtex");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getBibliography Method
//------------------------------------------------------------------------------
	public function getBibliography($bibliography_id)
	{
		$bibliography_id = mysql_real_escape_string($bibliography_id);
		$query = "SELECT bibliography_id, authors, title, publisher, year_of_publication, bibtex FROM taxonomybrowser.bibliographies WHERE bibliography_id = '$bibliography_id'";
		
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['bibliography_id'] = '';
		$node['title'] = '';
		$node['publisher'] = '';
		$node['authors'] = '';
		$node['year_of_publication'] = '';
		$node['bibtex'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}
		
		$node['bibliography_id'] = mysql_result($result , 0, "bibliography_id");
		$node['title'] = mysql_result($result , 0, "title");
		$node['publisher'] = mysql_result($result , 0, "publisher");
		$node['authors'] = mysql_result($result, 0, "authors");
		$node['year_of_publication'] = mysql_result($result, 0, "year_of_publication");
		$node['bibtex'] = mysql_result($result, 0, "bibtex");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateBibliography Method
//------------------------------------------------------------------------------
	public function updateBibliography($bibliography_id, $authors, $title, $publisher, $year_of_publication, $bibtex)
	{	
		$bibliography_id = mysql_real_escape_string($bibliography_id);
		$title = mysql_real_escape_string($title);
		$publisher = mysql_real_escape_string($publisher);
		$authors = mysql_real_escape_string($authors);
		$year_of_publication = mysql_real_escape_string($year_of_publication);
		//$bibtex = mysql_real_escape_string($bibtex);
		
		$query = "UPDATE taxonomybrowser.bibliographies
		SET bibliography_id = '$bibliography_id',
		title = '$title',
		publisher = '$publisher',
		authors = '$authors',
		year_of_publication = '$year_of_publication',
		bibtex = '$bibtex'
		WHERE bibliographies.bibliography_id = '$bibliography_id'";

		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeBibliography Method
//------------------------------------------------------------------------------
	public function removeBibliography($bibliography_id)
	{	
		$bibliography_id = mysql_real_escape_string($bibliography_id);
		$query = "DELETE FROM taxonomybrowser.bibliographies WHERE bibliographies.bibliography_id = '$bibliography_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			return true;
		}
		return false;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getFirstBibliography Method
//------------------------------------------------------------------------------
	public function getFirstBibliography(&$ok)
	{
		$ok = true;
	
		$query = "SELECT bibliography_id, authors, title, publisher, year_of_publication, bibtex FROM taxonomybrowser.bibliographies ORDER BY authors LIMIT 1";
			
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['bibliography_id'] = '';
		$node['title'] = '';
		$node['publisher'] = '';
		$node['authors'] = '';
		$node['year_of_publication'] = '';
		$node['bibtex'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			$ok = false;
			return $node;
		}
		
		$node['bibliography_id'] = mysql_result($result , 0, "bibliography_id");
		$node['title'] = mysql_result($result , 0, "title");
		$node['publisher'] = mysql_result($result , 0, "publisher");
		$node['authors'] = mysql_result($result, 0, "authors");
		$node['year_of_publication'] = mysql_result($result, 0, "year_of_publication");
		$node['bibtex'] = mysql_result($result, 0, "bibtex");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addBibliography Method
//------------------------------------------------------------------------------
	public function addBibliography($authors, $title, $publisher, $year_of_publication, $bibtex)
	{
		$title = mysql_real_escape_string($title);
		$publisher = mysql_real_escape_string($publisher);
		$authors = mysql_real_escape_string($authors);
		$year_of_publication = mysql_real_escape_string($year_of_publication);
		//$bibtex = mysql_real_escape_string($bibtex);
		$query = "INSERT INTO taxonomybrowser.bibliographies(title, authors, publisher, year_of_publication, bibtex)
		VALUES('$title',  '$authors',  '$publisher', '$year_of_publication',  '$bibtex')";

		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharacters Method
//------------------------------------------------------------------------------
	public function getCharacters()
	{
		$query = "SELECT character_id, character_group_id, character_type_id, unit_id, character_name, character_enums, information FROM taxonomybrowser.characters ORDER BY character_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}

		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['character_group_id'] = mysql_result($result ,$i, "character_group_id");
			$tmp['character_type_id'] = mysql_result($result ,$i, "character_type_id");
			$tmp['unit_id'] = mysql_result($result ,$i, "unit_id");
			$tmp['character_name'] = mysql_result($result ,$i, "character_name");
			$tmp['character_enums'] = mysql_result($result ,$i, "character_enums");
			$tmp['information'] = mysql_result($result ,$i, "information");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharactersWithAssociativeArray Method
//------------------------------------------------------------------------------
	public function getCharactersWithAssociativeArray()
	{
		$query = "SELECT character_id, character_group_id, character_type_id, unit_id, character_name, character_enums, information FROM taxonomybrowser.characters ORDER BY character_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}

		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			
			$tmp = array();
			$tmp['character_id'] = mysql_result($result ,$i, "character_id");
			$tmp['character_group_id'] = mysql_result($result ,$i, "character_group_id");
			$tmp['character_group_name'] = $this->getCharacterGroupName($tmp['character_group_id']);
			$tmp['character_type_id'] = mysql_result($result ,$i, "character_type_id");
			$tmp['character_type_name'] = $this->getCharactersTypeName($tmp['character_type_id']);
			$tmp['unit_id'] = mysql_result($result ,$i, "unit_id");
			$tmp['character_name'] = mysql_result($result ,$i, "character_name");
			$tmp['character_enums'] = mysql_result($result ,$i, "character_enums");
			$tmp['information'] = mysql_result($result ,$i, "information");
			//$charArray = mysql_result($result ,$i, "character_id") => $tmp;
			//array_push($nodes, $charArray);
			$nodes[mysql_result($result ,$i, "character_id")] = $tmp;
		}
		
		mysql_free_result($result);
		
		//$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharacter Method
//------------------------------------------------------------------------------
	public function getCharacterEnums($character_id)
	{
		$node = $this->getCharacter($character_id);
		
		$value = $node['character_enums'];
		
		$separator = ',';
		$arr = explode($separator, $value);
		
		return $arr;
		
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharacter Method
//------------------------------------------------------------------------------
	public function getCharacter($character_id)
	{
		$character_id = mysql_real_escape_string($character_id);
		$query = "SELECT character_id, character_group_id, character_type_id, unit_id, character_name, character_enums, information FROM taxonomybrowser.characters WHERE character_id = '$character_id'";
		
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['character_id'] = '';
		$node['character_group_id'] = '';
		$node['character_type_id'] = '';
		$node['unit_id'] = '';
		$node['character_name'] = '';
		$node['character_enums'] = '';
		$node['information'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			return $node;
		}
		
		$node['character_id'] = mysql_result($result, 0, "character_id");
		$node['character_group_id'] = mysql_result($result, 0, "character_group_id");
		$node['character_type_id'] = mysql_result($result, 0, "character_type_id");
		$node['unit_id'] = mysql_result($result, 0, "unit_id");
		$node['character_name'] = mysql_result($result, 0, "character_name");
		$node['character_enums'] = mysql_result($result, 0, "character_enums");
		$node['information'] = mysql_result($result, 0, "information");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharactersTypeName Method
//------------------------------------------------------------------------------
	public function getCharactersTypeName($character_type_id)
	{
		$character_type_id = mysql_real_escape_string($character_type_id);
		$query = "SELECT character_type_name FROM taxonomybrowser.characterstype WHERE character_type_id = '$character_type_id'";
		$result = mysql_query($query, $this->Connection);

		$character_type_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $character_type_name;
		}
		
		$character_type_name = mysql_result($result, 0, "character_type_name");
		
		mysql_free_result($result);
		
		return $character_type_name;	
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharactersTypes Method
//------------------------------------------------------------------------------
	public function getCharactersTypes()
	{
		$query = "SELECT character_type_id, character_type_name FROM taxonomybrowser.characterstype ORDER BY character_type_id";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['character_type_id'] = mysql_result($result ,$i, "character_type_id");
			$tmp['character_type_name'] = mysql_result($result ,$i, "character_type_name");
			array_push($nodes, $tmp);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model addCharacter Method
//------------------------------------------------------------------------------
	public function addCharacter($character_name, $information, $character_group_id, $character_type_id, $unit_id, $character_enums)
	{
		$character_name = mysql_real_escape_string($character_name);
		$character_group_id = mysql_real_escape_string($character_group_id);
		$unit_id = mysql_real_escape_string($unit_id);
		$character_type_id = mysql_real_escape_string($character_type_id);
		$character_enums = mysql_real_escape_string($character_enums);
		
		$query = '';
		if(isPhysicalUnitField($character_type_id))
		{
			$query = "INSERT INTO taxonomybrowser.characters(character_name, character_group_id, unit_id, character_type_id, information)
			VALUES('$character_name', '$character_group_id', '$unit_id', '$character_type_id', '$information')";
		}
		else
		if(isEnumField($character_type_id))
		{
			$query = "INSERT INTO taxonomybrowser.characters(character_name, character_group_id, character_enums, character_type_id, information)
			VALUES('$character_name', '$character_group_id', '$character_enums', '$character_type_id', '$information')";
		}		
		else
		{
			$query = "INSERT INTO taxonomybrowser.characters(character_name, character_group_id, character_type_id, information)
			VALUES('$character_name', '$character_group_id', '$character_type_id', '$information')";
		}
		
		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		 return false;
	}		
//------------------------------------------------------------------------------
// TaxonomyBrowser Model updateCharacter Method
//------------------------------------------------------------------------------
	public function updateCharacter($character_id, $character_group_id, $character_name, $information, $character_type_id, $unit_id, $character_enums)
	{	
		$character_id = mysql_real_escape_string($character_id);
		$character_group_id = mysql_real_escape_string($character_group_id);
		$character_name = mysql_real_escape_string($character_name);
		$unit_id = mysql_real_escape_string($unit_id);
		$character_type_id = mysql_real_escape_string($character_type_id);
		$character_enums = mysql_real_escape_string($character_enums);
				
		$query = '';
		if(isPhysicalUnitField($character_type_id))
		{
			$query = "UPDATE taxonomybrowser.characters
					SET character_id = '$character_id',
					character_group_id = '$character_group_id',
					character_name = '$character_name',
					information = '$information',
					unit_id = '$unit_id',
					character_enums = NULL,
					character_type_id = '$character_type_id'
					WHERE characters.character_id = '$character_id'";		
		}
		else
		if(isEnumField($character_type_id))
		{
			$query = "UPDATE taxonomybrowser.characters
					SET character_id = '$character_id',
					character_group_id = '$character_group_id',
					character_name = '$character_name',
					information = '$information',
					unit_id = NULL,
					character_enums = '$character_enums',
					character_type_id = '$character_type_id'
					WHERE characters.character_id = '$character_id'";			
		}
		else
		{
			$query = "UPDATE taxonomybrowser.characters
					SET character_id = '$character_id',
					character_group_id = '$character_group_id',
					character_name = '$character_name',
					information = '$information',
					unit_id = NULL,
					character_enums = NULL,
					character_type_id = '$character_type_id'
					WHERE characters.character_id = '$character_id'";			
		}


		$result = mysql_query($query, $this->Connection);
		
		if($result)
		{
			return true;
		}
		 
		return false;
	}
	
	public function getFirstCharacter(&$ok)
	{
		$ok = true;
		
		$cg = $this->getCharactersGroup();
		$firstCharacterGroupId = $cg[0]['character_group_id'];
		
		$query = "SELECT character_id, character_group_id, character_type_id, unit_id, character_name, information FROM taxonomybrowser.characters WHERE character_group_id = '$firstCharacterGroupId' ORDER BY character_name LIMIT 1";
		$result = mysql_query($query, $this->Connection);
		$node = array();
		$node['character_id'] = '';
		$node['character_group_id'] = '';
		$node['character_type_id'] = '';
		$node['unit_id'] = '';
		$node['character_name'] = '';
		$node['information'] = '';
		
		if(mysql_num_rows($result) == 0)
		{
			$ok = false;
			return $node;
		}
		
		$node['character_id'] = mysql_result($result, 0, "character_id");
		$node['character_group_id'] = mysql_result($result, 0, "character_group_id");
		$node['character_type_id'] = mysql_result($result, 0, "character_type_id");
		$node['unit_id'] = mysql_result($result, 0, "unit_id");
		$node['character_name'] = mysql_result($result, 0, "character_name");
		$node['information'] = mysql_result($result, 0, "character_name");
		
		mysql_free_result($result);
		
		$node = stripslashesDeep($node);

		return $node;
	}	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model removeCharacter Method
//------------------------------------------------------------------------------
	public function removeCharacter($character_id)
	{	

		$character_id = mysql_real_escape_string($character_id);
		$query = "DELETE FROM taxonomybrowser.characters WHERE characters.character_id = '$character_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			return true;
		}		
		return false;
	}
	
	public function removeCharacterFromAllTables($character_id)
	{	

		$character_id = mysql_real_escape_string($character_id);
		$query = "DELETE FROM taxonomybrowser.characters WHERE characters.character_id = '$character_id'";
		$result = mysql_query($query, $this->Connection);
		if($result)
		{
			$query2 = "DELETE FROM taxonomybrowser.characterstaxonomy WHERE character_id = '$character_id'";
			$result2 = mysql_query($query2, $this->Connection);
			
			if($result2)
			{
				$query3 = "DELETE FROM taxonomybrowser.measures WHERE character_id = '$character_id'";
				$result3 = mysql_query($query3, $this->Connection);
				
				if($result3)
				{
					return true;
				}
				
				return false;
			}
			
			return false;
			
		}			
		return false;
	}
	
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharactersGroup Method
//------------------------------------------------------------------------------
	public function getCharactersGroup()
	{
		$query = "SELECT character_group_id, character_group_name FROM taxonomybrowser.charactersgroup ORDER BY character_group_name";
		$result = mysql_query($query, $this->Connection);
		$nodes = array();
		if(mysql_num_rows($result) == 0)
		{
			return $nodes;
		}
		
		$none = array();
		
		for($i = 0; $i < mysql_num_rows($result); ++$i)
		{
			$tmp = array();
			$tmp['character_group_id'] = mysql_result($result ,$i, "character_group_id");
			$tmp['character_group_name'] = mysql_result($result ,$i, "character_group_name");
			
			if(checkIfCharacterGroupIsNone($tmp))
			{
				$none = $tmp;
				continue;
			}
			
			array_push($nodes, $tmp);
		}
		
		if(!empty($none))
		{
			$nodes_front = array();
			array_push($nodes_front, $none);
			$nodes = array_merge($nodes_front, $nodes);
		}
		
		mysql_free_result($result);
		
		$nodes = stripslashesDeep($nodes);
		
		return $nodes;
	}
//------------------------------------------------------------------------------
// TaxonomyBrowser Model getCharacterGroupName Method
//------------------------------------------------------------------------------
	public function getCharacterGroupName($character_group_id)
	{
		$character_group_id = mysql_real_escape_string($character_group_id);
		$query = "SELECT character_group_name FROM taxonomybrowser.charactersgroup WHERE character_group_id = '$character_group_id'";
		$result = mysql_query($query, $this->Connection);

		$quantity_name = '';
		if(mysql_num_rows($result) == 0)
		{
			return $quantity_name;
		}
		
		$quantity_name = mysql_result($result, 0, "character_group_name");
		
		mysql_free_result($result);
		
		return $quantity_name;	
	}
//------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
?>
