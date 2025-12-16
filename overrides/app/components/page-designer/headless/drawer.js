import React, {useState, createContext} from 'react'
import PropTypes from 'prop-types'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Box
} from '@chakra-ui/react'
import {PageDesignerComponent} from '../tree'

// Context for drawer open/close functions
const DrawerContext = createContext({
    onOpen: () => {},
    onClose: () => {}
})

/**
 * Drawer component that displays content in a slide-out panel
 * Uses Chakra UI Drawer component
 * 
 * @param {PDComponent} component - Page Designer component
 * @return {JSX.Element}
 * @constructor
 */
function PDDrawer({component}) {
    const {
        placement = 'right',
        size = 'md',
        closeOnEsc = true,
        closeOnOverlayClick = true,
        blockScrollOnMount = true,
        trapFocus = true,
        showCloseButton = true,
        defaultIsOpen = false,
        motionPreset = 'none' // Set to 'none' for instant opening, or 'slide'/'scale' for animation
    } = component.data || {}
    
    const [isOpen, setIsOpen] = useState(defaultIsOpen || false)
    const onOpen = () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('PDDrawer: onOpen called, setting isOpen to true')
        }
        setIsOpen(true)
    }
    const onClose = () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('PDDrawer: onClose called, setting isOpen to false')
        }
        setIsOpen(false)
    }
    
    // Get regions
    const triggerRegion = component.regions?.find(r => r.id === 'trigger') || component.regions?.[0]
    const headerRegion = component.regions?.find(r => r.id === 'header')
    const bodyRegion = component.regions?.find(r => r.id === 'body') || component.regions?.find(r => r.id === 'content')
    const footerRegion = component.regions?.find(r => r.id === 'footer')
    
    // If no trigger region, show a placeholder
    if (!triggerRegion?.components) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('PDDrawer: Missing trigger region', {componentData: component.data, regions: component.regions})
        }
        return (
            <Box p={2} borderWidth="1px" borderColor="red.300" borderRadius="md" bg="red.50">
                <Box fontSize="sm" color="red.600">
                    Drawer: Missing trigger region. Add a component to the trigger region to open the drawer.
                </Box>
            </Box>
        )
    }
    
    const drawerProps = {
        isOpen,
        onClose,
        placement,
        size,
        closeOnEsc: closeOnEsc !== false,
        closeOnOverlayClick: closeOnOverlayClick !== false,
        blockScrollOnMount: blockScrollOnMount !== false,
        trapFocus: trapFocus !== false,
        motionPreset: motionPreset || 'none' // 'none' for instant, 'slide'/'scale' for animation
    }
    
    // Wrap trigger region components with click handler
    const handleTriggerClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (process.env.NODE_ENV === 'development') {
            console.log('PDDrawer: Trigger clicked, opening drawer', {isOpen, onOpen})
        }
        onOpen()
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
        }
    }
    
    const triggerWithClick = (
        <Box 
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            cursor="pointer" 
            display="inline-block"
            role="button"
            tabIndex={0}
            aria-label="Open drawer"
            style={{pointerEvents: 'auto'}}
        >
            {triggerRegion?.components?.map((c) => (
                <Box key={c.id} style={{pointerEvents: 'auto'}}>
                    <PageDesignerComponent component={c} />
                </Box>
            ))}
        </Box>
    )
    
    return (
        <DrawerContext.Provider value={{onOpen, onClose}}>
            {triggerWithClick}
            <Drawer {...drawerProps}>
                <DrawerOverlay />
                <DrawerContent>
                    {showCloseButton && <DrawerCloseButton />}
                    {headerRegion?.components && (
                        <DrawerHeader>
                            {headerRegion.components.map((c) => (
                                <Box key={c.id}>
                                    <PageDesignerComponent component={c} />
                                </Box>
                            ))}
                        </DrawerHeader>
                    )}
                    {bodyRegion?.components && (
                        <DrawerBody>
                            {bodyRegion.components.map((c) => (
                                <Box key={c.id}>
                                    <PageDesignerComponent component={c} />
                                </Box>
                            ))}
                        </DrawerBody>
                    )}
                    {footerRegion?.components && (
                        <DrawerFooter>
                            {footerRegion.components.map((c) => (
                                <Box key={c.id}>
                                    <PageDesignerComponent component={c} />
                                </Box>
                            ))}
                        </DrawerFooter>
                    )}
                </DrawerContent>
            </Drawer>
        </DrawerContext.Provider>
    )
}

PDDrawer.propTypes = {
    component: PropTypes.object
}

export default PDDrawer

// Export context for use in other components
export {DrawerContext}

