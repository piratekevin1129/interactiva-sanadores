var i = 0;
var j = 0;

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function loadImg(data){
    var img = new Image()
    img.onload = function(){
        img.onload = null
        img.onerror = null
        data.callBack(img)
    }
    img.onerror = function(){
        img.onload = null
        img.onerror = null
        data.callBack(null)   
    }
    img.src = data.src
}

function getE(idname){
    return document.getElementById(idname)
}

var load_item = 0
var global_ruleta = 0
var global_area = 0

function loadItems(){
    if(load_item==cuadros[global_ruleta-1].items.length){
        loadTrack({src: 'assets/audios/cuadro'+global_ruleta+'/0.mp3', callBack: function(data){
            //loaderUpdate()
            cuadros[global_ruleta-1].intro = data
            cuadros[global_ruleta-1].loaded = true
            
            setRuleta()
            setRuleta2()
        }})
    }else{
        loadItem()
    }
}

function loadItem(){
    loadImg({src:'assets/images/cuadro'+global_ruleta+'/'+cuadros[global_ruleta-1].items[load_item].id+'.png', callBack: function(){
        //loaderUpdate()
        loadTrack({src: 'assets/audios/cuadro'+global_ruleta+'/'+cuadros[global_ruleta-1].items[load_item].id+'.mp3', callBack: function(data){
            //loaderUpdate()
            cuadros[global_ruleta-1].items[load_item].audio = data
            load_item++
            loadItems()
        }})
    }})
}

function overArea(a){
    var cont = getE('rueda-nivel1').getElementsByClassName('rueda-pilar')[a-1]
    var imagendiv = cont.getElementsByClassName('rueda-pilar-imagen')[0]
    imagendiv.className = 'rueda-pilar-imagen over'
    over_mp3.currentTime = 0
    over_mp3.play()
}

function outArea(a){
    var cont = getE('rueda-nivel1').getElementsByClassName('rueda-pilar')[a-1]
    var imagendiv = cont.getElementsByClassName('rueda-pilar-imagen')[0]
    imagendiv.className = 'rueda-pilar-imagen'
}

var animating_imagen = false;
var animacion_imagen = null;
var audio_global = null;

function clickArea(a){
    if(!animating_imagen){
        animating_imagen = true;
        click_mp3.play();

        if(audio_global!=null){
            audio_global.pause()
            audio_global = null
        }
    
        getE('rueda-imagen-wrap-1').className = 'rueda-imagen-wrap-1-invisible'
    
        var imagen2 = getE('rueda-imagen-wrap-2-img')
        imagen2.src = "assets/images/cuadro"+global_ruleta+'/'+cuadros[global_ruleta-1].items[a-1].id+'.png'
        var descripcion2 =  getE('rueda-imagen-wrap-2-descripcion')
        descripcion2.innerHTML = cuadros[global_ruleta-1].items[a-1].descripcion
        getE('rueda-imagen-wrap-2').className = 'rueda-imagen-wrap-2-visible'
    
        transicion_mp3.play()

        animacion_imagen = setTimeout(function(){
            clearTimeout(animacion_imagen)
            animacion_imagen = null

            resetImages(a-1)
            audio_global = cuadros[global_ruleta-1].items[a-1].audio
            audio_global.currentTime = 0
            audio_global.play()
            animating_imagen = false;
        },1000)
    }
}

var animating_rueda = false
var animacion_rueda_off = null
var rotaciones_aguja = [-10,-38,-64,-90,-116,-142,-170]

function clickRuleta(r){
    if(!animating_rueda){
        animating_rueda = true;
        
        if(audio_global!=null){
            audio_global.pause()
            audio_global = null
        }

        if(global_ruleta==0){
            getE('col-rueda').className = 'col-rueda-loading'
            getE('ruleta-aguja-img').className = ''
        }else{
            getE('col-rueda').className = 'col-rueda-loading'
            getE('col-rueda-title').className = 'col-rueda-title-off'
            getE('rueda').className = 'rueda-'+cuadros[global_ruleta-1].items.length+' rueda-off'
            getE('ruleta-aguja-img').className = ''
        }
        
        animacion_rueda_off = setTimeout(function(){
            clearTimeout(animacion_rueda_off)
            animacion_rueda_off = null
    
            global_ruleta = r
            getE('ruleta-aguja').style.transform = 'rotate('+rotaciones_aguja[r-1]+'deg)'
            getE('ruleta-aguja-img').className = 'ruleta-aguja-animation'
            
            if(!cuadros[global_ruleta-1].loaded){
                load_item = 0
                loadItems()
            }else{
                setRuleta()
                setRuleta2()
            }
            aguja_mp3.play()
        },200)
    }
}

function setRuleta(){
    getE('col-rueda-title').innerHTML = cuadros[global_ruleta-1].title
    
    resetImages(0)

    getE('rueda-nivel1').innerHTML = ''
    getE('rueda-areas').innerHTML = ''
    for(i = 0;i<cuadros[global_ruleta-1].items.length;i++){
        var div_pilar = document.createElement('div')
        div_pilar.className = 'rueda-pilar'
        var div_html = '<div class="rueda-pilar-imagen">'
        div_html+='<img src="assets/images/'+cuadros[global_ruleta-1].items.length+'/'+cuadros[global_ruleta-1].items[i].id+'.png" />'
        div_html+='<img class="rueda-pilar-imagen-sombra" src="assets/images/'+cuadros[global_ruleta-1].items.length+'/hover.png" />'
        div_html+='<img src="assets/images/cuadro'+global_ruleta+'/'+cuadros[global_ruleta-1].items[i].id+'.svg" />'
        div_html+='</div>'
        div_pilar.innerHTML = div_html
        
        getE('rueda-nivel1').appendChild(div_pilar)

        var div_area = document.createElement('div')
        div_area.className = 'rueda-area'
        div_area.setAttribute('onmouseover',"overArea("+(i+1)+")")
        div_area.setAttribute('onmouseout',"outArea("+(i+1)+")")
        div_area.setAttribute('onclick',"clickArea("+(i+1)+")")

        getE('rueda-areas').appendChild(div_area)
    }
    
    getE('col-rueda').className = ''
    getE('col-rueda-title').className = 'col-rueda-title-on'
    getE('rueda').className = 'rueda-'+cuadros[global_ruleta-1].items.length+' rueda-on'
}

function setRuleta2(){
    animating_rueda = false;
    animating_imagen = false;
    audio_global = cuadros[global_ruleta-1].intro
    audio_global.currentTime = 0
    audio_global.play()
}

function resetImages(ind){
    var imagen1 = getE('rueda-imagen-wrap-1-img')
    imagen1.src = "assets/images/cuadro"+global_ruleta+"/"+cuadros[global_ruleta-1].items[ind].id+".png"
    var descripcion1 =  getE('rueda-imagen-wrap-1-descripcion')
    descripcion1.innerHTML = cuadros[global_ruleta-1].items[ind].descripcion
    getE('rueda-imagen-wrap-1').className = 'rueda-imagen-wrap-1-visible'

    var imagen2 = getE('rueda-imagen-wrap-2-img')
    imagen2.src = ""
    var descripcion2 =  getE('rueda-imagen-wrap-2-descripcion')
    descripcion2.innerHTML = ""
    getE('rueda-imagen-wrap-2').className = 'rueda-imagen-wrap-2-invisible'
}