// 載入 `express`, 現在可以放心使用 `import` 了
import express from 'express'
// const express = require('express')

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 建立一個 express (也就是網頁伺服器)實體
const app = express()
const port = 8788
// 啟動伺服器
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

app.use(express.static(`${__dirname}/dist`))

import bodyParser from 'body-parser'
import fs from 'fs';
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// jQuery.post(url,data,success(data, textStatus, jqXHR),dataType)
app.post("/file", (req, res) => {
  const icon = Buffer.from(req.body.FileContent, "base64");
  // 其他格式直接寫入檔案
  fs.writeFile(`./dist/upload/${req.body.imageId}`, icon, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("The file has been saved!");
      res.sendStatus(200);
    }
  });

});

/* ////////////////////////////////////// */

app.get('/documentSelect', (req, res) => {
  fs.readFile('./document.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].lec == req.query.lec && data[id].clas == req.query.clas) {
        HTML += htmlWriter(data[id], id);
    }}
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

app.get('/documentSearch', (req, res) => {
  fs.readFile('./document.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].name.includes(req.query.search)||
      data[id].dep.includes(req.query.search)||
      data[id].lec.includes(req.query.search)||
      data[id].teac.includes(req.query.search)||
      data[id].clas.includes(req.query.search)||
      data[id].up.includes(req.query.search)
        ) {
      HTML += htmlWriter(data[id], id)
    }}
    if (HTML == '') {
      HTML = '<h1>太糟了！這裡沒有任何死人骨頭<h1>';
    }
    res.send(HTML);
  });
});

function htmlWriter(data, id){
  const html = fs.readFileSync('./dist/html/document.html', 'utf8');
  const $ = cheerio.load(html);
  $('.document').attr('id', id);
  $('.year h4').text(data.year);
  $('.teacher h4').text(data.teac);
  $('.like h4').text(data.like.count);
  $('.name h4:eq(0)').text(data.clas);
  $('.name h4:eq(1)').text(data.name);
  $('.tag img:eq(0)').attr('style', 'display: ' + (data.tagA == 1 ? 'block': 'none'));
  $('.tag img:eq(1)').attr('style', 'display: ' + (data.tagB == 1 ? 'block': 'none'));
  $('.uploader img:eq(0)').attr('src', './img/userpic/' + data.pic);
  $('.uploader h4').text(data.up);
  $('.uploader img:eq(1)').attr('style', 'opacity:' + (data.award == 1 ? 1:0));
  return $.html()
}

/* ////////////////////////////////////// */

app.get('/updatelecture', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].dep == req.query.dep && (req.query.grade == null || data[id].grade == req.query.grade)) {
        HTML += '<li>' + data[id].name + '</li>';
    }}
    res.send(HTML);
  });
});

app.get('/updatedepartment', (req, res) => {
  fs.readFile('./' + req.query.json + '.json', 'utf8', function(err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    let HTML = '';
    for (let id in data) {
      if (data[id].col == req.query.col) {
        HTML += '<li>' + data[id].name + '</li>';
    }}
    res.send(HTML);
  });
});

/* ////////////////////////////////////// */

import cheerio from 'cheerio';

app.get('/view', (req, res) => {
  fs.readFile('./dist/view.html', 'utf8', function(err, html) {
    if (err) throw err;
    fs.readFile('./document.json', 'utf8', function(err, data) {
      if (err) throw err;
      data = JSON.parse(data);
      const $ = cheerio.load(html);
      $('#title h1').text(data[req.query.doc].lec);
      $('#teac').text('教師 | ' + data[req.query.doc].teac);
      $('#year').text('年份 | ' + data[req.query.doc].year);
      $('#clas').text('類別 | ' + data[req.query.doc].clas);
      $('#userpic img').attr('src', './img/userpic/' + data[req.query.doc].pic);
      $('#up').text(data[req.query.doc].up);
      $('#download a').attr('href', './upload/' + data[req.query.doc].url);
      let like = data[req.query.doc].like.userIds.includes(req.query.userID);
      res.send([$.html(), like]);
    });
  })
});

app.get('/preview_personal', (req, res) => {
  fs.readFile('./dist/preview_personal.html', 'utf8', function(err, html) {
    if (err) throw err;
    res.send(html);
  })
});

app.get('/personal_page', (req, res) => {
  fs.readFile('./dist/personal_page.html', 'utf8', function(err, html) {
    if (err) throw err;
    res.send(html);
  })
});

/* ////////////////////////////////////// */


app.get('/like', (req, res) => {
  fs.readFile('document.json', 'utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    if (data[req.query.doc].like.userIds.includes(req.query.userID)) {
      res.send('已讚')
     }
    else{
      data[req.query.doc].like.userIds.push(req.query.userID);
      data[req.query.doc].like.count = data[req.query.doc].like.userIds.length;
      fs.writeFile('./document.json', JSON.stringify(data), 'utf8', function(err) {
        if (err) throw err;
      });
      res.send('按讚成功')
    }
  });
});







