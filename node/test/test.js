var assert = require('assert')

const FusionMarkupLanguage = require('../index.js')
const fml = new FusionMarkupLanguage()

describe('FusionMarkupLanguage', () => {
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
    })

    describe('#parse()', () => {
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

            console.warn('parsed', parsed)

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
