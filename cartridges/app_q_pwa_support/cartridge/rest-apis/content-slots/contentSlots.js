const RESTResponseMgr = require('dw/system/RESTResponseMgr')

/**
 * Get a content slot, returning the content in JSON form.
 *
 * NOTE: Slots (and all their remote includes) must render valid JSON for this endpoint to work
 * otherwise invalid JSON will be returned to the client. See the /raw method below to get
 * the raw content
 */
exports.getGlobalContentSlot = function () {
    try {
        const slotId = request.httpPath.split('/').pop()

        var url = dw.web.URLUtils.url(
            '__SYSTEM__Slot-Request',
            'slotid',
            slotId,
            'context',
            'global'
        ).toString()

        // Slot content is enclosed in an array because if a slot is empty the response
        // will become an empty array rather than invalid JSON
        const resp = `{
            "slot":[<wainclude url="${url}">]
        }`

        response.setContentType('application/json')
        response.writer.print(resp)
    } catch (e) {
        var error = RESTResponseMgr.createError(500)
        error.custom.cause = e.name
        error.custom.message = e.message
        error.render()
    }
}
exports.getGlobalContentSlot.public = true

/**
 */
exports.getGlobalContentSlotHTML = function () {
    try {
        const pathParts = request.httpPath.split('/')
        const slotId = pathParts[pathParts.length - 2]

        var s = session.customer.customerGroups.toArray().map(function (g) {
            return g.ID
        })

        var url = dw.web.URLUtils.url(
            '__SYSTEM__Slot-Request',
            'slotid',
            slotId,
            'context',
            'global'
        ).toString()

        // Slot content is enclosed in an array because if a slot is empty the response
        // will become an empty array rather than invalid JSON
        const resp = `<wainclude url="${url}">`

        response.setStatus(200)
        response.setContentType('text/html')
        response.writer.print(resp)
    } catch (e) {
        var error = RESTResponseMgr.createError(500)
        error.custom.cause = e.name
        error.custom.message = e.message
        error.render()
    }
}
exports.getGlobalContentSlotHTML.public = true

/**
 */
exports.getCategoryContentSlot = function () {
    try {
        const pathParts = request.httpPath.split('/')
        const slotId = pathParts[pathParts.length - 1]
        const categoryId = pathParts[pathParts.length - 2]

        var url = dw.web.URLUtils.url(
          '__SYSTEM__Slot-Request',
          'slotid',
          slotId,
          'context',
          'category',
          'contextauid',
          categoryId,
          'contextauidtype',
          'CATEGORY'
        ).toString()

        // Slot content is enclosed in an array because if a slot is empty the response
        // will become an empty array rather than invalid JSON
        const resp = `{
            "slot":[<wainclude url="${url}">]
        }`

        response.setContentType('application/json')
        response.writer.print(resp)
    } catch (e) {
        var error = RESTResponseMgr.createError(500)
        error.custom.cause = e.name
        error.custom.message = e.message
        error.render()
    }
}
exports.getCategoryContentSlot.public = true

/**
 */
exports.getCategoryContentSlotHTML = function () {
    try {
        const pathParts = request.httpPath.split('/')
        const slotId = pathParts[pathParts.length - 2]
        const categoryId = pathParts[pathParts.length - 3]

        var url = dw.web.URLUtils.url(
            '__SYSTEM__Slot-Request',
            'slotid',
            slotId,
            'context',
            'category',
            'contextauid',
            categoryId,
            'contextauidtype',
            'CATEGORY'
        ).toString()

        // Slot content is enclosed in an array because if a slot is empty the response
        // will become an empty array rather than invalid JSON
        const resp = `<wainclude url="${url}">`

        response.setStatus(200)
        response.setContentType('text/html')
        response.writer.print(resp)
    } catch (e) {
        var error = RESTResponseMgr.createError(500)
        error.custom.cause = e.name
        error.custom.message = e.message
        error.render()
    }
}
exports.getCategoryContentSlotHTML.public = true
