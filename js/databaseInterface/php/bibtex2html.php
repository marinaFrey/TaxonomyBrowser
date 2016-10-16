<?php
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *        *       *     *   *    BibTeX 2 HTML    *   *     *       *          *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 * Author: Andreas Classen <www.classen.be> - Version 20090107                 *
 *                                                                             *
 * This script is a reduced version of a script written by Johannes Knabe:     *
 * <jknabe@uni-osnabrueck.de>, found at http://bibscript.panmental.de/.  (Page *
 * consulted in November 2006, version used marked as June/July 2005 version.) *
 *                                                                             *
 * The objective of the original script by Knabe was to enable the management  *
 * of references, including XML and BibTeX export.  The objective of this      *
 * script, however, is only to display the BibTeX entries contained in a given *
 * file.                                                                       *
 *                                                                             *
 * I took out the BibTeX formatting part of the original script and wrote      *
 * a parser to extract individual BibTeX entries of a file.                    *
 *                                                                             *
 *                                                                             *
 *                                                                             *
 * How to use?                                                                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * All you need to do in order to include the script in your page is to make   *
 * the following function calls:                                               *
 * <?php                                                                       *
 *     require_once('./bibtex2html.php');                                      *
 *     bibfile2html('path/to/your/bibtex/file');                               *
 * ?>                                                                          *
 *                                                                             *
 *                                                                             *
 * Advanced Parameters                                                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * - $filename      is the path to the bib file that is to be displayed.       *
 * - $displayTypes  is an associative array specifying which bibtex entrtypes  *
 *                  you want to list and in which order.  The key is the       *
 *                  bibtex entry type, and the value is what is displayed as   *
 *                  a group title.  Only entries whose type is among those in  *
 *                  this array will be shown,  except if you use the special   *
 *                  key "_unknown", which acts  as a sink for those where the  *
 *                  key could not be found.  If you leave the parameter empty, *
 *                  there is a default with all common bibtex types and their  *
 *                  names in english.                                          *
 * - $groupType     A boolean indicating whether entries shoud be grouped by   *
 *                  type.  Default is true.                                    *
 * - $groupYear     Same for the year.  Default is true.                       *
 *                                                                             *
 *                                                                             *
 * Formatting                                                                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The script produces an ordered list (<ol>), and if grouping is activated,   *
 * it will use <h2> for first-level titles and <h3> for second-level titles.   *
 *                                                                             *
 * You can then use CSS to format these fields.  Note that, if you already use *
 * <h2> somewhere else on your page, and you want the <h2>'s produced by this  *
 * script to look different, you can simply use conditional CSS.               *
 *                                                                             *
 *                                                                             *
 * Special BibTeX fields                                                       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This script interprets several non-standard BibTeX fields:                  *
 *  - url: The content of this field is displayed as a "more..." link.         *
 *  - webpdf: This is assumed to be a link to the pdf file of the given        *
 *    publication (displayed as "pdf...").                                     *
 *  - publisherurl: The url of the publisher (displayed as "publisher...").    *
 *  - citeseerurl: The citeseer url (displayed as "citeseer...").              *
 *  - doi: This is suppsed to be the ACM doi url (displayed as "doi...").      *
 *                                                                             *
 * If you use the JabRef BibTeX manager (jabref.sourceforge.net), most of the  *
 * above fields are available as default.  You can add custom fields by        *
 * choosing "Customize entry types" from the "Options" menu.                   *
 *                                                                             *
 * Note that the script does not interpret BibTeX strings (abbreviations),     *
 * crossrefs or similar things, maybe I'll add this one time. In the meantime, *
 * a more comprehensive BibTeX parser exists at bibliophile.sourceforge.net.   *
 *                                                                             *
 *                                                                             *
 * License                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Feel free to use this script wherever you want to, there are no speicific   *
 * licence restrictions.                                                       *
 *                                                                             *
 * I do not guarantee the correctness of the script, use it at your own risk!  *
 * If you detect errors in the presentation of a given entry, you can send me  *
 * a desciption of the error (this is: the BibTeX entry, the output of this    *
 * script and the output how it should look like), using the e-mail address    *
 * specified on www.classen.be (presumably <acs@info.fundp.ac.be>).            *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


function extractBib($what,$haystack){
	$delim1="{";$delim2="}";
	if(substr_count($haystack,$delim1)<3){
		$delim1="\"";$delim2="\"";
	}
	$ret="";
	while(($ret=="")&&($test=stristr($haystack,$what))){
		$haystack=trim(substr($haystack,strpos(strtoupper($haystack),strtoupper($what))-1));
		if($haystack!=$test){					//character before $what must be white-space
			$haystack=substr($test,strlen($what));
			continue;
		}
		$haystack=trim(substr($test,strlen($what)));
		if(strpos($haystack,"=")==0){ //first non-white-space character must be =
			$cnt=0;
			$startpos=strpos($haystack,$delim1);
			if(strpos($haystack,",")<$startpos){
				$ret=substr($haystack,1,strpos($haystack,",")-1);
				return trim(str_replace("\\","",str_replace($delim2,"",str_replace($delim1,"",$ret))));
			}
			$endpos=$startpos;
			while($cnt<strlen($haystack)){
				if($haystack[$endpos]==$delim1) $cnt++;
				if($haystack[$endpos]==$delim2) $cnt--;
				if($cnt==0){
					$ret=substr($haystack,$startpos+1,$endpos-$startpos-1);
					return trim(str_replace("\\","",str_replace($delim2,"",str_replace($delim1,"",$ret))));
				}
				$endpos++;
			}
		}
		$haystack=$test;
	}
	return trim($ret); //might be "" !
}

function extractBibType($haystack){
	$res=trim($haystack);
	$i=0;$h=0;
	$ct=0;
	while($i<strlen($haystack)){
		if(($ct==1)&&($res[$i]=="{")) $ct=2;
		if(($ct==0)&&($res[$i]=="@")){
			$ct=1;
			$h=$i;
		}
		if($ct==2) return substr($res,$h+1,$i-$h-1);
		$i++;
	}
	return "";
}

function extractBibName($haystack){
	$posi=strpos($haystack,"{")+1;
	$res=substr($haystack,$posi,strpos($haystack,",")-$posi);
	return $res;
}

//removes all but one "and" between authors and exchanges parts of the author's names to make for a leading surname
function shortenAuthors($author){
	$editorStr=", ed.";
	$suffix="";
	if(strpos($author,", ed.")){
		$suffix=$editorStr;
		$author=str_replace(", ed.","",$author);
	}
	if(strpos($author,", eds.")){
		$suffix=$editorStr;
		$author=str_replace(", eds.","",$author);
	}
	if(strpos($author,", edt.")){
		$suffix=$editorStr;
		$author=str_replace(", edt.","",$author);
	}
	if(strpos($author," ed.")){
		$suffix=$editorStr;
		$author=str_replace(" ed.","",$author);
	}
	if(strpos($author," eds.")){
		$suffix=$editorStr;
		$author=str_replace(" eds.","",$author);
	}
	if(strpos($author," edt.")){
		$suffix=$editorStr;
		$author=str_replace(" edt.","",$author);
	}
	if(strpos($author,", editors")){
		$suffix=$editorStr;
		$author=str_replace(", editors","",$author);
	}
	if(strpos($author,", editor")){
		$suffix=$editorStr;
		$author=str_replace(", editor","",$author);
	}
	if(strpos($author," editors")){
		$suffix=$editorStr;
		$author=str_replace(" editors","",$author);
	}
	if(strpos($author," editor")){
		$suffix=$editorStr;
		$author=str_replace(" editor","",$author);
	}
	
	$tempdat=str_replace(array(" and	","	and	","	and ","\r\nand "," and\r\n")," and ",trim($author));
	
	//begin this is the surname / given name exchange
	$sepName=","; //maybe you like "" more?
	$authArr=explode(" and ",$tempdat);
	$i=0;
	while(is_Array($authArr)&&(sizeof($authArr)>$i)){
	$authArr[$i]=trim($authArr[$i]);
	// if(!strpos($authArr[$i],",")){
	
		//begin abbreviate fornames
		$aa=explode(" ",$authArr[$i]);
		if(!strpos($authArr[$i],",")){
			for($j=0;$j<sizeof($aa)-1;$j++)
				if((strlen($aa[$j])>2)&&(!strpos($aa[$j],".")))
					$aa[$j]=substr($aa[$j],0,1).".";
			}
		else{
			for($j=1;$j<sizeof($aa);$j++)
				if((strlen($aa[$j])>2)&&(!strpos($aa[$j],".")))
					$aa[$j]=substr($aa[$j],0,1).".";
			}
		$authArr[$i]=implode(" ",$aa);
		//end abbreviate fornames
		
		if(!strpos($authArr[$i],","))
			$authArr[$i]=strrchr($authArr[$i]," ")."$sepName ".substr($authArr[$i],0,strrpos($authArr[$i]," "));
		$i++;
	//	}else $i=9999;
	 }
	$tempdat=implode(" and ",$authArr);
	//end this is the surname / given name exchange
	
	$temppos=0;
	$lastpos=$temppos;
	while($lastpos=strpos($tempdat," and ",$temppos)){
		$temppos=$lastpos+1;
	}
	if($temppos>0) $tempdat[$temppos]="#";
	
	$tempdat=str_replace(" and ",", ",$tempdat);
	$tempdat=str_replace(" #nd "," and ",$tempdat);
	
	return $tempdat.$suffix;
}

/**
 * bibtex2html($texEntry):
 * Takes one BibTeX entry and formats it as a citation.  If the entry is not
 * valid, an empty string will be returned.
 * Author: Johannes Knabe, extended by Andreas Classen
 *
 */
function bibtex2html($texEntry){
	
	$ret=extractBib("text",$texEntry);
	if(trim($ret)==""){
		//begin there is no predefined text to show, we create some
		$author=extractBib("author",$texEntry);
		if($author=="") {
			$author=extractBib("editor",$texEntry);
			$author=$author.", ed.";
		}
		$ret=$ret.shortenAuthors($author);
		$year=extractBib("year",$texEntry);
		if($ret[strlen($ret)-1]!=".") $ret=$ret.".";
		$ret=$ret." ";
		$title=extractBib("title",$texEntry);
		
		$webpdf = extractBib("webpdf",$texEntry);
		if(trim($webpdf)!="") {
			$title = '<a href="'.$webpdf.'" >'.$title.'</a>';
		}
		
		if((trim($author)=="")||(trim($title)=="")) return "";
		$texType=strtolower(extractBibType($texEntry));
		if(($texType!="article")&&($texType!="inproceedings")) $ret=$ret."<i>$title</i>";
		else $ret=$ret.$title;
		if($title[strlen($title)-1]!=".") $ret=$ret.".";
		if($texType=="phdthesis"){
			$ret=$ret." Ph.D. Thesis";
			$school=extractBib("school",$texEntry);
			if(trim($school)!="") $ret=$ret.", ".$school;
			$addrs=extractBib("address",$texEntry);
			if(trim($addrs)!="") $ret=$ret.", ".$addrs;
			if(trim(strtolower($year))!="") $ret=$ret.", ".$year;
			$ret=$ret.".";
		}
		if($texType=="article"){
			$journ=extractBib("journal",$texEntry);
			if($journ=="") $journ=extractBib("book",$texEntry); //might be a book chapter...
			if(trim(strtolower($journ))!=""){
				$ret=$ret." In <i>".$journ."</i>";
				$vol=extractBib("volume",$texEntry);
				if(trim(strtolower($vol))!="") $ret=$ret.", ".$vol;
				$numb=extractBib("number",$texEntry);
				if(trim(strtolower($numb))!="") $ret=$ret." (".str_replace("--","-",$numb).")";
				$pages=extractBib("pages",$texEntry);
				if(trim(strtolower($pages))!="") $ret=$ret.": ".str_replace("--","-",$pages);
				if(trim(strtolower($year))!="") $ret=$ret.", ".$year;
				$ret=$ret.".";
			}
		}
		if($texType=="inproceedings"){
			$booktitle=extractBib("booktitle",$texEntry);
			if(trim(strtolower($booktitle))!=""){
				$ret=$ret." In <i>".$booktitle."</i>";
				$pages=extractBib("pages",$texEntry);
				if(trim(strtolower($pages))!="") $ret=$ret.", pages ".str_replace("--","-",$pages);
				$publisher=extractBib("publisher",$texEntry);
				if(trim(strtolower($publisher))!="") $ret=$ret.", ".$publisher;
				if(trim(strtolower($year))!="") $ret=$ret.", ".$year;
				$ret=$ret.".";
			}
		}
		if($texType=="book"){
			$publisher=extractBib("publisher",$texEntry);
			if(trim(strtolower($publisher))!="") $ret=$ret." ".$publisher;
			$pubaddress=extractBib("address",$texEntry);
			if(trim(strtolower($pubaddress))!="") $ret=$ret.", ".$pubaddress;
			if(trim(strtolower($year))!="") $ret=$ret.", ".$year;
			$ret=$ret.".";
		}
		if($texType=="unpublished"){
			$note = extractBib("note", $texEntry);
			if($note <> "") $ret .= '&nbsp;&nbsp;'.$note;
		}
		
		$webcs = extractBib("citeseerurl",$texEntry);
		if(trim($webcs)!="") {
			$ret .= ' <a href="'.$webcs.'" target="_blank">citeseer..</a>&nbsp;';
		}
		
		$webdoi = extractBib("doi",$texEntry);
		if(trim($webdoi)!="") {
			$ret .= ' <a href="'.$webdoi.'" target="_blank">doi..</a>&nbsp;';
		}
		
		$weblink = extractBib("url",$texEntry);
		if(trim($weblink)!="") {
			$ret .= ' <a href="'.$weblink.'" target="_blank">more..</a>&nbsp;';
		}
		
		if(trim($webpdf)!="") {
			$ret .= ' <a href="'.$webpdf.'" >pdf..</a>&nbsp;';
		}

		$publisherurl = extractBib("publisherurl",$texEntry);
		if(trim($publisherurl)!="") {
			$ret .= ' <a href="'.$publisherurl.'" target="_blank">publisher..</a>&nbsp;';
		}
		
	}//end there is no predefined text to show, we create some
		
	
	return $ret;
}

/**
 * bibfile2html($filename):
 * Returns an enumerated list of all entries contained in a BibTeX file.  
 * Comments and encoding notes are ignored.
 * 
 * For documentation see top of the script.
 * 
 * Author: Andreas Classen
 */
function bibfile2html($filename, $displayTypes = array(	 'article' => 'Journal Papers',
														 'book' => 'Books',
														 'booklet' => 'Booklets',
														 'conference' => 'Conferences',
														 'inbook' => 'Book chapters',
														 'incollection' => 'Collections',
														 'inproceedings' => 'Conference Papers',
														 'manual' => 'Manuals',
														 'mastersthesis' => 'MSc Theses',
														 'misc' => 'Misc',
														 'phdthesis' => 'PhD Theses',
														 'proceedings' => 'Conference Proceedings',
														 'techreport' => 'Technical Reports',
														 'unpublished' => 'Unpublished',
														 '_unknown' => 'Other'),
								$groupType = true, $groupYear = true) {
	
	
	$fileContent = file($filename);
	
	$entries = array();
	$i = 0;
	$j = 0;
	$len = count($fileContent);
	for($i = 0; $i < $len; $i++) {
		if(substr($fileContent[$i], 0, 1) == '@') {
			// Start of new entry
			$type = strtolower(substr($fileContent[$i], 1, strpos($fileContent[$i], '{') - 1));
			$bibEntry = '';
			$eoe = false;
			for($l = $i; $l < $len && !$eoe; $l++) {
				$bibEntry .= ' '.$fileContent[$l];
				$eoe = substr($fileContent[$l], 0, 1) == '}';
			}
			$i = $l-1;
			
			if(!array_key_exists($type, $displayTypes)) $type = '_unknown';
			
			$bibEntry = trim($bibEntry);
			$year = extractBib("year",$bibEntry);
			$text = bibtex2html($bibEntry);
			
			if($year != '' && $text != '') {
				if($groupType) $entries[$type][$year][$j] = $text;
				else $entries[$year][$j] = $text;
				$j++;
			}
		}
	} 
	
	$ret = '';
	$j = 1;
	if($groupType) {
		foreach($displayTypes as $type => $typeName) {
			if(isset($entries[$type])) {
				krsort($entries[$type]);
				$ret .= '<h2>'.$typeName.'</h2>';
				if(!$groupYear) $ret .= '<ol start="'.$j.'">';
				foreach($entries[$type] as $year => $yearEntries) {
					if($groupYear) {
						$ret .= '<h3>'.$year.'</h3>';
						$ret .= '<ol start="'.$j.'">';
					}
					foreach($yearEntries as $index => $text) {
						if(trim($text) != '') $ret .= '<li>'.$text.'</li>';
						$j++;
					}
					if($groupYear) $ret .= '</ol>';
				}	
				if(!$groupYear) $ret .= '</ol>';
			}
		}
	} else {	
		krsort($entries);
		if(!$groupYear) $ret .= '<ol start="'.$j.'">';
		foreach($entries as $year => $yearEntries) {
			if($groupYear) {
				$ret .= '<h2>'.$year.'</h2>';
				$ret .= '<ol start="'.$j.'">';
			}
			foreach($yearEntries as $index => $text) {
				if(trim($text) != '') $ret .= '<li>'.$text.'</li>';
				$j++;
			}
			if($groupYear) $ret .= '</ol>';
		}	
		if(!$groupYear) $ret .= '</ol>';
	}
	return $ret;
}

?>