<?php
namespace RnctAdmin\Main;

class RnctPages extends Database {
    private $command;
    private $commands = [
        'get_data',
        'create_page',
        'update_page',
        'delete_page'
    ];
    function __construct($param){
        $this->conn = $param['conn'];
        $this->tables = $param['tables'];
        $this->folders = $param['folders'];
        $this->execute_command();
    }
    // execute the command
    private function execute_command(){
        $this->get_command();
        // get data
        if ($this->command == $this->commands[0]) {
            $sql = [];
            $json = $this->get_pages_json();
            $json = json_decode($json,true);
            $sql["pageDb"] = $json;
            echo json_encode($sql);
            return;
        }
        // create
        if ($this->command == $this->commands[1]) {
            $page_id = uniqid('page_');
            $options = ["public","private","protected"];
            $json = json_decode($_POST['json'],true);
            $json["date"] = (int) date("U");
            $json["id"] = $page_id;
            $json["type"] = $options[(int)$json['type']];
            $data = json_encode($json);
            $data = mysqli_escape_string($this->conn, $data);
            $page_db = $this->tables['pages'];
            $sql = "INSERT INTO $page_db (page_id,data) VALUES ('$page_id','$data');";
            $this->query($sql);
            $json['website'] = $this->domain_name() . " &gt; ";
            $json['sort'] = $json['date'];
            $json['date'] = date("M d, Y - ",$json['date']);
            $json['descri_full'] = $json['descri'];
            $json['descri'] = $this->str_wrap($json['descri'], 160);
            $json['select'] = $json['category'];
            $json['category'] = $this->getPageLink($json['id']);
            echo json_encode($json);
            $folder = realpath($this->folders['pages']);
            $handle = fopen("$folder/$json[link].php", "w");
            fclose($handle);
        }
        if ($this->command == $this->commands[2]) {
            $page_db = $this->tables['pages'];
            $options = ["public","private","protected"];
            $json = json_decode($_POST['json'],true);
            $json['date'] = date("U");
            $json["type"] = $options[(int)$json['type']];
            $sql = "SELECT * FROM $page_db WHERE page_id = '$json[id]';";
            $result = $this->query($sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $oldJson = json_decode($row['data'],true);
            }
            $newJson1 = $this->update_ass_array($oldJson,$json);
            $newJson = json_encode($newJson1);
            $newJson = mysqli_escape_string($this->conn, $newJson);
            $sql = "UPDATE $page_db SET data = '$newJson' WHERE page_id = '$json[id]';";
            $this->query($sql);
            $link = $oldJson['link'];
            $folder = realpath($this->folders['pages']);
            if (!file_exists("$folder/$link.php")) {
                $handle = fopen("$folder/$newJson1[link].php", "w");
                fclose($handle);
            } else {
                rename("$folder/$oldJson[link].php","$folder/$newJson1[link].php");
            }
        }
        // delete
        if ($this->command == $this->commands[3]) {
            $page_db = $this->tables['pages'];
            $json = json_decode($_POST['json'],true);
            $id = $json["id"];
            $sql = "DELETE FROM $page_db WHERE page_id = '$id';";
            $this->query($sql);
            $sql = "SELECT * FROM $page_db;";
            $result = $this->query($sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $updateId = $row['page_id'];
                $data = json_decode($row['data'],true);
                if ($data['category'] == $id) {
                    $data['category'] = "";
                }
                $data = json_encode($data);
                $data = mysqli_escape_string($this->conn, $data);
                $sql_1 = "UPDATE $page_db SET data = '$data' WHERE page_id = '$updateId';";
                $this->query($sql_1);
            }
            $folder = realpath($this->folders['pages']);
            $filetodelete = "$folder/$json[link].php";
            if ($filetodelete) {
                unlink($filetodelete);
            }
        }
    }
    protected function get_pages_json(){
        $table = $this->tables['pages'];
        $sql = "SELECT * FROM $table;";
        $result = $this->query($sql);
        $pages = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $json = json_decode($row['data'],true);
            $json['select'] = $json['category'];
            $json['category'] = $this->getPageLink($json['id']);
            $json['website'] = $this->domain_name() . " &gt; ";
            $json['sort'] = (int) $json['date'];
            $json['date'] = date("M d, Y - ",$json['date']);
            $json['descri_full'] = $json['descri'];
            $json['descri'] = $this->str_wrap($json['descri'], 160);
            array_push($pages,$json);
        }
        return json_encode($pages);
    }
    // rnct pages
    protected function str_wrap($str,$len,$break="..."){
        if (strlen($str) > 160) {
            return substr($str, 0, 160) . $break;
        } else {
            return $str;
        }
    }
    protected function getPageLink($id){
        $page_db = $this->tables['pages'];
        $sql = "SELECT * FROM $page_db;";
        $result = $this->query($sql);
        $datas = [];
        $link = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $json = json_decode($row['data'],true);
            array_push($datas,$json);
        }
        for ($i=0; $i < count($datas); $i++) {
            if ($datas[$i]['id'] == $id) {
                $page = $datas[$i];
                $category = $page['category'];
                while ($category != "") {
                    for ($y=0; $y < count($datas); $y++) {
                        if ($datas[$y]['id'] == $category) {
                            array_unshift($link,$datas[$y]['link']);
                            $category = $datas[$y]['category'];
                            break;
                        }
                    }
                }
                break;
            }
        }
        $str = "";
        for ($i=0; $i < count($link); $i++) {
            $gt = " &gt ";
            $str .=  $link[$i] . $gt;
        }
        return $str;
    }
    // get the command to execute
    private function get_command(){
        if (!isset($_POST['command'])) {
            die("No command received, no result");
        }
        $this->command = $_POST['command'];
    }
}
