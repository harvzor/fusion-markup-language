const xmlParser = new require('xml2js').Parser({
    explicitArray: false // Otherwise children become arrays.
})

class FusionMarkupLanguage {
    constructor() {

    }
    parse(text) {
        try
        {
            const result = JSON.parse(text)

            // console.log(result)

            return result
        }
        catch (e)
        {
            try
            {
                let result = null
                let error = null

                xmlParser.parseString(text, (fail, res) => {
                    error = fail
                    result = res
                })

                if (error)
                    throw error

                console.warn('result', result)

                for (let key of Object.keys(result)) {
                    console.log('item', result[key])

                    try
                    {
                        result[key] = JSON.parse(result[key])
                        // result[key] = this.parse(JSON.stringify(result[key]))
                    }
                    catch (e) { }
                }

                return result;
            }
            catch (e)
            {
                throw e;
                // throw "Failed to parse."
            }
        }

    }
}

module.exports = {
    FusionMarkupLanguage: FusionMarkupLanguage,
};
