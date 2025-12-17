/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useState} from 'react'
import {Box, Container, Heading, Text, VStack, Code} from '@chakra-ui/react'
import AddressSearch from '../../components/address-search'

const GoogleAddressSearch = () => {
    const [selectedAddress, setSelectedAddress] = useState(null)

    const handleAddressSelect = (address) => {
        setSelectedAddress(address)
        console.log('Selected address:', address)
    }

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl" textAlign="center">
                    Google Address Search
                </Heading>

                <Box>
                    <Text mb={2} fontWeight="medium">
                        Search for an address:
                    </Text>
                    <AddressSearch
                        onAddressSelect={handleAddressSelect}
                        placeholder="Start typing an address..."
                    />
                </Box>

                {selectedAddress && (
                    <Box p={4} bg="gray.50" borderRadius="md">
                        <Text fontWeight="bold" mb={2}>
                            Selected Address:
                        </Text>
                        <VStack align="stretch" spacing={2}>
                            <Text>
                                <strong>Description:</strong> {selectedAddress.description}
                            </Text>
                            <Text>
                                <strong>Main Text:</strong> {selectedAddress.mainText}
                            </Text>
                            {selectedAddress.secondaryText && (
                                <Text>
                                    <strong>Secondary Text:</strong> {selectedAddress.secondaryText}
                                </Text>
                            )}
                            <Text>
                                <strong>Place ID:</strong>{' '}
                                <Code fontSize="xs">{selectedAddress.placeId}</Code>
                            </Text>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    )
}

export default GoogleAddressSearch

