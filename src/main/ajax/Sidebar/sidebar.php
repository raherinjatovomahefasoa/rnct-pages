<?php
namespace RnctAdmin\Main;

class Sidebar extends Database {
    private $command;
    private $commands = [
        'get_data',
        'update_settings',
        'update_nav'
    ];
    function __construct($param){
        $this->conn = $param['conn'];
        $this->tables = $param['tables'];
        $this->execute_command();
        return;
    }
    // execute the command
    private function execute_command(){
        $this->get_command();
        // get data
        if ($this->command == $this->commands[0]) {
            // name of the mysqli table row
            $name = "rnct_sidebar";
            $result = $this->get_settings($name);
            $json = json_decode($result,true);
            $imgJson = $this->get_image($json['logo']);
            $json['logo'] = json_decode($imgJson,true);
            $menu = $this->get_menus();
            $array = [
                "settings" => $json,
                "menus" => $menu
            ];
            echo json_encode($array);
            return;
        }
        // update settings
        if ($this->command == $this->commands[1]) {
            $name = "rnct_sidebar";
            $result = $this->get_settings($name);
            $result = json_decode($result, true);
            $json = $_POST['json'];
            $json = json_decode($json, true);
            $json = $this->update_ass_array($result,$json);
            $json = json_encode($json);
            echo $json;
            $this->update_settings($name,$json);
        }
        // update nav
        if ($this->command == $this->commands[2]) {
            $name = "rnct_sidebar";
            $result = $this->get_settings($name);
            $result = json_decode($result, true);
            $json = $_POST['json'];
            $json = json_decode($json, true);
            $result["nav"] = $json;
            $json = json_encode($result);
            $this->update_settings($name,$json);
        }
    }
    // get the command to execute
    private function get_command(){
        if (!isset($_POST['command'])) {
            die("No command received, no result");
        }
        $this->command = $_POST['command'];
    }
}
