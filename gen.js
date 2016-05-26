/*
	input: xml generated from docx
	output: TEI
*/
var fs=require("fs");
var sourcepath="msword_pb_kai/xml/";
var lst=fs.readFileSync(sourcepath+"files.lst","utf8").split(/\r?\n/);

var replacePb=function(content){
	return content.replace(/`(\d+)`/g,function(m,m1){
		return '<pb n="'+m1+'"/>';
	});
}

var replaceHead=function(content){
	return content.replace(/<b><H(\d+) t="(.+?)">(.+?)<\/b>/g,function(m,m1,t,m2){
		return "<H"+m1+' t="'+t+'">'+m2+"</H"+m1+">";
	}).replace(/<b><H(\d+) t="(.+?)">([^<]+?)\n/g,function(m,m1,t,m2){
		return "<H"+m1+' t="'+t+'">'+m2+"</H"+m1+">\n<b>";
	}).replace(/<b>`(\d+)`<H(\d+) t="(.+?)">(.+?)<\/b>/g,function(m,pb,m1,t,m2){
		return '<pb n="'+pb+'"/>'+"<H"+m1+' t="'+t+'">'+m2+"</H"+m1+">";
	}).replace(/<b>`(\d+)`<H(\d+) t="(.+?)">([^<]+?)\n/g,function(m,pb,m1,t,m2){
		return '<pb n="'+pb+'"/>'+"<H"+m1+' t="'+t+'">'+m2+"</H"+m1+">\n<b>";
	})
	;
}

var replaceKai=function(content){
	return content.replace(/\^([\s\S]*?)\^\^/g,function(m,m1){
		return "<kai>"+m1+"</kai>";
	});
}
var processfile=function(fn){
	console.log(fn)
	var out="";
	var content=fs.readFileSync(sourcepath+fn,'utf8');
	content=content.replace(/\r?\n/g,"\n");

	//deal with <b><H1>xxx\n<H2>xxx\n</b>
	content=replaceHead(content);
	content=replaceHead(content);
	content=replaceHead(content);
	content=replaceHead(content);
	content=replaceHead(content);

	content=replacePb(content);
	content=replaceKai(content);
	content=content.replace(/<b><\/b>/g,"");
	content=content.replace(/<b>\n<\/b>/g,"");
	out=content;
	out=`<?xml-stylesheet type="text/css" href="default.css" ?>
			<html><script src="script.js"></script><meta charset="UTF-8"/>
			<body>`+out+"</body></html>";

	var newfn=fn.replace("-pb-kai.docx.xml",".xhtml");
	newfn=newfn.replace(/\d+大智度論卷/,"");
	newfn=newfn.replace(/大智度論簡介/,"");
	fs.writeFileSync("genxml/"+newfn,out,"utf8");
}
lst.length=3;
lst.forEach(processfile);