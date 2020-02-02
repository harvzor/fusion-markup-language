const xmlParser = new require('xml2js').Parser({
    explicitArray: false // Otherwise children become arrays.
})

class FusionMarkupLanguage {
    constructor() {

    }
    parse(inputText) {
        const filteredInputText = inputText.trim();

        try
        {
            const result = JSON.parse(filteredInputText)

            // console.log(result)

            return result
        }
        catch (e)
        {
            try
            {
                let result = null
                let error = null

                xmlParser.parseString(filteredInputText, (fail, res) => {
                    error = fail
                    result = res
                })

                if (error)
                    throw error

                for (let key of Object.keys(result)) {
                    try
                    {
                        result[key] = JSON.parse(result[key])
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
