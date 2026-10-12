const fs = require ("fs");
const turndown = require ("turndown"); //3/28/26 by DW
const dateFormat = require ("dateformat");
const utils = require ("daveutils");
const s3 = require ("daves3");
const reallysimple = require ("reallysimple");

const config = {
	feedUrl: "http://scripting.com/rss.xml",
	s3FolderPath: "/scripting.com/code/mymarkdown/",
	removeFromGuid: "http://scripting.com/",
	urlMarkdownFolder: "http://scripting.com/code/mymarkdown/",
	maxDescriptionChars: 50
	}

function formatDate (theDate, theFormat) {
	return (dateFormat (new Date (theDate), theFormat))
	}
function firstSentence (s, maxCt) {
	var segmenter = new Intl.Segmenter (undefined, {granularity: "sentence"});
	var iterator = segmenter.segment (s) [Symbol.iterator] ();
	var item = iterator.next ();
	var result = "";
	if (!item.done) {
		result = item.value.segment.trim ();
		if (result.length > maxCt) {
			result = result.substr (0, maxCt - 3);
			var ix = result.lastIndexOf (" ");
			if (ix > 0) {
				result = result.substr (0, ix);
				}
			result += "...";
			}
		}
	return (result);
	}
function shortDescription (description) {
	if (description === undefined) {
		return ("");
		}
	else {
		var shorty = utils.stripMarkup (description);
		shorty = firstSentence (shorty, config.maxDescriptionChars);
		return (shorty);
		}
	}
function getMarkdownFromHtml (htmltext) { //3/28/26 by DW
	const myTurndown = new turndown ();
	const markdowntext = myTurndown.turndown (htmltext);
	return (markdowntext);
	}

utils.readConfig ("config.json", config, function () {
	console.log ("\nconfig == " + utils.jsonStringify (config) + "\n");
	reallysimple.readFeed (config.feedUrl, function (err, theFeed) {
		if (err) {
			console.log (err.message);
			}
		else {
			var homePageLinks = new Array ();
			theFeed.items.forEach (function (item) {
				var mdtext = "";
				function add (s) {
					mdtext += "\n" + s + "\n"
					}
				
				add (dateFormat (new Date (item.pubDate), "dddd, mmmm d, yyyy"));
				
				if (item.title !== undefined) {
					add ("# " + item.title)
					}
				
				var markdowntext =  (item.markdownText == undefined) ? getMarkdownFromHtml (item.description) : item.markdownText;
				add (markdowntext)
				
				var relpath = utils.stringDelete (item.guid, 1, config.removeFromGuid.length); //remove http://scripting.com/ from beginning of guid 
				relpath = utils.replaceAll (relpath, ".html", "")
				relpath = utils.replaceAll (relpath, "#", "/"); 
				relpath += ".md";
				
				const s3path =  config.s3FolderPath + relpath;
				
				s3.newObject (s3path, mdtext);  
				
				const linkurl = config.urlMarkdownFolder + relpath;  
				const linktext = (item.title === undefined) ? shortDescription (item.description) : item.title;
				const whentext = formatDate (item.pubDate, "mmm dd"); 
				const markdownLink = whentext + ": " + "[" + linktext + "](" + linkurl + ")";
				homePageLinks.push (markdownLink);
				
				console.log (s3path);
				});
			console.log ("homePageLinks == " + utils.jsonStringify (homePageLinks));
			
			function saveHomePageLinks () {
				var s3path = config.s3FolderPath + "links.md", mdtext = ""; 
				homePageLinks.forEach (function (theLink) {
					mdtext += theLink + "\n\n";
					});
				s3.newObject (s3path, mdtext);  
				console.log (s3path);
				}
			saveHomePageLinks ();
			
			
			
			}
		});
	});
