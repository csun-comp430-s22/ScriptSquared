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

        // add a class component so each class has their own methods
        // methodname: return type
        this.methodReturnType = {}

        // type: array of subtypes
        this.typeTree = {
            "Object": []
        }

        // Create type tree
        classList.forEach(classDec => {
            this.insertIntoTypeTree(classDec, this.typeTree)
        })

        // Check for Cycles
        let trackerMap = {}
        this.checkForCycles(this.typeTree, "Object", this.typeTree.Object, trackerMap)
        if (Object.keys(trackerMap).length < classList.length)
            throw new TypeError("There is a cycle in the class hierarchy");

        // Fill classMethodMap and methodReturnType
        classList.forEach(classDec => {
            const className = classDec.classNameType.value
            const methodsArray = this.extractMethodsFromClass(className, classList)
            this.classMethodMap[className] = this.convertMethodArrayToObjAndExtractMethodTypes(methodsArray, this.methodReturnType)
        })

    }

    extractMethodsFromClass(className, classList) {
        const classDec = classList.find(classDec => classDec.classNameType.value === className)
        if (classDec === undefined) {
            throw new TypeError("Class '" + className + "' is not defined")
        }

        let classMethods = [...classDec.methodDecList]
        
        if (classDec.superClassName.value !== "Object") {
            const superClassMethods = this.extractMethodsFromClass(classDec.superClassName.value, classList)
            classMethods = classMethods.concat(superClassMethods)
        }

        return classMethods;
    }

    convertMethodArrayToObjAndExtractMethodTypes(methodArray, methodReturnType) {
        const methodMap = {}

        methodArray.forEach(methodDec => {
            if ( !(methodDec.methodName.value in methodMap) ) {
                methodMap[methodDec.methodName.value] = methodDec.varDecList.map(vardec => vardec.type)
                methodReturnType[methodDec.methodName.value] = methodDec.type
            }  
        })

        return methodMap;
    }

    /**
     * 
     * @param {ClassDec} classDec 
     */
    insertIntoTypeTree(classDec, typeTree) {
        const classType = classDec.classNameType.value
        const parentType = classDec.superClassName.value 
        
        if (parentType in typeTree) {
            typeTree[parentType].push(classType)
        } else {
            typeTree[parentType] = []
            typeTree[parentType].push(classType)
        }

        if (!(classType in typeTree)) {
            typeTree[classType] = [] 
        }
    }

    checkForCycles(typeTree, currentType, currentSubTypeArray, trackerMap = {}) {

        if (trackerMap[currentType])
            throw new TypeError("There is a cycle in the class hierarchy");
        else 
            trackerMap[currentType] = true

        currentSubTypeArray.forEach(type => {
            this.checkForCycles(typeTree, type, typeTree[type], trackerMap)
        })
    }

    /**
     * @param {Exp} exp An Expression variable
     * @param {Object} typeEnvironment An object that maps key:"Variable" to value:"Type"
     * @param {String} classWeAreIn The current class that is in scope (string); Is "null" if in entry point
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
            this.typeofNewClassExp(exp, typeEnvironment, classWeAreIn)
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

    typeofExpMethodExp(ExpMethodExp, typeEnvironment, classWeAreIn) {
        const parentExpType = this.expTypeof(ExpMethodExp.parentExp, typeEnvironment, classWeAreIn)
        const parameterExpsTypeArray = ExpMethodExp.parameterExpsArray.map(exp => this.expTypeof(exp, typeEnvironment, classWeAreIn))

        if (!instance_of(parentExpType, ClassNameType))
            throw new TypeError("Called method on non-class type: " + parentExpType);

        const className = parentExpType.value
        const methodName = ExpMethodExp.methodName.value
        const methodTypeArray = this.expectedParamTypesForClassAndMethod(className, methodName)

        if (testArray.length !== expectedArray.length)
            throw new TypeError("Inncorrect number of parameters for call " + methodName);

        // Will throw error if something fails
        this.compareTypesInArray(parameterExpsTypeArray, methodTypeArray)
        return this.methodReturnType[methodName];
    }

    /**
     * 
     * @param {String} className 
     * @param {String} methodName 
     * @returns Array containing types for method parameters; throws error if method not in class
     */
    expectedParamTypesForClassAndMethod(className, methodName) {
        let result = this.classMethodMap[className][methodName]
        if (result === undefined)
            throw new TypeError("Method: " + methodName + " is not in class: " + className);
        
        return result;
    }

    /**
     * 
     * @param {Type[]} testArray 
     * @param {Type[]} expectedArray 
     * @returns True if have same types in same order
     */
    compareTypesInArray(testArray, expectedArray) {
        for (let i = 0; i < testArray.length; i++) {
           this.isLeftTypeofRight(testArray[i], expectedArray[i])
        }      

        return true;
    }

    /**
     * 
     * @param {Type} testType 
     * @param {Type} expectedType 
     * @returns true if test type is equal or subtype of expected type
     */
    isLeftTypeofRight(testType, expectedType) {

        if (testType.equals(expectedType))
            return true;
        else if (this.typeTree[expectedType.value].includes(testType.value))
            return true;
        else 
            throw new TypeError("Parameter type: " + testType.value + " doesn't match type: " + expectedType.value);
    }

    typeofNewClassExp(NewClassExp, typeEnvironment, classWeAreIn) {

    }
}

module.exports = TypeChecker;