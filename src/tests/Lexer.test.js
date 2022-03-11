const Tokenizer = require('../Lexer/Lexer')

let tokenizer = new Tokenizer("  ")
tokenizer.skipWhiteSpace()
console.log(tokenizer.offset)