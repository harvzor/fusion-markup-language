var assert = require('assert')

const FML = require('../index.js')

describe('FusionMarkupLanguage', () => {
    describe('#getDataType()', () => {
        it('should be of type JSON', () => {
            const dataType = FML.getDataType(`
                {
                    "person": {
                        <firstName>Rick</firstName>
                        <lastName>Astley</lastName>
                    }
                }
            `)

            assert.equal(FML.dataTypeEnum.json, dataType)
        })

        it('should be of type XML', () => {
            const dataType = FML.getDataType(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    {
                        "firstName": "Rick",
                        "lastName": "Astley"
                    }
                </person>
            `)

            assert.equal(FML.dataTypeEnum.xml, dataType)
        })

        it('should not know the datatype', () => {
            const dataType = FML.getDataType(`
                ?person
                    {
                        "firstName": "Rick",
                        "lastName": "Astley"
                    }
                ?person
            `)

            assert.equal(null, dataType)
        })
    })

    describe('#findElementClosestToPosition()', () => {
        it('it should find "person"', () => {
            const elementName = FML.findElementClosestToPosition(`{ "person": { } }`, 13)

            assert.equal(elementName, "person")
        })
    })

    describe('#parse()', () => {
        it('should parse just JSON', () => {
            const parsed = FML.parse(`
                {
                    "person": {
                        "firstName": "Rick",
                        "lastName": "Astley"
                    }
                }
            `)

            assert.deepEqual(parsed, {
                person: {
                    firstName: "Rick",
                    lastName: "Astley"
                }
            })
        })

        it('should parse just XML', () => {
            const parsed = FML.parse(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    <firstName>Rick</firstName>
                    <lastName>Astley</lastName>
                </person>
            `)

            assert.deepEqual(parsed, {
                person: {
                    firstName: "Rick",
                    lastName: "Astley"
                }
            })
        })

        it('should parse JSON in XML', () => {
            const parsed = FML.parse(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <person>
                    {
                        "firstName": "Rick",
                        "lastName": "Astley"
                    }
                </person>
            `)

            assert.deepEqual(parsed, {
                person: {
                    firstName: "Rick",
                    lastName: "Astley"
                }
            })
        })

        it('should parse multiple nodes with JSON in XML', () => {
            const parsed = FML.parse(`
                <?xml version="1.0" encoding="UTF-8" ?>
                <people>
                    <person>
                        {
                            "firstName": "Rick",
                            "lastName": "Astley"
                        }
                    </person>
                    <person>
                        {
                            "firstName": "Park",
                            "lastName": "Jae-sang"
                        }
                    </person>
                </people>
            `)

            assert.deepEqual(parsed, {
                people: {
                    person: [
                        {
                            firstName: "Rick",
                            lastName: "Astley"
                        },
                        {
                            firstName: "Park",
                            lastName: "Jae-sang"
                        }
                    ]
                }
            })
        })

        it('should parse XML in JSON', () => {
            const parsed = FML.parse(`
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

        it('should parse JSON in XML in JSON', () => {
            const parsed = FML.parse(`
                {
                    "person": {
                        <name>
                            {
                                "firstName": "Rick",
                                "lastName": "Astley"
                            }
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
