function loadImg(item){
    var timer=null
    timer=setInterval(function(){
        if(item.complete){
            clearInterval(timer)
        }
        item.src=item.getAttribute('data-src')
    },100)
}