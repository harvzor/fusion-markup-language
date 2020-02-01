var assert = require('assert');

const FusionMarkupLanguage = require('../index.js');
const fml = new FusionMarkupLanguage();

describe('FusionMarkupLanguage', () => {
    describe('#parse()', () => {
        it('should parse JSON', () => {
            const parsed = fml.parse(`
                {
                    "person": {
                        "name": {
                            "firstName": "Harvey"
                        }
                    }
                }
            `);

            assert.deepEqual(parsed, {
                person: {
                    name: {
                        firstName: "Harvey"
                    }
                }
            })
        });
    });
});
