/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {
    Box,
    Input,
    VStack,
    List,
    ListItem,
    Text,
    useOutsideClick
} from '@chakra-ui/react'

/**
 * Address Search Component with Google Places Autocomplete
 * 
 * This component provides an input field for searching addresses and displays
 * suggestions from Google Places API via a server-side API route.
 * 
 * @param {Function} onAddressSelect - Callback function called when an address is selected
 * @param {string} placeholder - Placeholder text for the input field
 * @param {string} apiEndpoint - API endpoint for address suggestions (default: /api/places/autocomplete)
 */
const AddressSearch = ({
    onAddressSelect,
    placeholder = 'Enter an address...',
    apiEndpoint = '/api/places/autocomplete'
}) => {
    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const containerRef = useRef(null)
    const inputRef = useRef(null)
    const debounceTimerRef = useRef(null)

    // Close suggestions when clicking outside
    useOutsideClick({
        ref: containerRef,
        handler: () => setShowSuggestions(false)
    })

    // Debounced API call
    useEffect(() => {
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        // Don't search if input is too short
        if (inputValue.trim().length < 3) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        // Set loading state
        setIsLoading(true)

        // Debounce the API call
        debounceTimerRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${apiEndpoint}?input=${encodeURIComponent(inputValue)}`)
                const data = await response.json()

                if (data.status === 'success' && data.suggestions) {
                    setSuggestions(data.suggestions)
                    setShowSuggestions(true)
                } else {
                    setSuggestions([])
                    setShowSuggestions(false)
                }
            } catch (error) {
                console.error('Error fetching address suggestions:', error)
                setSuggestions([])
                setShowSuggestions(false)
            } finally {
                setIsLoading(false)
            }
        }, 300) // 300ms debounce

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [inputValue, apiEndpoint])

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        setSelectedIndex(-1)
    }

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.description)
        setShowSuggestions(false)
        setSelectedIndex(-1)
        if (onAddressSelect) {
            onAddressSelect(suggestion)
        }
    }

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[selectedIndex])
                }
                break
            case 'Escape':
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
            default:
                break
        }
    }

    return (
        <Box ref={containerRef} position="relative" width="100%">
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setShowSuggestions(true)
                    }
                }}
                placeholder={placeholder}
                aria-label="Address search input"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="address-suggestions"
                isLoading={isLoading}
            />

            {showSuggestions && suggestions.length > 0 && (
                <Box
                    id="address-suggestions"
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    zIndex={1000}
                    mt={1}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="lg"
                    maxHeight="300px"
                    overflowY="auto"
                >
                    <List spacing={0}>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={suggestion.placeId}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                bg={selectedIndex === index ? 'gray.100' : 'white'}
                                px={4}
                                py={3}
                                cursor="pointer"
                                _hover={{bg: 'gray.100'}}
                                borderBottom={
                                    index < suggestions.length - 1 ? '1px solid' : 'none'
                                }
                                borderColor="gray.100"
                            >
                                <VStack align="stretch" spacing={0}>
                                    <Text fontWeight="medium" fontSize="sm">
                                        {suggestion.mainText}
                                    </Text>
                                    {suggestion.secondaryText && (
                                        <Text fontSize="xs" color="gray.600">
                                            {suggestion.secondaryText}
                                        </Text>
                                    )}
                                </VStack>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {showSuggestions && suggestions.length === 0 && inputValue.trim().length >= 3 && !isLoading && (
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    zIndex={1000}
                    mt={1}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="lg"
                    px={4}
                    py={3}
                >
                    <Text fontSize="sm" color="gray.600">
                        No suggestions found
                    </Text>
                </Box>
            )}
        </Box>
    )
}

AddressSearch.propTypes = {
    onAddressSelect: PropTypes.func,
    placeholder: PropTypes.string,
    apiEndpoint: PropTypes.string
}

export default AddressSearch


