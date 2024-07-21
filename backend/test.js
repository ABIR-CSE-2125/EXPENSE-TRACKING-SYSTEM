import validator from "validator";

console.log("Mail validation : ", validator.isEmail("abir@gmailcom"));
console.log("phone validation : ", validator.isMobilePhone("+1629523198"));
