const express=require('express')
const http=require('superagent')
const pug=require('pug')
const fs=require('fs')
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
        let cnodeList=[]
        let $=cheerio.load(data.text)
        let cells=$('#topic_list .cell')
        cells.each((index,item)=>{
            let $item=$(item)
            cnodeList.push({
                title:$item.find('.topic_title').text(),
                id:$item.find('.topic_title').attr('href'),
                userImg: $item.find('.user_avatar img').attr('src'),
                replyCount:$item.find('.count_of_replies').text(),
                visitCount:$item.find('.count_of_visits').text(),               
            })
        })
        res.render('index',{
            title:'cNode',
            cnodeList:cnodeList
        })
    })
})
app.get('/zhihu',(req,res)=>{
    http.get('https://news-at.zhihu.com/api/4/news/latest')
    .end((err,data)=>{
        if(err){
            return next(err)
        }           
        let zhihuList=[]
        data=data.body.stories
        data.forEach((item,index)=>{
            http.get(item.images[0])
            .set({'async':false})
            .end((mis,rec)=>{
                if(mis){
                    return next(mis)
                }
                rec.setEncoding("binary")
                fs.writeFile(__dirname+'/public/img/'+item.id+'.png',rec.body,'binary',()=>{
                })
            })
            zhihuList.push({
                id:item.id,
                title:item.title,
                img:item.images[0]
            })
        })
        res.render('zhihu',{
            title:'知乎日报',
            zhihuList:zhihuList
        })
    })
})
app.listen(3000,()=>{
    console.log('app listen on port 3000')
})
