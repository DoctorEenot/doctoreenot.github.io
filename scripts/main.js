


function main() {
    // Load sha1 module
    var webasm = 0;
    var WASM_LOADED = false;
    var wasm_bytes = 0;

    request = new XMLHttpRequest();
    request.open('GET', 'scripts/sha1WASM_bg.wasm');
    request.responseType = 'arraybuffer';
    request.send();

    var importObject = { imports: {} };
    request.onload = function(){
        wasm_bytes = request.response;
        WebAssembly.instantiate(wasm_bytes,importObject).then(result=>{
            webasm = result;
            WASM_LOADED = true;
        })
    } 

    const REDRAW_TIMEOUT = 30;

    // OBJECTS
    var
    // Obtain a reference to the canvas element using its id.
    game_window = document.getElementById('game_window'),
    // Obtain a graphics context on the canvas element for drawing.
    context = game_window.getContext('2d');

    // MAIN MENU
    const BUTTONS_IN_MAIN_MENU = document.getElementById('main_menu_button_group');
    var temp = BUTTONS_IN_MAIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_MAIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_MAIN_MENU_WIDTH = temp.width;

    var MMB_PLAY = document.getElementById("online_button");
    var MMB_OPTIONS = document.getElementById("options");

    // Login menu
    const BUTTONS_IN_LOGIN_MENU = document.getElementById("login_button_group");
    var temp = BUTTONS_IN_LOGIN_MENU.getBoundingClientRect();
    const BUTTONS_IN_LOGIN_MENU_HEIGHT = temp.height;
    const BUTTONS_IN_LOGIN_MENU_WIDTH = temp.width;

    var LMB_LOGIN = document.getElementById("login");
    var LMB_SET_PFP = document.getElementById("set_pfp");
    var LMB_BACK = document.getElementById("back_login");
    var LMB_USERNAME = document.getElementById("username");

    // set pfp menu
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU = document.getElementById("set_pfp_group");
    var temp = DRAGNDROP_ZONE_IN_SET_PFP_MENU.getBoundingClientRect();
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU_HEIGHT = temp.height;
    const DRAGNDROP_ZONE_IN_SET_PFP_MENU_WIDTH = temp.width;

    // waiting screen
    const WAITING_MENU = document.getElementById("wait");
    var temp = WAITING_MENU.getBoundingClientRect();
    var WAITING_MENU_HEIGHT = temp.height;
    var WAITING_MENU_WIDTH = temp.width;
    const WAIT_NOTICE = document.getElementById("wait_notice");


    var DRAGNDROP_ZONE_PFP = document.getElementById("pfp_d&d");
    var DND_BACK = document.getElementById("back_pfp");


    var last_resize = 0;
    var in_resize = false;
    var main_bg = document.getElementById('main_bg');
    var reading_image = false;

    var stage = 0; // 0 - main menu
                    // 1 - set username/pfp
                    // 2 - set pfp
                    // 3 - waiting menu
    initialize();

    function initialize() {
        // disabling all menus
        disable_login_menu();
        disable_pfp_set_menu();
        disable_waiting_menu();

        // registering events
        window.addEventListener('resize', resizeCanvas, false);
        MMB_PLAY.addEventListener('click',MMB_PLAY_CLICK,false);
        LMB_BACK.addEventListener('click',LMB_BACK_CLICK,false);
        LMB_SET_PFP.addEventListener('click',LMB_SET_PFP_CLICK,false);
        DND_BACK.addEventListener('click',DND_BACK_CLICK,false);

        // Draw canvas border for the first time.
        resizeCanvas_wrapped();
        }

        // menu redrawers
        function redraw_main_menu() {
            context.drawImage(main_bg,0,0,
                            game_window.width,game_window.height);

            var new_height = (game_window.height - BUTTONS_IN_MAIN_MENU_HEIGHT)/2;
            var new_width = (game_window.width - BUTTONS_IN_MAIN_MENU_WIDTH)/2;

            BUTTONS_IN_MAIN_MENU.style.top = new_height;
            BUTTONS_IN_MAIN_MENU.style.left = new_width;
        }

        function redraw_login_menu() {
            context.drawImage(main_bg,0,0,
                            game_window.width,game_window.height);

            var new_height = (game_window.height - BUTTONS_IN_LOGIN_MENU_HEIGHT)/2;
            var new_width = (game_window.width - BUTTONS_IN_LOGIN_MENU_WIDTH)/2;

            BUTTONS_IN_LOGIN_MENU.style.top = new_height;
            BUTTONS_IN_LOGIN_MENU.style.left = new_width;
        }

        function redraw_set_pfp_menu(){
            context.drawImage(main_bg,0,0,
                game_window.width,game_window.height);

            var new_height = (game_window.height - DRAGNDROP_ZONE_IN_SET_PFP_MENU_HEIGHT)/2;
            var new_width = (game_window.width - DRAGNDROP_ZONE_IN_SET_PFP_MENU_WIDTH)/2;

            DRAGNDROP_ZONE_IN_SET_PFP_MENU.style.top = new_height;
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.style.left = new_width;
        }

        function redraw_waiting_menu(){
            context.drawImage(main_bg,0,0,
                game_window.width,game_window.height);

            var new_height = (game_window.height - WAITING_MENU_HEIGHT)/2;
            var new_width = (game_window.width - WAITING_MENU_WIDTH)/2;
            
            WAITING_MENU.style.top = new_height;
            WAITING_MENU.style.left = new_width;
        }


        function resizeCanvas_wrapped(){
            last_resize = new Date();
            game_window.width = window.innerWidth;
            game_window.height = window.innerHeight;

            switch(stage){
                case 0:
                    redraw_main_menu();
                    break;
                case 1:
                    redraw_login_menu();
                    break;
                case 2:
                    redraw_set_pfp_menu();
                    break;
                case 3:
                    redraw_waiting_menu()
                    break;
            }
            in_resize = false;
        }
        function resizeCanvas() {
            if(in_resize){
                return;
            }
            in_resize = true;
            setTimeout(resizeCanvas_wrapped, REDRAW_TIMEOUT-(new Date() - last_resize));
        }

        // ENABLE/DISABLE MENUS
        function enable_main_menu(){
            MMB_PLAY.removeAttribute("disabled");
            MMB_OPTIONS.removeAttribute("disabled");
            BUTTONS_IN_MAIN_MENU.removeAttribute("style");
        }
        function disable_main_menu(){
            MMB_PLAY.setAttribute("disabled","1");
            MMB_OPTIONS.setAttribute("disabled","1");
            BUTTONS_IN_MAIN_MENU.setAttribute("style","z-index:0;display:none;");
        }
        

        function enable_login_menu(){
            LMB_LOGIN.removeAttribute("disabled");
            LMB_SET_PFP.removeAttribute("disabled");
            LMB_BACK.removeAttribute("disabled");
            LMB_USERNAME.removeAttribute("disabled");
            BUTTONS_IN_LOGIN_MENU.removeAttribute("style");
        }
        function disable_login_menu(){
            LMB_LOGIN.setAttribute("disabled","1");
            LMB_SET_PFP.setAttribute("disabled","1");
            LMB_BACK.setAttribute("disabled","1");
            LMB_USERNAME.setAttribute("disabled","1");
            BUTTONS_IN_LOGIN_MENU.setAttribute("style","z-index:0;display:none;");
        }


        function enable_pfp_set_menu(){
            DND_BACK.removeAttribute("disabled");
            DRAGNDROP_ZONE_PFP.addEventListener('drop',PFP_SET_DROP_HANDLER,false);
            DRAGNDROP_ZONE_PFP.addEventListener('dragover',PFP_SET_DRAG_HANDLER,false);
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.removeAttribute("style");
        }
        function disable_pfp_set_menu(){
            DND_BACK.setAttribute("disabled","1");
            DRAGNDROP_ZONE_PFP.removeEventListener('drop',PFP_SET_DROP_HANDLER,false);
            DRAGNDROP_ZONE_PFP.removeEventListener('dragover',PFP_SET_DRAG_HANDLER,false);
            DRAGNDROP_ZONE_IN_SET_PFP_MENU.setAttribute("style","z-index:0;display:none;");
        }

        function enable_waiting_menu(wait_notice){
            WAIT_NOTICE.innerText = wait_notice;
            var temp = WAITING_MENU.getBoundingClientRect();
            WAITING_MENU_HEIGHT = temp.height;
            WAITING_MENU_WIDTH = temp.width;
            WAITING_MENU.removeAttribute('style');
        }
        function disable_waiting_menu(){
            WAITING_MENU.setAttribute('style',"z-index:0;display:none;");
        }

        // HANDLERS

        function PFP_SET_DROP_HANDLER_ON_FINISH(e){
            var img_data = e.target.result;
            console.log("finished reading");
            
            var bytes = new Uint8Array(img_data);

            // getting hash
            var hash_bytes = sha1_digest(bytes,webasm);
            console.log(hash_bytes);

            // converting to base64
            var binary = '';
            var len = hash_bytes.byteLength;
            for(var i=0; i<len; i++){
                binary += String.fromCharCode(hash_bytes[i]);
            }
            var hash_base64 = window.btoa(binary);
            console.log(hash_base64);

            in_resize = true;
            disable_waiting_menu();
            enable_pfp_set_menu();
            redraw_set_pfp_menu();
            in_resize = false;
        }
        function PFP_SET_DROP_HANDLER(event){
            event.stopPropagation();
            event.preventDefault();

            var file = 0;
            if(event.dataTransfer.items){
                if(event.dataTransfer.items[0].kind === 'file'){
                    file = event.dataTransfer.items[0].getAsFile();
                }
            }else{
                file = event.dataTransfer.files[0];
            }

            if(file === 0){
                return;
            }

            if (file.type && !file.type.startsWith('image/')){
                alert("That file is not an image!");
                return;
            }

            var reader = new FileReader();
            reading_image = true;
            var img_data = 0;
            reader.addEventListener('load',(e)=>{PFP_SET_DROP_HANDLER_ON_FINISH(e)});
            reader.readAsArrayBuffer(file);

            in_resize = true;
            disable_pfp_set_menu();
            enable_waiting_menu("Загружаем фото, ждите...");
            redraw_waiting_menu();
            in_resize = false;
        }
        function PFP_SET_DRAG_HANDLER(event){
            event.stopPropagation();
            event.preventDefault();

            event.dataTransfer.dropEffect = 'copy';
        }

        function MMB_PLAY_CLICK(){
            in_resize = true;
            disable_main_menu();
            enable_login_menu();
            redraw_login_menu();
            stage = 1;
            in_resize = false;
        }

        function LMB_BACK_CLICK(){
            in_resize = true;
            disable_login_menu();
            enable_main_menu()
            redraw_main_menu()
            stage = 0;
            in_resize = false;
        }

        function LMB_SET_PFP_CLICK(){
            in_resize = true;
            disable_login_menu();
            enable_pfp_set_menu();
            redraw_set_pfp_menu();
            stage = 2;
            in_resize = false;
        }

        function DND_BACK_CLICK(){
            in_resize = true;
            disable_pfp_set_menu();
            enable_login_menu();
            redraw_login_menu();
            stage = 1;
            in_resize = false;
        }

}


