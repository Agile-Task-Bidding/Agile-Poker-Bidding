class Utils {
    
    DebugLog(string) {
        if (process.env.DEBUG_LOGS === 'true') {
            console.log(string);
        } 
    }

}

module.exports.Utils = new Utils();
