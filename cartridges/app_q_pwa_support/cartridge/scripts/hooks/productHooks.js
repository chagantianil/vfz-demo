const createExtendedProduct = require('*/cartridge/scripts/apis/productExtend.js')
    .createExtendedProduct
const getProductBadge = require('*/cartridge/scripts/product/badge').getProductBadge

/**
 *
 * @param {dw.catalog.Product} product
 * @param {object} productDoc
 */
exports.modifyGETResponse = function extendProduct(product, productDoc) {
    // TODO: extended product needs to support ranges, etc

    var productCurrency = productDoc.currency
    if (productCurrency && session.currency.currencyCode !== productCurrency) {
        session.setCurrency(dw.util.Currency.getCurrency(productCurrency))
    }

    productDoc.c_extend = createExtendedProduct(
        product.master ? product.variationModel.defaultVariant.ID : product.ID
    )

    productDoc.c_badge = getProductBadge(product)
}
