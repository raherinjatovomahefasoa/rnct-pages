<?php
namespace RnctAdmin\Main;

class Footer extends Database {
    // set params
    function __construct($param=[]){
        $this->jslazy = $param['jslazy'];
        $this->conn = $param['conn'];
    }
    // get js to load right before the end body tab
    private function get_jslazy(){
        foreach ($this->jslazy as $key => $value) {
            ?>
            <script src="<?php echo $value; ?>"></script>
            <?php
        }
    }
    // parse html
    public function parse(){
        $this->get_jslazy();
      ?>    </body>
        </html>
        <?php
    }
}
