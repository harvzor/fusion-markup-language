var assert = require('assert')

const FusionMarkupLanguage = require('../index.js')
const fml = new FusionMarkupLanguage()

describe('FusionMarkupLanguage', () => {
    describe('#getDataType()', () => {
        it('should be of type JSON', () => {
            const dataType = fml.getDataType(`
                {
                    "person": {
                        <name>
                            <firstName>Rick</firstName>
                            <lastName>Astley</lastName>
                        </name>
                    }
                }
            `)

            assert.equal(fml.dataTypeEnum.json, dataType)
        })

        it('should be of type XML', () => {
            const dataType = fml.getDataType(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    {
                        "name": {
                            "firstName": "Rick",
                            "lastName": "Astley"
                        }
                    }
                </person>
            `)

            assert.equal(fml.dataTypeEnum.xml, dataType)
        })

        it('should not know the datatype', () => {
            const dataType = fml.getDataType(`
                ?person
                    {
                        "name": {
                            "firstName": "Rick",
                            "lastName": "Astley"
                        }
                    }
                ?person
            `)

            assert.equal(null, dataType)
        })
    })

    describe('#findElementClosestToPosition()', () => {
        it('it should find "person"', () => {
            const elementName = fml.findElementClosestToPosition(`{ "person": { } }`, 13)

            assert.equal(elementName, "person")
        })
    })

    describe('#parse()', () => {
        it('should parse just JSON', () => {
            const parsed = fml.parse(`
                {
                    "person": {
                        "name": {
                            "firstName": "Rick",
                            "lastName": "Astley"
                        }
                    }
                }
            `)

            assert.deepEqual(parsed, {
                person: {
                    name: {
                        firstName: "Rick",
                        lastName: "Astley"
                    }
                }
            })
        })

        it('should parse just XML', () => {
            const parsed = fml.parse(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    <name>
                        <firstName>Rick</firstName>
                        <lastName>Astley</lastName>
                    </name>
                </person>
            `)

            assert.deepEqual(parsed, {
                person: {
                    name: {
                        firstName: "Rick",
                        lastName: "Astley"
                    }
                }
            })
        })

        it('should parse JSON in XML', () => {
            const parsed = fml.parse(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    {
                        "name": {
                            "firstName": "Rick",
                            "lastName": "Astley"
                        }
                    }
                </person>
            `)

            assert.deepEqual(parsed, {
                person: {
                    name: {
                        firstName: "Rick",
                        lastName: "Astley"
                    }
                }
            })
        })

        it('should parse XML in JSON', () => {
            const parsed = fml.parse(`
                {
                    "person": {
                        <name>
                            <firstName>Rick</firstName>
                            <lastName>Astley</lastName>
                        </name>
                    }
                }
            `)

            assert.deepEqual(parsed, {
                person: {
                    name: {
                        firstName: "Rick",
                        lastName: "Astley"
                    }
                }
            })
        })
    })
})
