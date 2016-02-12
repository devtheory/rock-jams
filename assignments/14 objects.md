var createCourse = function(newTitle, newDuration, newStudents){
  return {duration: newDuration,
            title: newTitle,
            students: newStudents
           };
  
};

var formLetter = function(letter){
  return "Hello " + letter.recipient + ",\n\n" + letter.msg + "\n\nSincerely,\n" + letter.sender;
};

var canIGet = function(item, money){
  var options = {
    "MacBook Air": 999,
    "MacBook Pro": 1299,
    "Mac Pro": 2499,
    "Apple Sticker": 1
  };
  
  switch(item){
    case "MacBook Air":
      return options[item] <= money;
    case "MacBook Pro":
      return options[item] <= money;
    case "Mac Pro":
      return options[item] <= money;
    case "Apple Sticker":
      return options[item] <= money;
    default:
      return false;
  }
};