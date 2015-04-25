// author : xunuo <i@xunuo.com>
// thank : https://www.zybuluo.com/bornkiller/note/32907

var through = require('through-gulp'),
    docdown = require('docdown'),
    path = require('path')
    ;

function gulpDocDown(args) {

    if(args.outputType == 'html') {
        var fs = require('fs');
        // Get TPL
        var htmlTpl = args.htmlTpl;
        if (!htmlTpl) {
            var htmlStyle = args.htmlStyle ? args.htmlStyle : 'default';
            htmlTpl = fs.readFileSync(__dirname + '/templates/' + htmlStyle + '/layout.html', 'utf8');
        }
    }

    // start stream
    var stream = through(function (file, encoding, callback) {

        // clone options from args
        var options = JSON.parse(JSON.stringify(args));

        // get file path
        options.path = file.path;

        // reset url with path
        options.url = options.url.replace('{filePath}',path.relative(file.cwd,file.path));

        // reset title with path
        options.title = options.title.replace('{fileName}',path.relative(file.cwd,file.path));

        // doc it down
        var docDownContent = docdown(options);

        // pretty @example's content
        var exampleBlocks = docDownContent.match(/```js[.\s\S]*?```/gm);
        if(exampleBlocks){
            for(var i = 0; i < exampleBlocks.length; i++) {
                var examplesBlockItem = exampleBlocks[i],
                    lineArray = examplesBlockItem.split('\n'),
                    endLineContent = lineArray[lineArray.length-2]
                    ;
                // get beginningTab content
                var lineBeginningTab = endLineContent.match(/^[\s]*/g);

                if(lineBeginningTab){
                    // replace beginningTab to empty
                    var replaceRegx = new RegExp('\n' + lineBeginningTab[0],'g'),
                        pretttyExampleContent = examplesBlockItem.replace(replaceRegx,'\n')
                        ;
                    docDownContent = docDownContent.replace(examplesBlockItem,pretttyExampleContent);
                }
            }
        }

        // for output html
        if(options.outputType == 'html'){
            // covert to html
            var Showdown = require('showdown'),
                converter = new Showdown.converter(),
                htmlContent = converter.makeHtml(docDownContent)
                // back to div
                   .replace(/\<\!--\ \/div\ --\>/g,'</div>')
                   .replace(/\<\!--\ div\ --\>/g,'<div>')
                   .replace(/\<\!--\ div class="toc-container"\ --\>/g,'<div class="toc-container">')
                   .replace(/\<\!--\ div class="doc-container"\ --\>/g,'<div class="doc-container">')
                    // with prism.js highlight
                   .replace(/class="js"/g,'class="js language-javascript"')
                ;

            // ejs render
            var ejs = require('ejs');
            docDownContent = ejs.render(htmlTpl, {
                title : options.title,
                htmlContent : htmlContent
            });
        }

        // set buffer
        file.contents = new Buffer(docDownContent);

        // output file
        this.push(file);

        // for final callback
        destDir= file.path;

        callback();
    }, function (callback) {
        callback();
    });
    return stream;
};
// exporting the plugin
module.exports = gulpDocDown;