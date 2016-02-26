``` javascript
var $element = $('.event-element');

var onHover = function(){
  $(this).html("Mouse over!");
};

var offHover = function(){
  $(this).html("Mouse left!");
};

$element.click(function(){
  $(this).html("Clicked!");
});

$element.hover(onHover, offHover);
```
