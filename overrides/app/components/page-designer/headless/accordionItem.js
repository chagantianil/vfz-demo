import React from 'react'
import PropTypes from 'prop-types'
import {Box} from '@salesforce/retail-react-app/app/components/shared/ui'
import {withLivePreview, withThemeOverrides} from './helpers'

/**
 * Accordion Item component
 * Note: This component is typically rendered by the parent Accordion component
 * and not used standalone. It's here for the component registry.
 * 
 * @param {PDComponent} component - Page Designer component
 * @return {JSX.Element}
 * @constructor
 */
function PDAccordionItem({component}) {
    const {title, content} = component.data
    
    // This component is rendered by the parent Accordion component
    // This is a fallback for standalone rendering or debugging
    return (
        <Box p={4} borderWidth="1px" borderRadius="md">
            <Box fontWeight="semibold" mb={2}>{title}</Box>
            <Box dangerouslySetInnerHTML={{__html: content}} />
        </Box>
    )
}

PDAccordionItem.propTypes = {
    component: PropTypes.object
}

export default withLivePreview(withThemeOverrides(PDAccordionItem))

