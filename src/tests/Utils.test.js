const Tokenizer = require("../Lexer/Tokenizer");
const { PublicModifier } = require("../Parser/AccessModifier");
const { Parser } = require("../Parser/Parser");
const { IntType, StringType, BooleanType, VoidType } = require("../Parser/Type");
const { VarDec } = require("../Parser/Vardec");
const { Variable } = require("../Parser/Variable");
const {arraysEqual, arrayMatchType, parseList} = require("../utils")



function expectTokenizes (input) {
    const tokenizer = new Tokenizer(input)
    const result = tokenizer.tokenize()
    return result;
}


let vardecList = [new VarDec(new IntType(), new Variable("test")),
                  new VarDec(new IntType(), new Variable("test2")),
                  new VarDec(new StringType(), new Variable("test3")),
                  new VarDec(new BooleanType(), new Variable("test4"))]

let vardecListSame = [new VarDec(new IntType(), new Variable("test")),
                      new VarDec(new IntType(), new Variable("test2")),
                      new VarDec(new StringType(), new Variable("test3")),
                      new VarDec(new BooleanType(), new Variable("test4"))]

let vardecListDifferent1 = [new VarDec(new IntType(), new Variable("test")),
                            new VarDec(new IntType(), new Variable("test10000")),
                            new VarDec(new StringType(), new Variable("test3")),
                            new VarDec(new BooleanType(), new Variable("test4"))]

let vardecListDifferent2 = [new VarDec(new IntType(), new Variable("test")),
                            new VarDec(new IntType(), new Variable("test2")),
                            new VarDec(new StringType(), new Variable("test3")),
                            new VarDec(new VoidType(), new Variable("test4"))]

let vardecListDifferent3 = [new VarDec(new IntType(), new Variable("test")),
                            new VarDec(new IntType(), new Variable("test2")),
                            new PublicModifier(),
                            new VarDec(new VoidType(), new Variable("test4"))]

function expectParseStmt(string) {
    let tokens = expectTokenizes(string)
    let parser = new Parser(tokens)
    let result = parser.parseStmt(0)

    return result;
}

// const result = expectParseStmt("int temp = 1; int temp2 = 2; int temp3 = 3;")
// console.log(result)
    

describe("Testing arraysEqual", () => {

    test("Should return true if all elements are same type and same value", () => {
        expect(arraysEqual(vardecList, vardecListSame)).toBe(true)
    })

    describe("Should return false if values are different", () => {
        test("Vardec with different variable", () => {
            expect(arraysEqual(vardecList, vardecListDifferent1)).toBe(false)
        })

        test("Vardec with different type", () => {
            expect(arraysEqual(vardecList, vardecListDifferent2)).toBe(false)
        })
    })

    test("Should return false if types are different", () => {
        expect(arraysEqual(vardecList, vardecListDifferent3)).toBe(false)
    })

    test("Should return false if arrays are different sizes", () => {
        expect(arraysEqual(vardecList, [])).toBe(false)
    })
})

describe("Testing arrayMatchType", () => {

    test("Should return true if all elements in array are of same type", () => {
        expect(arrayMatchType(vardecList, VarDec)).toBe(true)
    })

    test("Should return false if any one of the elements is of different type", () => {
        expect(arrayMatchType(vardecListDifferent3, VarDec)).toBe(false)
    })
})

// describe("Testing parseList", () => {

//     test("Should return new position after parsing", () => {
//         const result = expectParseStmt("int temp = 1; int temp2 = 2; int temp3 = 3;")
//         console.log(result)
//         expect().toBe(false)
//     })

//     test("Should return a list of all parseResults", () => {
//         expect().toBe(false)
//     })

//     test("Should return empty if nothing is parsed", () => {
//         expect().toBe(false)
//     })

//     test("Should return empty if wrong parseFunction is passed", () => {
//         expect().toBe(false)
//     })
// })