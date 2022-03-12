const Tokenizer = require('../Lexer/Lexer')

let tokenizer = new Tokenizer("4578")
console.log(tokenizer.test())

// expect(tokenizer.test()).toBe(true)