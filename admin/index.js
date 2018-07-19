"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const Base_1 = require("nbake/lib/Base");
const logger = require('tracer').console();
console.log(new Base_1.Ver().ver());
let config = yaml.load(fs.readFileSync(__dirname + '/admin.yaml'));
console.log(config);
const server = express();
server.use(cors());
server.use(basicAuth({
    users: { 'admin': config.secret }
}));
const mp = new Base_1.MetaPro(config);
const sc = new Base_1.Scrape();
const fo = new Base_1.FileOps(config.mount);
server.get('/api/last', function (req, res) {
    console.log(' last');
    res.setHeader('Content-Type', 'application/json');
    let ret = mp.getLastMsg();
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/bake', function (req, res) {
    console.log(' bake');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro.folderProp];
    let ret = mp.bake(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/tag', function (req, res) {
    console.log(' tag');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro.folderProp];
    let ret = mp.tag(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/itemize', function (req, res) {
    console.log(' itemize');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let dir = qs[Base_1.MetaPro.folderProp];
    let ret = mp.itemize(dir);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
server.get('/api/scrape', function (req, res) {
    console.log(' scrape');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let url = qs['url'];
    let b = new Buffer(url, 'base64');
    url = b.toString();
    sc.s(url)
        .then(function (resp) {
        console.log(resp);
        let ret = new Base_1.RetMsg('sc', 1, resp);
        res.json(ret);
    });
});
server.get('/api/newLinkBlog', function (req, res) {
    console.log(' newLinkBlog');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let url = qs['url'];
    let b = new Buffer(url, 'base64');
    url = b.toString();
    let src = qs['src'];
    let dest = qs['dest'];
    sc.s(url)
        .then(function (resp) {
        logger.trace(resp);
        fo.clone(src, dest);
        const p = config.mount + dest;
        logger.trace(p);
        const d = new Base_1.Dat(p);
        d.set('title', resp['title']);
        d.set('image', resp['image']);
        d.set('content_text', resp['content_text']);
        d.set('external_url', url);
        d.write();
        let ret = new Base_1.RetMsg('sc', 1, resp);
        res.json(ret);
    });
});
function testSc(src, dest, url) {
    try {
        sc.s(url)
            .then(function (resp) {
            logger.trace(resp);
            fo.clone(src, dest);
            const p = config.mount + dest;
            logger.trace(p);
            const d = new Base_1.Dat(p);
            d.set('title', resp['title']);
            d.set('image', resp['image']);
            d.set('content_text', resp['content_text']);
            d.set('external_url', url);
            d.write();
            let ret = new Base_1.RetMsg('sc', 1, resp);
            console.log('// READY //////////////////////////////////////////////////////');
            console.log(ret);
        });
    }
    catch (err) {
        console.log('// ERR //////////////////////////////////////////////////////');
        console.log(err);
    }
}
let u = 'ttps://www.usffatoday.com/sports/';
testSc(1, 2, u);
server.get('/api/clone', function (req, res) {
    console.log(' itemize');
    res.setHeader('Content-Type', 'application/json');
    let qs = req.query;
    let src = qs['src'];
    let dest = qs['dest'];
    let ret = fo.clone(src, dest);
    if (ret.code < 0)
        res.status(500).send(ret);
    else
        res.json(ret);
});
