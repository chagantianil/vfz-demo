import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Box} from '@chakra-ui/react'

/**
 * Tooltip component that wraps content and displays a tooltip on hover
 * Uses Chakra UI Tooltip component
 * 
 * @param {PDComponent} component - Page Designer component
 * @return {JSX.Element}
 * @constructor
 */
function PDTooltip({component}) {
    const {
        label,
        content,
        placement = 'top',
        hasArrow = true,
        openDelay = 0,
        closeDelay = 0,
        isDisabled = false
    } = component.data || {}
    
    // Extract label value (shown on page) and content value (shown in tooltip)
    // Handle edge cases: if it's an object, try to extract result property
    const labelValue = typeof label === 'string' 
        ? label 
        : (label?.result != null) 
            ? String(label.result) 
            : (label != null) 
                ? String(label) 
                : ''
    
    const contentValue = typeof content === 'string' 
        ? content 
        : (content?.result != null) 
            ? String(content.result) 
            : (content != null) 
                ? String(content) 
                : ''
    
    // If no content or label, show a placeholder for debugging
    if (!contentValue || !labelValue) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('PDTooltip: Missing content or label', {content, label, componentData: component.data})
        }
        return (
            <Box p={2} borderWidth="1px" borderColor="red.300" borderRadius="md" bg="red.50">
                <Box fontSize="sm" color="red.600">
                    Tooltip: {!labelValue ? 'Missing label' : 'Missing content'}
                </Box>
            </Box>
        )
    }

    const tooltipProps = {
        label: (
            <Box dangerouslySetInnerHTML={{__html: contentValue}} />
        ), // Content (markup/HTML) shows IN the tooltip
        placement,
        hasArrow,
        openDelay: parseInt(openDelay, 10) || 0,
        closeDelay: parseInt(closeDelay, 10) || 0,
        isDisabled: isDisabled || false
    }

    // Render label on page (trigger), content in tooltip
    // Label (string) is the child (shown on page), content (markup) is the tooltip label (shown on hover)
    return (
        <Tooltip {...tooltipProps}>
            <Box 
                as="span" 
                display="inline-block" 
                tabIndex={0} 
                cursor="pointer"
            >
                {labelValue}
            </Box>
        </Tooltip>
    )
}

PDTooltip.propTypes = {
    component: PropTypes.object
}

export default PDTooltip

