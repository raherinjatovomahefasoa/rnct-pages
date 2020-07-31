function RnctPages(target, _settings){
    let error;
    try {
        new Element();
    } catch (e) {
        console.error("rnct js module Not Found, link it from rnct-dit/js");
        error++;
    }
    if (error) {
        return false;
    }
    // set this to the var self
    let self = this;
    self.name = "Page Manager";
    self.version = "1.0.0";
    self.items = [];
    self.modal = [];
    self.typesDefault = 'public';
    self.types = ['private','protected'];
    self.module_name = "rnct_pages";
    // settings
    let value = {
        domain: window.location.origin + "/",
        phpAjax: "ajax.php",
        developerMode: false,
        trigger: null,
        asPanel: false,
        column_1: 8,
        pageList: null
    }
    // get user settings
    value = self._settings = updateAssArray(value,_settings);
    // init static HTML container
    init();
    // get mysqli database
    getsql({
        open: value.phpAjax,
        action: parseData,
        module_name: self.module_name
    })
    // triger after the sql data are received
    function parseData(jsonString){
        if (value.developerMode) {
            console.log(jsonString);
        }
        // pass sql database
        self.pageDb = JSON.parse(jsonString).pageDb;
        // reset all input
        let allInputs = [];
        for (var i = 0; i < self.inputs.length; i++) {
            allInputs.push(self.inputs[i].element);
        }
        resetAll(allInputs);
        // parse input select category options
        processOptions(self.inputs[1]);
        // parse pagelist after ajax received the database
        parsePageItems();
        // developerMode mode check
        developerMode();
    }
    // parse page items
    function parsePageItems(){
        // list container
        $(value.pageList).html("");
        // reset items array and selectedId
        self.items = [];
        self.selectedId = "";
        let listParent = new Element(value.pageList,{
            tag: "ul",
            classAttr: "list editbox-pages"
        });
        // show create tab
        self.Tabs[0].hideTab(1);
        $(self.Tabs[0].tabWrap +' a[href="#'+self.Tabs[0].tabs[0]+'"]').tab('show');
        // push all list into an array
        self.HTMLElement.push(listParent);
        // parse lists
        let json = self.pageDb;
        for (var i = 0; i < json.length; i++) {
            self.items.push(new PageItem(listParent.element,{
                descri: json[i].descri,
                title: json[i].title,
                date: json[i].date,
                link: json[i].link,
                category: json[i].select,
                page_id: json[i].id,
                select: getSelected,
                type: json[i].type
            }));
        }
    }
    // get the selected page item
    function getSelected(pageItem){
        // code to execute after the selection of item
        passDataToInputs(pageItem);
    }
    // parse data in library inputs when called
    function passDataToInputs(pageItem){
        // get the data json of the selected page
        let json = {};
        for (var i = 0; i < self.pageDb.length; i++) {
            if (self.pageDb[i].id == pageItem.page_id) {
                json = self.pageDb[i];
                break;
            }
        }
        // set input values
        selectedType(self.inputs[7],pageItem);
        processOptions(self.inputs[8],pageItem);
        self.selectedId = json.id;
        self.inputs[9].setValue(json.link);
        self.inputs[10].setValue(json.link_text);
        self.inputs[10].setIcon(json.icon);
        self.inputs[11].setValue(json.title);
        self.inputs[12].setValue(json.descri_full);
        self.inputs[13].setValue(json.keywords);
    }
    // function process selected type
    function selectedType(inputObj,pageItem){
        inputObj.selected(pageItem.type);
    }
    // ajax request script
    function requestScript(){
        $(document).ready(function(){
            // create options
            $(self.buttons[0].element).click(function(){
                // validate form
                if (!validateForm(0)) {
                    return;
                }
                // show loading spinner
                self.buttons[0].showSpinner();
                // 0 = get create option value as json
                let data = getValueAsJson(0);
                // send data
                ajaxRequest(data, {
                    open: self._settings.phpAjax,
                    command: "create_page",
                    module_name: self.module_name,
                    action: afterCreation
                })
                function afterCreation(str){
                    if (value.developerMode) {
                        console.log(str);
                    }
                    // get data and update everything and hide spinner by sending the inputobj in spinnerInput
                    getsql({
                        open: self._settings.phpAjax,
                        module_name: self.module_name,
                        action: parseData,
                        spinnerInput: self.buttons[0]
                    })
                }
            })
            // update options
            $(self.buttons[1].element).click(function(){
                // validate form
                if (!validateForm(1)) {
                    return;
                }
                // show loading spinner
                self.buttons[1].showSpinner();
                // 1 = get update option value as json
                let data = getValueAsJson(1);
                // send data
                ajaxRequest(data, {
                    open: self._settings.phpAjax,
                    command: "update_page",
                    module_name: self.module_name,
                    action: afterUpdate
                })
                function afterUpdate(str){
                    if (value.developerMode) {
                        console.log(str);
                    }
                    // get data and update everything and hide spinner by sending the inputobj in spinnerInput
                    getsql({
                        open: self._settings.phpAjax,
                        module_name: self.module_name,
                        action: parseData,
                        spinnerInput: self.buttons[1]
                    })
                }
            })
            // delete options
            $(self.buttons[2].element).click(function(){
                // 1 = get update option value as json
                let data = getValueAsJson(2);
                let modal = self.modal[0];
                // show confirm modal
                modal.settings({
                    title: "Warning!",
                    text: "Are you sure you want to permanently delete this page? This action is irreversible!",
                    button_1_text: "Yes",
                    button_2_text: "Cancel",
                    button_2_type: 'primary',
                    button_1_hide: false,
                    result: getModalResult
                })
                modal.show();
                // call at modal dismiss
                function getModalResult(result){
                    if (!result) {
                        return;
                    }
                    afterYesConfirm();
                }
                function afterYesConfirm(){
                    // show loading spinner
                    self.buttons[2].showSpinner();
                    // send data
                    ajaxRequest(data, {
                        open: self._settings.phpAjax,
                        command: "delete_page",
                        module_name: self.module_name,
                        action: afterDelete
                    })
                    // called after delete
                    function afterDelete(str){
                        if (value.developerMode) {
                            console.log(str);
                        }
                        // get data and update everything and hide spinner by sending the inputobj in spinnerInput
                        getsql({
                            open: self._settings.phpAjax,
                            module_name: self.module_name,
                            action: parseData,
                            spinnerInput: self.buttons[2]
                        })
                    }
                }
            })  // on click
        })// document ready
    }
    // confirm inputs
    // 0 = create, 1 = update
    function validateForm(choice){
        var options = ["create","update"];
        var option = options[choice];
        if (option == "create") {
            let inputToTest = [
                self.inputs[2].element,
                self.inputs[3].element,
                self.inputs[4].element,
                self.inputs[5].element
            ];
            if (isEmpty(inputToTest)) {
                return false;
            }
            if (!isLink(self.inputs[2].element)) {
                return false;
            }
            if (self.inputs[6].val() != "") {
                if (!isKeywords(self.inputs[6].element)) {
                    return false;
                }
            }
            // check if already exists
            let json = {
                select: getCategoryId(self.inputs[1]),
                link: self.inputs[2].val()
            };
            for (var i = 0; i < self.pageDb.length; i++) {
                if (self.pageDb[i].select == json.select && self.pageDb[i].link == json.link) {
                    self.modal[0].settings({
                        button_1_hide: true,
                        button_2_type: 'primary',
                        title: "Warning!",
                        text: "Please change your link or category because it already exists!"
                    });
                    self.modal[0].show();
                    return false;
                }
            }
            return true;
        } else if (option == 'update') {
            let inputToTest = [
                self.inputs[9].element,
                self.inputs[10].element,
                self.inputs[11].element,
                self.inputs[12].element
            ];
            if (isEmpty(inputToTest)) {
                return false;
            }
            if (!isLink(self.inputs[9].element)) {
                return false;
            }
            if (self.inputs[6].val() != "") {
                if (!isKeywords(self.inputs[13].element)) {
                    return false;
                }
            }
            // check if already exists
            let options = ["public","private","protected"];
            let json = {
                type: options[self.inputs[7].val()],
                select: getCategoryId(self.inputs[8]),
                link: self.inputs[9].val(),
                link_text: self.inputs[10].val(),
                icon: self.inputs[10].icon,
                title: self.inputs[11].val(),
                descri_full: self.inputs[12].val(),
                keywords: self.inputs[13].val()
            };
            let pageSelected = {};
            for (var i = 0; i < self.pageDb.length; i++) {
                if (self.pageDb[i].id == self.selectedId) {
                    oldJson = copyJson(self.pageDb[i]);
                    pageSelected = self.pageDb[i];
                    break;
                }
            }
            // compare json
            if (isSameJson(json, pageSelected)) {
                self.modal[0].settings({
                    button_1_hide: true,
                    button_2_type: 'primary',
                    title: "Warning!",
                    text: "Already saved, change something before saving!"
                });
                self.modal[0].show();
                return false;
            } else {
                return true;
            }
        }
    }
    // get all input values
    // 0 = create, 1 = update, 2 = delete
    function getValueAsJson(choice) {
        var options = ["create","update","delete"];
        var option = options[choice];
        var json = {};
        if (option == "create") {
            json.type = self.inputs[0].val();
            json.category = getCategoryId(self.inputs[1]);
            json.link = self.inputs[2].val();
            json.link_text = self.inputs[3].val();
            json.icon = self.inputs[3].icon;
            json.title = self.inputs[4].val();
            json.descri = self.inputs[5].val();
            json.keywords = self.inputs[6].val();
            return json;
        } else if (option == "update") {
            json.id = self.selectedId;
            json.type = self.inputs[7].val();
            json.category = getCategoryId(self.inputs[8]);
            json.link = self.inputs[9].val();
            json.link_text = self.inputs[10].val();
            json.icon = self.inputs[10].icon;
            json.title = self.inputs[11].val();
            json.descri = self.inputs[12].val();
            json.keywords = self.inputs[13].val();
            return json;
        } else if (option == "delete") {
            var jsonDb = {};
            json.id = self.selectedId;
            for (var i = 0; i < self.pageDb.length; i++) {
                if (self.pageDb[i].id == self.selectedId) {
                    jsonDb = self.pageDb[i];
                    break;
                }
            }
            json.link = jsonDb.link;
            return json;
        }
    }
    // get the page id of the selected category
    function getCategoryId(inputObj){
        var index = inputObj.val();
        var page_id = "";
        if (index == 0) {
            return page_id;
        } else {
            var optText = inputObj.element.children[index].innerHTML;
            optText = optText.replace(/[\/\.\.]/g,"");
            for (var i = 0; i < self.pageDb.length; i++) {
                if (self.pageDb[i].link == optText) {
                    page_id = self.pageDb[i].id;
                    break;
                }
            }
            return page_id;
        }
    }
    // set select input options with restricted options
    function processOptions(inputObj, pageItem=null){
        // option text
        let texts = [];
        let selected = "";
        if (pageItem == null) {
            for (var i = 0; i < self.pageDb.length; i++) {
                var text = "../"+ self.pageDb[i].link+"/";
                texts.push(text);
            }
        } else {
            restrictedId = pageItem.sublinks;
            restrictedId.push(pageItem.page_id);
            for (var i = 0; i < self.pageDb.length; i++) {
                var restrict = false;
                for (var j = 0;j < restrictedId.length; j++) {
                    if (self.pageDb[i].id == restrictedId[j]) {
                        restrict = true;
                        break;
                    }
                }
                if (self.pageDb[i].id == pageItem.category) {
                    var text = "../"+ self.pageDb[i].link+"/";
                    selected = text;
                }
                if (!restrict) {
                    var text = "../"+ self.pageDb[i].link+"/";
                    texts.push(text);
                }
            }
        }
        inputObj.setOptions(texts);
        inputObj.reset();
        if (selected != "") {
            inputObj.selected(selected);
        }
    }
    // trigger once and at the creation of the this object
    function init(){
        // parse static html
        staticHtml();
    }
    // parsing static html
    function staticHtml(){
        // set panel setting
        if (value.asPanel) {
            $(target).hide();
        } else {
            $(target).css({
                height: "550px"
            });
        }
        // html object array
        self.HTMLElement = [];
        self.Tabs = [];
        self.inputs = [];
        self.buttons = [];
        let htmlElement = self.HTMLElement;
        let tabObject = self.Tabs;
        let inputs = self.inputs;
        let buttons = self.buttons;
        // set the display
        let classString;
        if (value.asPanel) {
            classString = "editbox";
        } else {
            classString = "editbox-fluid";
        }
        // create and parse html tree
        let container = new Element(target,{
            classAttr: classString
        })
        htmlElement.push(container);
        let content = new Element(container.element,{
            classAttr:"editbox-content"
        });
        htmlElement.push(content);
        let modalItem = new ModalBox();
        self.modal.push(modalItem);
        let header = new Element(content.element,{classAttr:"editbox-header modal-header"});
        header.html('<h5 class="text-info">'+self.name+'</h5>');
        htmlElement.push(header);
        let close = new Element(header.element,{tag:"button",classAttr:"close"});
        close.html("×");
        let body = new Element(content.element,{classAttr:"editbox-body row"});
        htmlElement.push(body);
        // column one
        let column_1 = new Element(body.element,{classAttr:"col-md-"+value.column_1+" editbox-primary"});
        htmlElement.push(column_1);
        // column two
        let column_2 = new Element(body.element,{classAttr:"col-md-"+(12-value.column_1)+" editbox-secondary bg-light"});
        htmlElement.push(column_2);
        // header of column 1
        let formBox = new Element(column_1.element,{classAttr:"editbox-form form-row"});
        htmlElement.push(formBox);
        // body of column 1
        let galleryBox = new Element(column_1.element,{classAttr:"editbox-gallery"});
        htmlElement.push(galleryBox);
        // tab
        let tab = new Tab(column_2.element,{
            tabs: ["Create", "Library"]
        });
        tabObject.push(tab);
        // script for dynamism
        $(close.element).click(function(){
            if (value.asPanel) {
                $(target).hide();
            }
        });
        $(value.trigger).click(function(){
            if (value.asPanel) {
                $(target).show();
            }
        });
        // pass dymanic content container
        let formWrap = formBox.element;
        let listWrap = galleryBox.element;
        let tab_1Wrap = document.getElementById(tab.tabs[0]);
        let tab_2Wrap = document.getElementById(tab.tabs[1]);
        // hide tab two content
        self.Tabs[0].hideTab(1);
        // pass the list container to main value
        value.pageList = listWrap;
        // empty tabs
        tab_1Wrap.innerHTML = tab_2Wrap.innerHTML = "";
        // parse inputs
        // create tab
        inputs.push(new InputSelect(tab_1Wrap, {
            label: "Type",
            placeholder: self.typesDefault,
            options: self.types,
            help: "Choose the state of the page, leave it to 'Public' to make search engines index this page"
        }));
        inputs.push(new InputSelect(tab_1Wrap, {
            label: "Category",
            help: "Choose the location of your page",
            placeholder: value.domain
        }));
        let linkInput = new InputText(tab_1Wrap, {
            label: "Link",
            help: "Enter the link of your page. Don't use space but use '-' or '_' instead"
        });
        inputs.push(linkInput);
        linkInput.element.addEventListener('input', function(){
            this.value = this.value.trim().toLocaleLowerCase();
        })
        inputs.push(new InputText(tab_1Wrap, {
            label: "Link text",
            help: "Enter the text of your link and choose the icon for it",
            icon_picker: true
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Title",
            tag: 'textarea',
            help: "Write the title of the page, this is shown in the browser tab"
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Description",
            tag: 'textarea',
            help: "This is shown as the description of your page when indexed by search engines."
        }));
        inputs.push(new InputText(tab_1Wrap, {
            label: "Keywords",
            tag: 'textarea',
            help: "Used by search engines; add a comma and space to separate each Keywords and don't add comma at the end"
        }));
        buttons.push(new InputSubmit(tab_1Wrap, {
            text: "Create"
        }));
        // library tab
        inputs.push(new InputSelect(tab_2Wrap, {
            label: "Type",
            placeholder: self.typesDefault,
            options: self.types,
            help: "Choose the state of the page, leave it to 'Public' to make search engines index this page"
        }));
        inputs.push(new InputSelect(tab_2Wrap, {
            label: "Category",
            help: "Choose the location of your page",
            placeholder: value.domain
        }));
        linkInput = new InputText(tab_2Wrap, {
            label: "Link",
            help: "Enter the link of your page. Don't use space but use '-' or '_' instead"
        });
        inputs.push(linkInput);
        linkInput.element.addEventListener('input', function(){
            this.value = this.value.trim().toLocaleLowerCase();
        })
        inputs.push(new InputText(tab_2Wrap, {
            label: "Link text",
            help: "Enter the text of your link and choose the icon for it",
            icon_picker: true
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Title",
            tag: 'textarea',
            help: "Write the title of the page, this is shown in the browser tab"
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Description",
            tag: 'textarea',
            help: "This is shown as the description of your page when indexed by search engines."
        }));
        inputs.push(new InputText(tab_2Wrap, {
            label: "Keywords",
            tag: 'textarea',
            help: "Used by search engines; add a comma and space to separate each Keywords and don't add comma at the end"
        }));
        buttons.push(new InputSubmit(tab_2Wrap, {
            text: "Update",
            bg: "success",
            add_class: "mr-2"
        }));
        buttons.push(new InputSubmit(tab_2Wrap, {
            text: "Delete",
            bg: "danger"
        }));
        // call the processing function
        requestScript();
    }
    // page object
    function PageItem(target,_settings){
        // assing this to a variable
        var self_me = this;
        // settins
        let value = {
            title: "Test",
            descri: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: "",
            domain: window.location.origin,
            category: "",
            link: "test",
            page_id: "",
            input_id: randomId(),
            select: function(){},
            type: ''
        }
        // passing data
        value = updateAssArray(value, _settings);
        self_me.category = value.category;
        self_me.type = value.type;
        value.category = getAllCategory();
        // get sublink page id
        self_me.sublinks = getSublinks();
        // create the object html
        let list = new Element(target,{tag:'li'});
        let html = '<input id="'+value.input_id+'" class="checkboxes editbox-checkbox" type="checkbox" title="Select"><div class="text-secondary"><cite><small class="text-g-link"><span class="website_link">'+value.domain+' > </span><span class="text-muted category">'+value.category+'</span><span class="text-muted page_url">'+value.link+'</span></small></cite></i><h5><a href="#" class="page_title">'+value.title+'</a></h5></div><div class="text-g-size"><span class="text-muted page_date">'+value.date+' </span><span class="text-g-color page_descri">'+value.descri+'</span></div>';
        $(list.element).html(html);
        // input checked script
        $("#"+value.input_id).click(function(){
            if (this.checked == true) {
                // animate selected
                $("#"+value.input_id).attr("class","checkboxes editbox-checkbox-show");
                $(list.element).addClass("scaleDown");
                value.select(self_me);
                value.select(self_me);
                // show tab library
                self.Tabs[0].showTab(1);
                $(self.Tabs[0].tabWrap +' a[href="#'+self.Tabs[0].tabs[1]+'"]').tab('show');
            } else {
                $("#"+value.input_id).attr("class","checkboxes editbox-checkbox");
                $(list.element).removeClass("scaleDown");
                self.Tabs[0].hideTab(1);
                $(self.Tabs[0].tabWrap +' a[href="#'+self.Tabs[0].tabs[0]+'"]').tab('show');
            }
            // set all other object to not selected
            for (var i = 0; i < self.items.length; i++) {
                if (self.items[i] != self_me) {
                    self.items[i].unselect();
                }
            }
        })
        // object methods
        this.unselect = function(){
            document.getElementById(value.input_id).checked = false;
            $(list.element).attr("class","");
            $("#"+value.input_id).attr("class","checkboxes editbox-checkbox");
        }
        this.page_id = value.page_id;
        // get page sublinks
        function getSublinks(){
            var link = [];
            var page_id = value.page_id;
            getSublink(page_id, link);
            return link;
            function getSublink(page_id,arr){
                for (var i = 0; i < self.pageDb.length; i++) {
                    if (self.pageDb[i].select == page_id) {
                        arr.push(self.pageDb[i].id);
                        getSublink(self.pageDb[i].id,arr);
                    }
                }
            }
        }
        // get the link of the category
        function getAllCategory(){
            var link = [];
            var textLink = "";
            var page_id = value.category;
            getCategory(page_id, link);
            link = link.reverse();
            for (var i = 0; i < link.length; i++) {
                textLink += link[i] + " &gt ";
            }
            return textLink;
            function getCategory(page_id,arr){
                for (var i = 0; i < self.pageDb.length; i++) {
                    if (self.pageDb[i].id == page_id) {
                        arr.push(self.pageDb[i].link);
                        if (self.pageDb[i].select != "") {
                            getCategory(self.pageDb[i].select,arr);
                        }
                    }
                }
            }
        }
    }
    // log the opject if developerMode is true
    function developerMode(){
        if (value.developerMode) {
            console.log(self);
        }
    }
}
