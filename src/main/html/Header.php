<?php
namespace RnctAdmin\Main;

class Header extends Database {
    private $dbArray;
    // set params
    function __construct($param=[]){
        $this->tables = $param['tables'];
        $this->css = $param['css'];
        $this->js = $param['js'];
        $this->conn = $param['conn'];
        $this->dbArray = $this->get_pages();
    }
    // get js to link
    private function get_js(){
        foreach ($this->js as $key => $value) {
            ?>
            <script src="<?php echo $value; ?>"></script>
            <?php
        }
    }
    // get css to link
    private function get_css(){
        foreach ($this->css as $key => $value) {
            ?>
            <link rel="stylesheet" href="<?php echo $value; ?>">
            <?php
        }
    }
    // get the page ass array from the url
    private function get_page_ass_array(){
        if (!isset($_GET)) {
            return false;
        }
        $links = [];
        foreach ($_GET as $key => $value) {
            array_push($links,$value);
        }
        if (count($_GET) == 0) {
            return false;
        }
        $links = array_reverse($links);
        $link = $links[0];
        $array = [];
        for ($i=0; $i < count($this->dbArray); $i++) {
            if ($this->dbArray[$i]['link'] == $link) {
                $array = $this->dbArray[$i];
                break;
            }
        }
        return $array;
    }
    // get dynamic meta tags
    private function get_meta(){
        // get the page requested
        $page = $this->get_page_ass_array();
        ?>
        <base href="/">
        <title><?php echo $page['title']; ?></title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <meta name="description" content="<?php echo $page['descri']; ?>">
        <meta name="keywords" content="<?php echo $page['keywords']; ?>">
        <?php
    }
    // parse html
    public function parse(){
        ?>
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
            <head>
                <?php
                $this->get_meta();
                $this->get_css();
                $this->get_js();
                ?>
            </head>
            <body class="c-app">
        <?php
    }
}
