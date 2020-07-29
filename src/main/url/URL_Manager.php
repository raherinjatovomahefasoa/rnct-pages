<?php
namespace RnctAdmin\Main;

class Url_Manager extends Database {
    protected $dbArray;
    function __construct($param=[]){
        $this->tables = $param['tables'];
        $this->css = $param['css'];
        $this->js = $param['js'];
        $this->conn = $param['conn'];
        $this->dbArray = $this->get_pages();
    }
    public function is_aminpanel_url(){
        $links = $this->get_links_array();
        if ($links == []) {
            return false;
        }
        $array = $this->url_ass_array($links[0]);
        if ($array["type"] == 'protected') {
            return true;
        }
        return false;
    }
    public function url_validate(){
        $links = $this->get_links_array();
        // is no GET link then true
        if ($links == []) {
            return true;
        }
        // check is all links exists
        $db = $this->dbArray;
        $status = true;
        for ($i=0; $i < count($links); $i++) {
            if (!$this->url_exists($links[$i])) {
                $status = false;
                break;
            }
        }
        if (!$status) {
            return $status;
        }
        // check the link structure
        $status = $this->is_structured_url($links);
        return $status;
    }
    // check the structure of the link
    private function is_structured_url($links){
        // check if link has category if yes then false
        if (count($links) == 1) {
            $first = $this->url_ass_array($links[0]);
            if ($first["category"] != "") {
                return false;
            }
            return true;
        }
        // check the link structure if maches database structure
        $orderLink = array_reverse($links);
        $result = true;
        for ($i=0; $i < count($orderLink); $i++) {
            $first = $this->url_ass_array($orderLink[$i]);
            if (isset($orderLink[1+$i])) {
                $second = $this->url_ass_array($orderLink[1+$i]);
                if ($first["category"] != $second["id"]) {
                    $result = false;
                    break;
                }
            }
        }
        return $result;
    }
    // get link ass array
    private function url_ass_array($link){
        $db = $this->dbArray;
        $result = false;
        for ($i=0; $i < count($db) ; $i++) {
            if ($link == $db[$i]['link']) {
                $result = $db[$i];
                break;
            }
        }
        return $result;
    }
    // check the existance of the link
    private function url_exists($link){
        $db = $this->dbArray;
        $result = false;
        for ($i=0; $i < count($db) ; $i++) {
            if ($link == $db[$i]['link']) {
                $result = true;
                break;
            }
        }
        return $result;
    }
    // get the $_get data array
    private function get_links_array(){
        $links = [];
        if (isset($_GET)) {
            foreach ($_GET as $key => $value) {
                array_push($links, $value);
            }
        }
        return $links;
    }
}
