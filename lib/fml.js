const xml2js = new require('xml2js')

const xmlParser = new xml2js.Parser({
    explicitArray: false // Otherwise children become arrays.
})

const xmlBuilder = new xml2js.Builder({
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
    findElementClosestToPosition(text, position) {
        for (let i = position; i > 0; i--) {
            if (text[i] === `"`) {
                for (let i2 = i - 1; i2 > 0; i2--) {
                    if (text[i2] === `"`) {
                        return text.substring(i2 + 1, i)
                    }
                }
            }
        }
    }
    parse(inputText) {
        const filteredInputText = inputText.trim();
        const dataType = this.getDataType(filteredInputText);

        if (dataType === this.dataTypeEnum.json) {
            try {
                const result = JSON.parse(filteredInputText)

                return result
            } catch (e) {
                if (!e.message.startsWith('Unexpected token < in JSON at position ')) {
                    throw e
                }

                const lineNumber = parseInt(
                    e.message.replace('Unexpected token < in JSON at position ', '')
                )

                let xmlSubstring = filteredInputText.substring(lineNumber)

                const xmlObject = this.parse(xmlSubstring)

                const elementClosingTag = `</${Object.keys(xmlObject)[0]}>`
                const indexOfElementClosingTag = xmlSubstring.indexOf(elementClosingTag)
                xmlSubstring = xmlSubstring.substring(0, indexOfElementClosingTag + elementClosingTag.length)

                if (this.getDataType(xmlSubstring) === this.dataTypeEnum.xml) {
                    const elements = xmlBuilder.buildObject(xmlObject)
                        .replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', '')

                    let inputWithoutXml = filteredInputText

                    inputWithoutXml = inputWithoutXml.replace(xmlSubstring, '')

                    const elementName = this.findElementClosestToPosition(inputWithoutXml, lineNumber)

                    const json = JSON.parse(inputWithoutXml)

                    json[elementName] = xmlObject

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

            const recursiveReplace = function(obj) {
                if (typeof obj === 'string') {
                    // this.parse(obj)

                    try {
                        return JSON.parse(obj)
                    } catch(e) {}
                }

                for (let key of Object.keys(obj)) {
                    let contents = obj[key]

                    if (typeof contents === 'string') {
                        // this.parse(obj)

                        try {
                            obj[key] = JSON.parse(contents)
                        } catch(e) {}
                    } else if (Array.isArray(contents)) {
                        for (let i = 0; i < contents.length; i++) {
                            contents[i] = recursiveReplace(contents[i])
                        }
                        // for (let item of contents) {
                        //     item = recursiveReplace(item)
                        // }
                    } else if (typeof contents === 'object' && contents !== null) {
                        contents = recursiveReplace(contents)
                    }

                    // obj[key] = contents;
                }

                return obj;
            };

            result = recursiveReplace(result)

            return result;
        }
    }
}

module.exports = {
    FML: new FusionMarkupLanguage(),
};
