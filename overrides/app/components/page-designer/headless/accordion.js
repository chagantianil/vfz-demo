import React from 'react'
import PropTypes from 'prop-types'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Image,
    Text
} from '@salesforce/retail-react-app/app/components/shared/ui'

/**
 * Accordion component that renders accordion items from regions
 * Uses Chakra UI Accordion component
 * 
 * @param {PDComponent} component - Page Designer component with regions
 * @return {JSX.Element}
 * @constructor
 */
function PDAccordion({component}) {
    const {allowMultiple, defaultIndex} = component.data
    const itemsRegion = component.regions?.find(r => r.id === 'items') || component.regions?.[0]
    
    // Parse defaultIndex - can be a single number or comma-separated for multiple
    const parseDefaultIndex = () => {
        if (!defaultIndex) return undefined
        if (allowMultiple) {
            return defaultIndex.split(',').map(i => parseInt(i.trim(), 10)).filter(i => !isNaN(i))
        }
        const parsed = parseInt(defaultIndex, 10)
        return isNaN(parsed) ? undefined : parsed
    }

    const accordionProps = {
        allowMultiple: allowMultiple || false,
        allowToggle: !allowMultiple,
        defaultIndex: parseDefaultIndex()
    }

    return (
        <Box>
            <Accordion {...accordionProps}>
                {itemsRegion?.components?.map((item) => {
                    const {title, content, isDisabled} = item.data
                    const icon = item.custom?.icon
                    
                    return (
                        <AccordionItem key={item.id} isDisabled={isDisabled}>
                            <h2>
                                <AccordionButton>
                                    {icon?.disBaseLink && (
                                        <Image
                                            src={icon.disBaseLink}
                                            alt=""
                                            boxSize="24px"
                                            mr={2}
                                        />
                                    )}
                                    <Box flex="1" textAlign="left">
                                        <Text fontWeight="semibold">{title}</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Box dangerouslySetInnerHTML={{__html: content}} />
                            </AccordionPanel>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </Box>
    )
}

PDAccordion.propTypes = {
    component: PropTypes.object
}

export default PDAccordion

