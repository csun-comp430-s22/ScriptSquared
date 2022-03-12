class Token {

    static equals (other) {
        return other instanceof this;
    }

    static getTokenValue () {
        return this.value;
    }
}

module.exports = Token;