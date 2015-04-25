# gulp-docdown

gulp-docdown is a plugin to [docdown](https://www.npmjs.com/package/docdown) :)

## Install

```
npm install gulp-docdown gulp-rename 
```

## Usage(in gulpfile.js)

```javascript
var gulp = require('gulp'),
    gulpDocDown = require('gulp-docdown'),
    rename = require('gulp-rename');

gulp.task('gulpDocDown', function(){
    var outputType = 'html';    // 'html' or 'md'
    gulp.src('./*.js')
    .pipe(gulpDocDown({
        // {fileName} will replace by file name, define for docDown.
        title: 'API documentation / {fileName}',    
        // {filePath} will replace by file path, define for docDown.
        url: 'https://github.com/xxx/xxx/blob/master/{filePath}',
        // topic group type , define for docDown.
        toc: 'categories', 
        // the outputType : 'html' or 'md' , 'md' default.
        outputType : outputType,
        // [optional] define the html template, 'default' default.
        // htmlStyle : 'default'
        // [optional] or DIY your template, <%- title %> & <%- htmlContent %> will be relaced.
        // htmlTpl : '<!DOCTYPE html><html><head><title><%- title %></title><head><body><%- htmlContent %></body></html>'
    }))
    .pipe(rename({
        extname: '.' + outputType
    }))
    .pipe(gulp.dest('./output'));
});

gulp.task('default', ['gulpDocDown']);
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
