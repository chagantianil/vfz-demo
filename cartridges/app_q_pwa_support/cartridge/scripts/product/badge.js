
/**
 *
 * @param {dw.catalog.Product} product
 * @returns {object} badge config
 */
module.exports.getProductBadge = function getProductBadge(product) {
    /** @type {Array<string>} */
    const productBadgeConfiguration =
        dw.system.Site.current.getCustomPreferenceValue('composableBadgeConfig')

    if (!product || !productBadgeConfiguration) {
        return null
    }

    const productAttributeModel = product.attributeModel

    // loop through the product badge configuration set the badge to the first product custom attribute that matches
    // the product badge configuration
    for (let i = 0; i < productBadgeConfiguration.length; i++) {
        const badgeConfigParts = productBadgeConfiguration[i].split('|')
        const attrId = badgeConfigParts[0]
        const attribute = productAttributeModel.getAttributeDefinition(attrId)
        if (attribute) {
            const attrValue = productAttributeModel.getDisplayValue(attribute)

            if (!!attrValue && badgeConfigParts.length > 1) {
                // return the configured string in the preference
                return {
                    attrId: attrId,
                    value: badgeConfigParts[1]
                }
            } else if (
                !!attrValue &&
                attribute.valueTypeCode === dw.object.ObjectAttributeDefinition.VALUE_TYPE_BOOLEAN
            ) {
                // return the attribute name for truthy boolean values
                return {
                    attrId: attrId,
                    value: attribute.displayName
                }
            } else if (attrValue) {
                // return the attribute value for all other attribute types as long as it's truthy
                return {
                    attrId: attrId,
                    value: attrValue
                }
            }
        }
    }
    return null
}
