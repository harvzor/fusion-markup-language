const xml2js = new require('xml2js')
const xmlParser = new xml2js.Parser({
    explicitArray: false // Otherwise children become arrays.
})
var xmlBuilder = new xml2js.Builder({
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
            try {
                const result = JSON.parse(filteredInputText)

                return result
            }
            catch (e) {
                if (!e.message.startsWith('Unexpected token < in JSON at position ')) {
                    throw e
                }

                const lineNumber = parseInt(
                    e.message.replace('Unexpected token < in JSON at position ', '')
                )

                const substring = filteredInputText.substring(lineNumber)

                const obj = this.parse(substring)

                if (this.getDataType(substring) === this.dataTypeEnum.xml) {
                    const str = xmlBuilder.buildObject(obj)
                        .replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', '')
                        // .replace(/  /g, '    ')

                    let inputWithoutXml = filteredInputText

                    str
                        .split('\n')
                        .forEach(xmlSegment => {
                            inputWithoutXml = inputWithoutXml.replace(xmlSegment, '')
                        })

                    const json = JSON.parse(inputWithoutXml)

                    return json
                } else {
                    throw 'Path not implemented'
                }
            }
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
                try {
                    result[key] = JSON.parse(result[key])
                } catch (e) { }
            }

            return result;
        }
    }
}

module.exports = {
    FusionMarkupLanguage: FusionMarkupLanguage,
};
