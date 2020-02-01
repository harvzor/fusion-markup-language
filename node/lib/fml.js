class FusionMarkupLanguage {
    constructor() {

    }
    parse(text) {
        return JSON.parse(text);
    }
}

module.exports = {
    FusionMarkupLanguage: FusionMarkupLanguage,
};
