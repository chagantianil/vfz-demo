import React from 'react'
import PropTypes from 'prop-types'
import {Button, Box} from '@chakra-ui/react'
import {DrawerContext} from './drawer'

/**
 * Button component using Chakra UI Button
 * 
 * @param {PDComponent} component - Page Designer component
 * @return {JSX.Element}
 * @constructor
 */
function PDButton({component}) {
    const {
        label,
        size = 'md',
        variant = 'solid',
        colorScheme = 'blue',
        isDisabled = false,
        isLoading = false,
        loadingText,
        href,
        target,
        drawerAction
    } = component.data || {}
    
    // Get drawer context if available (for open/close actions)
    const drawerContext = React.useContext(DrawerContext)
    const {onOpen, onClose} = drawerContext || {}
    
    // Extract label value
    const labelValue = typeof label === 'string' 
        ? label 
        : (label?.result != null) 
            ? String(label.result) 
            : (label != null) 
                ? String(label) 
                : ''
    
    // If no label, show a placeholder for debugging
    if (!labelValue) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('PDButton: Missing label', {componentData: component.data})
        }
        return (
            <Box p={2} borderWidth="1px" borderColor="red.300" borderRadius="md" bg="red.50">
                <Box fontSize="sm" color="red.600">
                    Button: Missing label
                </Box>
            </Box>
        )
    }
    
    // Handle drawer actions
    const handleClick = (e) => {
        if (drawerAction === 'open' && onOpen) {
            e.preventDefault()
            e.stopPropagation()
            onOpen()
        } else if (drawerAction === 'close' && onClose) {
            e.preventDefault()
            e.stopPropagation()
            onClose()
        }
    }
    
    const buttonProps = {
        size,
        variant,
        colorScheme,
        isDisabled: isDisabled || false,
        isLoading: isLoading || false,
        loadingText: loadingText || undefined,
        ...(href && {as: 'a', href, target}),
        ...(drawerAction && {onClick: handleClick})
    }
    
    return (
        <Button {...buttonProps}>
            {labelValue}
        </Button>
    )
}

PDButton.propTypes = {
    component: PropTypes.object
}

export default PDButton

