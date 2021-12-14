import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';
import noresult from '../assets/images/noresult.svg'

import React from 'react'
import SearchFilters from '../components/SearchFilters';
import Property from '../components/Property';
import { baseUrl, fetchApi } from '../utils/fetchApi';




const Search = ({ properties }) => {

    const [searchFilters, setSearchFilters] = useState(false);  // Bandera para mostrar o no los filtros
    const router = useRouter();                                 // Permite acceder al router objeto dentro de cualquier componente.

    return (
        <Box>
            <Flex
                onClick={() => setSearchFilters(!searchFilters)}
                cursor='pointer'
                bg='gray.100'
                borderBottom='1px'
                borderColor='gray.200'
                p='2'
                fontWeight='black'
                fontSize='lg'
                justifyContent='center'
                alignItems='center'
            >
                <Text>Search Property By Filters</Text>
                <Icon paddingLeft='2' w='7' as={BsFilter} />
            </Flex>
                {searchFilters && <SearchFilters />}
            <Text fontSize='2xl' p='4' fontWeight='bold'> {/*Buscamos los parámetros (query) de la peticion ?purpose="for-sale"*/}
                Properties {router.query.purpose}
            </Text>
            <Flex flexWrap='wrap'>
                {properties.map((property) => <Property property={property} key={property.id} />)}
            </Flex>
             {properties.length === 0 && (
                <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
                    <Image src={noresult} />
                    <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
                </Flex>
             )}
        </Box>
    )
}

export default Search

// getServerSideProps recibe el context que se compone de params, query, req, res, etc y permite renderizar 
// este componente en cada solicitud de carga

export async function getServerSideProps({ query } ){ // Peticiones a la api de bayut en base a los query params del componente

  const purpose = query.purpose || 'for-rent';                  // Parámetros en los query params 
  const rentFrequency = query.rentFrequency || 'yearly';
  const minPrice = query.minPrice || '0';
  const maxPrice = query.maxPrice || '1000000';
  const roomsMin = query.roomsMin || '0';
  const bathsMin = query.bathsMin || '0';
  const sort = query.sort || 'price-desc';
  const areaMax = query.areaMax || '35000';
  const locationExternalIDs = query.locationExternalIDs || '5002';
  const categoryExternalID = query.categoryExternalID || '4';
  
  const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);  

  return { 
    // Los resultados de las peticiones se pasan al componente como props = properties que serán mapeadas para ser mostradas
    props: {
      properties: data?.hits,
    
    }
  }
}
