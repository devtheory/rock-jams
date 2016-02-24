var redChild = document.querySelector('.child.red');
console.log(redChild);
redChild.addEventListener('click', function(event){
  alert(this.className);
}, true);

// Capturing event listener for .parent-one.red
var redParent = document.querySelector('.parent-one.red');
console.log(redParent);
redParent.addEventListener('click', function(event){
  alert(this.className);
}, true);
// Capturing event listener for .parent-two.red
var redGP = document.querySelector('.parent-two.red');
console.log(redGP);
redGP.addEventListener('click', function(event){
  alert(this.className);
}, true);

// Bubbling event listener for .child.blue
var blueChild = document.querySelector('.child.blue');
console.log(blueChild);
blueChild.addEventListener('click', function(event){
  alert(this.className);
}, false);
// Bubbling event listener for .parent-one.blue
var blueParent = document.querySelector('.parent-one.blue');
console.log(blueParent);
blueParent.addEventListener('click', function(event){
  alert(this.className);
}, false);
// Bubbling event listener for .parent-two.blue
var blueGP = document.querySelector('.parent-two.blue');
console.log(blueGP);
blueGP.addEventListener('click', function(event){
  alert(this.className);
}, false);
