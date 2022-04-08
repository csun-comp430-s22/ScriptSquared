 
class AccessToken {}

class PublicToken extends AccessToken {
    
    constructor() {
         
        this.value = "public"
    }
    
}

class PrivateToken extends AccessToken {
    
    constructor() {
         
        this.value = "private"
    }
}

class ProtecToken extends AccessToken {
    
    constructor() {
         
        this.value = "protec"
    }
}


module.exports = {
    AccessToken,
    PublicToken,
    PrivateToken,
    ProtecToken
};