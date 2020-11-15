module.exports = {
    DebugLog: (string) => {
        if (process.env.DEBUG_LOGS === 'true') {
            console.log(string);
        }
    }
}
