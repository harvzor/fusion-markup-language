const xmlParser = new require('xml2js').Parser({
    explicitArray: false // Otherwise children become arrays.
})

class FusionMarkupLanguage {
    constructor() {
        this.dataTypeEnum = {
            json: "JSON",
            xml: "XML",
        }
    }
    getDataType(inputText) {
        const filteredInputText = inputText.trim();

        if (filteredInputText.startsWith("{")) {
            return this.dataTypeEnum.json
        }

        if (filteredInputText.startsWith("<")) {
            return this.dataTypeEnum.xml
        }

        return null
    }
    parse(inputText) {
        const filteredInputText = inputText.trim();
        const dataType = this.getDataType(filteredInputText);

        if (dataType === this.dataTypeEnum.json) {
            const result = JSON.parse(filteredInputText)

            return result
        }

        if (dataType === this.dataTypeEnum.xml) {
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
    }
}

module.exports = {
    FusionMarkupLanguage: FusionMarkupLanguage,
};
