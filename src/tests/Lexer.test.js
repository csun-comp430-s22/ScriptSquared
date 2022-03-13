const Tokenizer = require('../Lexer/Tokenizer')

let tokenizer = new Tokenizer("4578")

test("Is it a letter", () => {

    expect(tokenizer.isLetter("c")).toBe(true)
})