``` javascript
var redChild = document.querySelector('.child.red');
redChild.addEventListener('click', function(event){
  alert(this.className);
}, true);

// Capturing event listener for .parent-one.red
var redParent = document.querySelector('.parent-one.red');
redParent.addEventListener('click', function(event){
  alert(this.className);
}, true);
// Capturing event listener for .parent-two.red
var redGP = document.querySelector('.parent-two.red');
redGP.addEventListener('click', function(event){
  alert(this.className);
}, true);

// Bubbling event listener for .child.blue
var blueChild = document.querySelector('.child.blue');
blueChild.addEventListener('click', function(event){
  alert(this.className);
}, false);
// Bubbling event listener for .parent-one.blue
var blueParent = document.querySelector('.parent-one.blue');
blueParent.addEventListener('click', function(event){
  alert(this.className);
}, false);
// Bubbling event listener for .parent-two.blue
var blueGP = document.querySelector('.parent-two.blue');
blueGP.addEventListener('click', function(event){
  alert(this.className);
}, false);
```
