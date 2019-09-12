var fcount=3;
var floorOffSetf = {};      // offset:floorNum
var floorOffSetr = {};      // floorNum:offset
var floorlistu = [];       //floor calls in upward direction
var floorlistd = [];        // downward direction.
var direction = true;       // initially facing upward.
var max = 0;
var min=0;
var state = false;          // idile or active state.
var observer;
function setfloorcount(){
    let k = parseInt(document.URL.split('floor=')[1]);
    if(!isNaN(k))
        fcount = k;
    numOfFloors=fcount;
}
function setFloorOffSet(){
    for(i = 0;i<fcount;i++){
        var f = document.getElementById('f'+i).offsetTop;
        floorOffSetf[f] = i;
        floorOffSetr[i] = f;
        floorlistu.push(false);
        floorlistd.push(false);
    }
}
function syncdelay(n) {  
    return new Promise(done => {
      setTimeout(() => {
        done();
      }, n);
    });
}

function elevate(to,dir,i){
    $("#"+i).css("background-color", "#009688!important");
    var k = document.getElementById('elevatorBox').offsetTop;
    console.log("elevate details: to: "+to+" dir: "+dir+" id: "+i);
    if(dir == 0){
        floorlistd[to]=true;
        floorlistu[to]=true;
    }
    else{
        // if(floorOffSetr[to] == k){
        //     floorlistu[to] = true;
        //     floorlistd[to] = true;
        // }
        if(dir == 1){
            floorlistu[to] = true;
        }
        else{
            floorlistd[to] = true;
        }
    }
    if(state){
        if((to > max)&&(direction)){
            moveElevator(max,to);
            max = to;
        }       //need to consider direction.
        if((!direction)&&(to<min))
        {
            moveElevator(min,to);
            min=to;
        }
    }
    else{
        state=true;
        startCycle(false);  //starting after off state
    }
}

function startCycle(first)       //we calculate max and move elevator from 0 to max.
{
    //observer.disconnect();
    if(first==false)
        stopper();
    state = direction = true;
    max=calculateMax(0);
    document.getElementById("eleDir").innerHTML='arrow_upward';
    moveElevator(0,max);
    //stopper();
    // if(max==0)
    //     state=false;
    //moveElevator(fcount-1,0);
    
}

function moveElevator(from,to){
    var dif=from-to;
    console.log("moving elevator from "+from+" to "+to);
    if(dif<0)//animate up
    {
        $("#elevatorBox").animate({top:'-='+($("#elevatorBox").outerHeight()+16)*dif*-1},-5000*dif,'linear');
        //stopper();
    }
    else if(dif==0)
    {
        $("#elevatorBox").animate({opacity:0.8},500,'linear');
        $("#elevatorBox").animate({opacity:1},500,'linear');
    }
    else 
    {
        $("#elevatorBox").animate({top:'+='+($("#elevatorBox").outerHeight()+16)*dif},5000*dif,'linear');
        
    }
}
function calculateMin(k)
{
    var fmin=floorCal(0);
    if(fmin>k)
        return -1;
    return fmin;
}
function calculateMax(k)
{
    var fmax=floorCal(1);
    if(fmax<k)
        return -1;    //no other floor above the current floor
    return fmax;
}
function floorCal(minMax)
{
    var fmax=0;
    var fmin=fcount-1;
    let check=false;
        for(var i=0;i<fcount;i++)
            if(floorlistd[i]==true||floorlistu[i]==true)
            {
                check=true;
                if(fmin>i)
                    fmin=i;
                if(fmax<i)
                    fmax=i;
            }
    if(check==false)
        return -1;
    if(minMax==0)
        return fmin;
    else
        return fmax;
}
function changeDir(k){
    if((k==max)&&(max>0)&&(direction))      //you are at max position
    {
        //if(k===max){
        direction = false;
        document.getElementById("eleDir").innerHTML='arrow_downward';
        //max = min;        //? or max=min?
        //min=calculateMin(k);
        //$('#elevatorBox').stop();
        var pmin=calculateMin(k);
        if(pmin!=-1)      //if there is a min
        {
            min=pmin;
            console.log("going to min from max");
            moveElevator(k,min);    //go to min
        }
        else{               //else
            min=k-1;
            console.log("going to 0 from max");
            moveElevator(k,min);    //go to ground
        }
    }
    
    else if((k>0)&&(k==min)&&(!direction))    //k==min
    {
        let flag = false;
        for(var i = 0;i<fcount;i++)
        {
            if(floorlistu[i]==true || floorlistd[i]==true){
                flag = true;
                break;
            }
        }
        if(!flag)       //flag!=true indicates that there are no calls from above
        {
            min=k-1;
            console.log("going to 0 from min");
            moveElevator(k,min);
        }
        else    //if there is atleast a call
        {
            let pup=calculateMax(k);
            let pmin=calculateMin(k);
            
            if(pmin!=-1)        //go to new min if it exists
            {
                min=pmin;
                console.log("going to new min from min");
                moveElevator(k,min);
            }
            else if(pup!=-1)    //go to max if there is one
            {
                console.log("going to max from min");
                max=pup;
                direction=true;
                document.getElementById("eleDir").innerHTML='arrow_upward';
                moveElevator(k,max);
            }
            else                //go ground if there is none
            {
                console.log("going to ground from min");
                min=k-1;
                moveElevator(k,min);
            }
        }
        //moveElevator(k,max);
    }

    else{       //if you are at ground
        let flag = false;
        for(var i = 0;i<fcount;i++)
        {
            if((floorlistu[i]==true) || (floorlistd[i]==true)){
                flag = true;
                break;
            }
        }
        if(flag==true)        //  if there is any call
        {
            console.log("at ground starting cycle");
            startCycle(true);   //call in a non idle state
        }
        else
        {
            state = false;
            observer.disconnect();
        }
    }
}

async function stopper(){
    var targetNode = document.getElementById('elevatorBox');
    // Options for the observer (which mutations to observe)
    var config = { attributes: true,childList:true};
    
    // Callback function to execute when mutations are observed
    var callback = async function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type === 'attributes' || mutation.type=='childList') {
                let k = floorOffSetf[targetNode.offsetTop];
                if(k > -1)
                {
                    console.log(k);
                    let tmax,tmin;
                    
                    if((k==max)&&direction&&(floorlistd[k]==true))
                        floorlistu[k]=true;
                    if((k==min)&&(!direction)&&(floorlistu[k]==true))
                        floorlistd[k]=true;
                    document.getElementById('f').innerHTML = k;     //to show floor number!
                    
                    if((direction && (floorlistu[k]==true))){
                        console.log("in c1 "+k);
                        
                        
                        $("#"+k+"u").css("background-color", "#f44336!important");
                        $("#"+k+"d").css("background-color", "#f44336!important");
                        $("#g"+k).css("background-color", "#f44336!important");
                        
                        
                        floorlistu[k] =floorlistd[k]= false;
                        
                        $("#elevatorBox").pause();
                        doorsOpen(k);
                        await syncdelay(6000);
                        $("#elevatorBox").resume();
                        tmax=max;
                        
                        if((k == max)){
                            tmax=calculateMax(max);
                            if(tmax!=-1)
                            {
                                max=tmax;
                                moveElevator(k,max);
                            }
                            else
                                changeDir(k);       //change direction once you reached max.
                        }
                        
                    }
                    else if(((!direction) && (floorlistd[k]==true))){
                        console.log("in c2"+k);
                        
                        //tfloorlistu[k] =tfloorlistd[k]= false;
                        $("#"+k+"u").css("background-color", "#f44336!important");
                        $("#"+k+"d").css("background-color", "#f44336!important");
                        $("#g"+k).css("background-color", "#f44336!important");
                        floorlistd[k] = floorlistu[k] = false;
                        
                        $("#elevatorBox").pause();
                        doorsOpen(k);
                        await syncdelay(6000);
                        $("#elevatorBox").resume();
                        
                        tmin=min;
                        if((k==min)&&(k>0))
                        {
                            tmin=calculateMin(min);
                            if(tmin!=-1)
                            {
                                min=tmin;
                                moveElevator(k,min);
                            }
                            else
                                changeDir(k);       //change direction at min
                        }
                    }
                    else if(k>0&&(direction==false)&&(floorlistd[k]==false&&floorlistu[k]==false))
                    {
                        if(k==min)
                            changeDir(k);
                    }
                    if(k == 0&&(!direction)){
                        console.log("in c3"+k);
                        changeDir(k);               //change direction at ground.
                    }
                }
                //need to take the condition related to (if the elevatorbox's top<offset of ground floor, reset the elevator position.)
            }
        }
    };

    observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

async function doorsOpen(floor){
    speechSynthesis.speak(new SpeechSynthesisUtterance('floor number '+floor));
    $('#d1').hide('slide', {direction: 'left'}, 1000);
    $('#d2').hide('slide', {direction: 'right'}, 1000);
    await syncdelay(5000);
    $('#d1').show('slide', {direction: 'left'}, 1000);
    $('#d2').show('slide', {direction: 'right'}, 1000);
}
