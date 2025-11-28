/* eslint-disable no-unused-vars */
function validatePayment(order) {
    return true
}

function sendConfirmationMail(order) {
    return true
}

function rollbackPayments(order) {
    return true
}

exports.beforePATCH = function(order, orderInput) {}

// create order
// eslint-disable-next-line no-unused-vars
/**
 *
 * @param {dw.order.Order} order
 * @param {object} orderInput
 * @return {dw.system.Status}
 */
exports.afterPOST = function(order, orderInput) {
    // authorize all and create transactions
    var instruments = order.getPaymentInstruments('CREDIT_CARD').iterator()
    var creditCardProcessor = dw.order.PaymentMgr.getPaymentMethod('CREDIT_CARD').paymentProcessor
    while (instruments.hasNext()) {
        var instrument = instruments.next()
        var transaction = instrument.getPaymentTransaction()
        if (transaction) {
            transaction.setTransactionID(order.orderNo)
            transaction.setPaymentProcessor(creditCardProcessor)

            transaction.amount = order.totalGrossPrice
        }
    }

    instruments = order.getPaymentInstruments('CREDIT_CARD').iterator()
    if (instruments.hasNext()) {
        var firstCreditCard = instruments.next()
        if (firstCreditCard.creditCardHolder.includes('FAIL')) {
            dw.order.OrderMgr.failOrder(order, true)
            return new dw.system.Status(dw.system.Status.ERROR, 'FAILED', 'Order failed by request')
        }
    }

    // place order
    var orderStatus = dw.order.OrderMgr.placeOrder(order)
    if (!orderStatus.error) {
        order.setExportStatus(dw.order.Order.EXPORT_STATUS_READY)
        order.setConfirmationStatus(dw.order.Order.CONFIRMATION_STATUS_CONFIRMED)
    }
    return orderStatus
}
