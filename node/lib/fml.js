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
                let data = null
                let error = null

                xmlParser.parseString(text, (fail, result) => {
                    error = fail
                    data = result
                })

                if (error)
                    throw error

                return data

                // return xmlParser.parseString(text, (err, result) => {
                //     return result
                // })
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
