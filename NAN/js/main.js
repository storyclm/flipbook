var clickEvent = ('ontouchstart' in window ? 'touchend' : 'click');
; (function () {
     window.storyCLMNavigation = new StoryCLMNavigation({
        threshold: 200,
        swipePointsCount: 1
    });

//    window.storyCLMNavigation.onSwipePrev = function (direction) {
//        if (direction) {
//            window.location = direction;
//        } else {
//            return false;
//        }
//    }
    var main_history = []; 
    var backUp_history = []; 
    var previousSlide;
    
     // получаем из localStorage ссылку на слайд с которого ушли в одну из backUp веток
    var last_current_slide = localStorage.getItem("Nan_opti_pro_last_current_slide");
    
    
    // проверка где мы находимся - в основной или в backUp ветке
    if(last_current_slide == null || last_current_slide == ""){
        // основная ветка
        if(localStorage.getItem("Nan_opti_pro_main_history") != null){
            main_history = localStorage.getItem("Nan_opti_pro_main_history").split(",");
            previousSlide = main_history[main_history.length-1];
            main_history.push(window.location);
            localStorage.setItem("Nan_opti_pro_main_history", main_history.join(","));
        }else{
            // мы на первом слайде основной ветки
            previousSlide = "";
            localStorage.setItem("Nan_opti_pro_main_history", window.location);
        }
    }else{
        // backUp ветка
        if(localStorage.getItem("Nan_opti_pro_backUp_history") != null && localStorage.getItem("Nan_opti_pro_backUp_history") != ""){
            backUp_history = localStorage.getItem("Nan_opti_pro_backUp_history").split(",");
            previousSlide = backUp_history[backUp_history.length-1];
            backUp_history.push(window.location);
            localStorage.setItem("Nan_opti_pro_backUp_history", backUp_history.join(","));
        }else{
            // мы на первом слайде buckUp ветки
            previousSlide = last_current_slide;
            localStorage.setItem("Nan_opti_pro_backUp_history", window.location);
            
            main_history = localStorage.getItem("Nan_opti_pro_main_history").split(",");
            main_history.pop();
            localStorage.setItem("Nan_opti_pro_main_history", main_history.join(","));
        }
    }
    
    window.storyCLMNavigation.onSwipePrev = function () {
        if (previousSlide != "") {
            if(last_current_slide == null || last_current_slide == ""){
                main_history = localStorage.getItem("Nan_opti_pro_main_history").split(",");
                if(main_history.length > 1){
                    main_history.splice(main_history.length-2, 2);
                    localStorage.setItem("Nan_opti_pro_main_history", main_history.join(","));
                }else{
                    main_history = [];
                    localStorage.setItem("Nan_opti_pro_main_history", "");
                }
            }else{
                // остаемся в backUp ветке
                backUp_history = localStorage.getItem("Nan_opti_pro_backUp_history").split(",");
                if(backUp_history.length > 1){
                    backUp_history.splice(backUp_history.length-2, 2);
                    localStorage.setItem("Nan_opti_pro_backUp_history", backUp_history.join(","));
                }else{
                    // уходим в основную ветку
                    backUp_history = [];
                    localStorage.setItem("Nan_opti_pro_backUp_history", "");
                    localStorage.setItem("Nan_opti_pro_i-button", "");
                    localStorage.setItem("Nan_opti_pro_magnifier", "");
                    localStorage.setItem("Nan_opti_pro_last_current_slide", "");
                }
            }
            window.location = previousSlide;
        } else {
            return false;
        }
    }

    window.storyCLMNavigation.onSwipeNext = function (direction) {
        if (direction) {
            window.location = direction;
        } else {
            return false;
        }
    }

    try {
        $("[data-route]").on(clickEvent, function (e) {
            var route = $(this).data('route');
            if (route)
                if (window.location)
                    window.location = route;

            e.preventDefault();
        });
    }
    catch (ex) { }
    
    
    
    //------------------------------------------------------------------
    //Логика пповедения кнопки ссылок
    $(".links").on(clickEvent, function(){
        if($(this).hasClass("active")){
            hideLinks();
        }else{
           $(this).addClass("active");
            $(".linksPath").css({"height":$(".links span").height()+ 40 + "px"});
           $(".links-bg").addClass("active");
           $(".linksPath").addClass("active");
        }
    });
    
    function hideLinks(){
        $(".links").removeClass("active");
        $(".links-bg").removeClass("active");
        $(".linksPath").removeClass("active");
    }
    
    //Построение плашки и области ссылок
    var triangle = $("<div class='triangle'></div>");
    var linksPath = $("<div class='linksPath'></div>");
    linksPath.append(triangle);
    $(".links-bg").append(linksPath);
    if($(".links span").text().length == 0){
        $(".links").css({"opacity": "0.5", "pointer-events":"none"});
    }
    
    //------------------------------------------------------------------
    
    // Блок логики поведения кнопки i. При нажатии в localStorage записываем состояние кнопки, как нажатое, и переходим в ветку backUp, при возврате обратно состояние обнуляется.
    var i_button_state = localStorage.getItem("Nan_opti_pro_i-button");
    
    if(i_button_state && i_button_state == "active"){
        $(".i-button").addClass("active");
    }
    
    $(".i-button").on(clickEvent, function(){
        if($(this).hasClass("active")){
            localStorage.setItem("Nan_opti_pro_i-button", "");
            $(this).removeClass("active");
            localStorage.setItem("Nan_opti_pro_last_current_slide", "");
            localStorage.setItem("Nan_opti_pro_backUp_history", "");
            window.location = last_current_slide;
        }else{
            $(".magnifier").removeClass("active");
            localStorage.setItem("Nan_opti_pro_magnifier", "");
           $(this).addClass("active");
            localStorage.setItem("Nan_opti_pro_i-button", "active");
            localStorage.setItem("Nan_opti_pro_i-button", "active");
            hideLinks();
            if(last_current_slide == null || last_current_slide == ""){
                localStorage.setItem("Nan_opti_pro_last_current_slide", window.location);
            }
            window.location = "Nan_opti_pro_14.html";
        }
    });
    
    //------------------------------------------------------------------
    
    // Блок логики поведения кнопки с лупой. При нажатии в localStorage записываем состояние кнопки, как нажатое, и переходим на слайд с конкурентами, при возврате обратно состояние обнуляется.
    var magnifier_state = localStorage.getItem("Nan_opti_pro_magnifier");
    
    if(magnifier_state && magnifier_state == "active"){
        $(".magnifier").addClass("active");
    }
    $(".magnifier").on(clickEvent, function(){
        if($(this).hasClass("active")){
            localStorage.setItem("Nan_opti_pro_magnifier", "");
            $(this).removeClass("active");
            localStorage.setItem("Nan_opti_pro_last_current_slide", "");
            localStorage.setItem("Nan_opti_pro_backUp_history", "");
            window.location = last_current_slide;
        }else{
            $(".i-button").removeClass("active");
            localStorage.setItem("Nan_opti_pro_i-button", "");
            $(this).addClass("active");
            localStorage.setItem("Nan_opti_pro_magnifier", "active");
            hideLinks();
            if(last_current_slide == null || last_current_slide == ""){
                localStorage.setItem("Nan_opti_pro_last_current_slide", window.location);
            }
            window.location = "Nan_opti_pro_15_backup.html";
        }
    });
    
    //------------------------------------------------------------------
    
    $(".logo").on(clickEvent, function(){
        resetAllStates();
        window.location = "index.html";
    });
    
    $(".logo2").on(clickEvent, function(){
        resetAllStates();
        window.location = "index.html";
    });
    
    function resetAllStates(){
        localStorage.setItem("Nan_opti_pro_backUp_history", "");
        localStorage.setItem("Nan_opti_pro_i-button", "");
        localStorage.setItem("Nan_opti_pro_magnifier", "");
        localStorage.setItem("Nan_opti_pro_last_current_slide", "");
        localStorage.setItem("Nan_opti_pro_main_history", "");
    }
})();