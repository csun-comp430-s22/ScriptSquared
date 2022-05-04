const { BooleanExp, Exp, ExpMethodExp, IntegerExp, NewClassExp, OpExp, StringExp, ThisExp, VariableExp } = require("../Parser/Expressions");
const { DivideOp, DotOp, EqualOp, GreaterThanEqualOp, GreaterThanOp, LessThanEqualOp, LessThanOp, MinusOp, MultiplyOp, NotEqualOp, PlusOp } = require("../Parser/Operations");
const { BooleanType, ClassNameType, IntType, StringType, Type } = require("../Parser/Type");
const { instance_of } = require("../utils");
const { TypeError } = require("./TypeError")

class TypeChecker {

    // Things to track:
    // 1. Variables in scope, and their types
    // 2. Classes available, parameters constructors take, methods they have, what their parent class is

    // Sorts of queries we want to make to calss information: 
    // 1. Is this a valid class?
    // 2. For this class, what ar ethe argument types fo rthe constructor? 
    // 3. Does this class support a given method? If so, what are the parameter
    //    types for the method?
    //      - Need to take inheritance into account
    // 4. Is this given class a subclass of another class?
    // 5. Does our class hierarchy form a tree (aka no cycles)?

    constructor(program) {
        const classList = program.classDecList;
        
        // className: object => key: methodname, value: array of param types in order
        this.classMethodMap = {}

        classList.forEach(classDec => {
            const className = classDec.classNameType.value
            const methodsArray = this.extractMethodsFromClass(className, classList)
            this.classMethodMap[className] = this.convertMethodArrayToObj(methodsArray)
        })

        // TODO: check that class hierarchy is a tree (no cycles)
    }

    extractMethodsFromClass(className, classList) {
        const classDec = classList.find(classDec => classDec.classNameType.value === className)
        let classMethods = [...classDec.methodDecList]
        
        if (classDec.superClassName.value !== "Object") {
            const superClassMethods = this.extractMethodsFromClass(classDec.superClassName.value, classList)
            classMethods = classMethods.concat(superClassMethods)
        }

        return classMethods;
    }

    convertMethodArrayToObj(methodArray) {
        const methodMap = {}

        methodArray.forEach(methodDec => {
            methodMap[methodDec.methodName.value] = methodDec.varDecList.map(vardec => vardec.type)
        })

        return methodMap;
    }



    /**
     * @param {*} exp An Expression variable
     * @param {*} typeEnvironment An object that maps key:"Variable" to value:"Type"
     * @param {*} classWeAreIn The current class that is in scope (string); Is "null" if in entry point
     * @returns The type of an expression
     */
    expTypeof(exp, typeEnvironment = {}, classWeAreIn) {
        if (instance_of(exp, IntegerExp)) {
            return new IntType();
        } 
        else if (instance_of(exp, StringExp)) {
            return new StringType();
        }
        else if (instance_of(exp, BooleanExp)) {
            return new BooleanType();
        }
        else if (instance_of(exp, VariableExp)) {
            return this.typeofVariable(exp, typeEnvironment);
        }
        else if (instance_of(exp, ThisExp)) {
           return this.typeofThis(classWeAreIn);
        }
        else if (instance_of(exp, OpExp)) {
            return this.typeofOpExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, ExpMethodExp)) {
            return this.typeofExpMethodExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, NewClassExp)) {

        }
        else {

        }
    }

    typeofVariable(variableExp, typeEnvironment) {
        const variable = variableExp.value
        if (variable in typeEnvironment) {
            return typeEnvironment[variable];
        }

        throw new TypeError("Used variable not in scope: " + variable);
    }

    typeofThis(classWeAreIn) {
        if (classWeAreIn === null) 
            throw new TypeError("'this' used in the entry point");
        else 
            return new ClassNameType(classWeAreIn);
    }

    typeofOpExp(OpExp, typeEnvironment, classWeAreIn) {
        leftType = this.expTypeof(OpExp.leftExp, typeEnvironment, classWeAreIn)
        rightType = this.expTypeof(OpExp.rightExp, typeEnvironment, classWeAreIn)
        op = OpExp.op

        if (instance_of(op, PlusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: +")
        }
        else if (instance_of(op, MinusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: -")
        }
        else if (instance_of(op, MultiplyOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: *")           
        }
        else if (instance_of(op, DivideOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: /")           
        }
        else if (instance_of(op, GreaterThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >")           
        }
        else if (instance_of(op, LessThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <")           
        }
        else if (instance_of(op, GreaterThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >=")           
        }
        else if (instance_of(op, LessThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <=")           
        }
        else if (instance_of(op, EqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: ==")           
        }
        else if (instance_of(op, NotEqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: !=")           
        }
        else {
            throw new TypeError("Unsupported operation: " + op);
        }
    }

    expectedParamTypesForClassAndMethod(className, methodName) {
        
    }

    typeofExpMethodExp(ExpMethodExp, typeEnvironment, classWeAreIn) {
        const parentExpType = this.expTypeof(ExpMethodExp.parentExp, typeEnvironment, classWeAreIn)
        const parameterExpsArray = this.expTypeof(ExpMethodExp.parameterExpsArray, typeEnvironment, classWeAreIn)

        if (!instance_of(parentExpType, ClassNameType))
            throw new TypeError("Called method on non-class type: " + parentExpType);

        const className = parentExpType.value
    }

    typeofNewClassExp() {

    }
}

module.exports = TypeChecker;