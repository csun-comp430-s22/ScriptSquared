const Tokenizer = require('../Lexer/Lexer')

let tokenizer = new Tokenizer("123")
console.log(tokenizer.tryTokenizeInteger())