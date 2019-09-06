var numOfFloors;
$(document).ready(function(){
    setfloorcount();
    $("#buttonPack").each(function()    //creating button pack.
    {
        var butn="";
        for(var i=numOfFloors-1;i>=0;i--)
        {
            butn+='                                                                                                         \
            <div class="w3-container w3-row w3-section buttonPair" id = "'+i+'bp">                                                         \
                <p class="w3-small">                                                                                        \
                    Floor'+i+':                                                                                             \
                </p>                                                                                                        \
                <button class="w3-btn w3-circle w3-ripple w3-hover-teal w3-row w3-card w3-section upButton" style = "color:#fff!important;background-color:#f44336!important" id = "'+i+'u" onclick = "elevate('+i+','+1+',this.id)" >        \
                    <i class="material-icons w3-small">arrow_upward</i>                                                     \
                </button><br>                                                                                                   \
                <button class="w3-btn w3-circle w3-ripple w3-hover-teal w3-row w3-card w3-section downButton" style = "color:#fff!important;background-color:#f44336!important" id = "'+i+'d" onclick = "elevate('+i+','+(-1)+',this.id)">       \
                    <i class="material-icons w3-small">arrow_downward  </i>                                                 \
                </button>                                                                                                   \
            </div>';
        }
        $(this).html(butn);

        
    });
    $("#floorContainer").each(function()
    {
        var butn="";
        //numberOfFloors-=2;
        for(var i=numOfFloors-1;i>=0;i--)
        {
            butn+='<div class="w3-container w3-row floors w3-margin" style="border-bottom: 1px solid #ccc" id = f'+i+' ></div>';
        }
        $(this).html(butn);
    });//try to do something while changing the height of the elevator itself.
    
    $(".intControl").each(function(){
        var toAddHtml="";
        for(var i=0;i<numOfFloors;i++){
            if((i%numOfFloors)===0){
                toAddHtml+='<div class="w3-container w3-row">';
            }
            toAddHtml+='<button class="w3-btn w3-margin w3-circle  w3-ripple w3-hover-teal w3-col w3-card w3-section " style = "color:#fff!important;background-color:#f44336!important" id="g'+i+'" onclick = "elevate('+i+','+0+',this.id)" >'+i+'</button>';
            if((i%numOfFloors)===(numOfFloors-1))
                toAddHtml+='</div>';
        }
        $(this).html(toAddHtml);
    });
    $("#0d",)
    .attr("disabled","disabled")
    .css('cursor','default')
    .css({'opacity':'0'});
    $("#"+ (numOfFloors-1) +"u")
    .attr("disabled","disabled")
    .css('cursor','default')
    .css({'opacity':'0'})            
    var rep;
    var adjustment=0;
    function setSize(){
        $('#elevatorContainerBox,#floorContainer').css({'height':$('#buttonPack').innerHeight()});
        $(".floors").each(function(){
            $(this).css({"height":$(".buttonPair").outerHeight()});
            
        });
        var ht=$("#elevatorContainerBox").height();
        $("#floorContainer").css({"position":"absolute","z-index":10,"width":$("#elevatorContainerBox").width()})
        $("#elevatorBox").css({"position":"relative","z-index":200,"height":$(".floors").outerHeight(),"width":$("#floorContainer").width()});
        
        if(adjustment===0)
        {
            adjustment++;
            setTimeout(setSize,100);
            setTimeout(function(){
            moveElevatorInit(numOfFloors-1,0);
            },10);
        }
        else return;    
    }

    setSize();
    function stopSize(){
        clearTimeout(rep);
    }
    $(window).resize(setSize);
    $(window).resize(()=>{
        window.location.reload();
    });
    function moveElevatorInit(from,to){
        var dif=from-to;
        if(dif<0)//animate up
        {
            $("#elevatorBox").animate({top:'-='+($("#elevatorBox").outerHeight()+16)*dif*-1});
        }
        else
        {
            $("#elevatorBox").css({top:'+='+($("#elevatorBox").outerHeight()+16)*dif});
        }
        setFloorOffSet();
        //stopper();
    }
});
