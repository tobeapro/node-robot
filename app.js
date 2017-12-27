const express=require('express')
const http=require('superagent')
const pug=require('pug')
const bodyParser=require('body-parser')
const cheerio=require('cheerio')
const app=express()
app.set('views',__dirname+'/views')
app.set('view engine','pug')
app.use('/static',express.static(__dirname+'/node_modules'))
app.use('/public', express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extend:true})) //post请求参数解析
app.get('/',(req,res)=>{
    http.get('https://cnodejs.org/')
    .end((err,data)=>{
        if(err){
            return next(err)
        }
        let $=cheerio.load(data.text)
        let cells=$('#topic_list .cell')
        let list=[]
        cells.each((index,item)=>{
            let $item=$(item)
            list.push({
                userImg: $item.find('.user_avatar img').attr('src'),
                replyCount:$item.find('.count_of_replies').text(),
                visitCount:$item.find('.count_of_visits').text(),
                title:$item.find('.topic_title').text()
            })
        })
        res.render('index',{
            title:'node',
            list:list
        })
    })
})
app.listen(3000,()=>{
    console.log('app listen on port 3000')
})