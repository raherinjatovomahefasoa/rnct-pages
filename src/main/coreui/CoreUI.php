<?php
namespace RnctAdmin\Main;

class CoreUI extends Database {
    function __construct($param){
        $this->tables = $param['tables'];
        $this->conn = $param['conn'];
    }
    private function get_structured_link($page){
        $links = [];
        array_push($links,$page['link']);
        $links = $this->get_cat($links,$page);
        $links = array_reverse($links);
        $link = "";
        for ($i=0; $i < count($links); $i++) {
            $link .= "/" . $links[$i];
        }
        return $link;
    }
    private function get_cat($links,$page){
        if ($page['category'] != "") {
            $category = $this->get_page_ass_array($page['category']);
            array_push($links,$category['link']);
            $links = $this->get_cat($links,$category);
        }
        return $links;
    }
    private function get_page_ass_array($page_id){
        $pages = $this->get_pages();
        $page = [];
        for ($i=0; $i < count($pages); $i++) {
            if ($page_id == $pages[$i]['id']) {
                $page = $pages[$i];
                break;
            }
        }
        return $page;
    }
    private function menuItem($menu){
        if ($menu['type'] == "page") {
            $page = $this->get_page_ass_array($menu['page_id']);
            $link = $this->get_structured_link($page);
            $icon = $page['icon'];
            $text = $menu['link_text'];
            $target = '';
        } else {
            $link = $menu['link'];
            $icon = $menu['icon'];
            $text = $menu['link_text'];
            $target = 'target="_blank"';
        }
        if (count($menu['sub']) > 0) {
            ?>
            <li class="c-sidebar-nav-dropdown">
                <a class="c-sidebar-nav-dropdown-toggle" href="javascript:void(0)">
                <i class="<?php echo $icon; ?> c-sidebar-nav-icon"></i>
                <?php echo $text; ?>
                </a>
                <ul class="c-sidebar-nav-dropdown-items">
                    <?php
                    $sub = $menu['sub'];
                    for ($i=0; $i < count($sub); $i++) {
                        $this->menuItem($sub[$i]);
                    }
                    ?>
                </ul>
            </li>
            <?php
            return;
        }
        ?>
        <li class="c-sidebar-nav-item">
            <a <?php echo $target; ?> class="c-sidebar-nav-link" href="<?php echo $link; ?>">
            <i class="<?php echo $icon; ?> c-sidebar-nav-icon"></i>
            <?php echo $text; ?>
            </a>
        </li>
        <?php
    }
    public function get_sidebar(){
        $name = "rnct_sidebar";
        $json = $this->get_settings($name);
        $array = json_decode($json,true);
        $nav = $array['nav'];
        for ($i=0; $i < count($nav); $i++) {
            $menu_id = $nav[$i]['menu_id'];
            $title = $nav[$i]['title'];
            $this->get_menu($menu_id ,$title);
        }
    }
    public function get_menu($str,$title){
        $name = $str;
        $menus = $this->get_menus();
        $menu = [];
        for ($i=0; $i < count($menus); $i++) {
            if ($menus[$i]["menu_id"] == $name) {
                $menu = $menus[$i]['data'];
                break;
            }
        }
        ?>
        <li class="c-sidebar-nav-title"><?php echo $title ?></li>
        <?php
        for ($i=0; $i < count($menu); $i++) {
            $this->menuItem($menu[$i]);
        }
    }
}
