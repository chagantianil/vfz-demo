const createExtendedProduct =
    require('*/cartridge/scripts/apis/productExtend').createExtendedProduct

const getProductBadge = require('*/cartridge/scripts/product/badge').getProductBadge

/**
 *
 * @param {object} productSearchResult
 */
exports.modifyGETResponse = function extendProduct(productSearchResult) {
    if (productSearchResult && productSearchResult.count > 0) {
        var searchCurrency = productSearchResult.hits[0].currency
        if (searchCurrency && session.currency.currencyCode !== searchCurrency) {
            session.setCurrency(dw.util.Currency.getCurrency(searchCurrency))
        }

        for (var i = 0; i < productSearchResult.hits.length; i++) {
            var hit = productSearchResult.hits[i]
            if (!empty(hit.represented_product)) {
                var product = dw.catalog.ProductMgr.getProduct(hit.represented_product.ID);
                hit.c_extend = createExtendedProduct(hit.represented_product.ID)
                hit.c_badge = getProductBadge(product)
            } else {
                hit.c_extend = {}
            }
        }
    }
}
