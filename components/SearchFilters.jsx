import { useEffect, useState } from 'react';
import { Flex, Select, Box, Text, Input, Spinner, Icon, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg';
import { filterData, getFilterValues } from '../utils/filterData';

const SearchFilters = () => {

    const [filters, setFilters] = useState(filterData); // El estado inicial de los filtros será el total de filtros posibles 
    const [searchTerm, setSearchTerm] = useState('');
    const [locationData, setLocationData] = useState();
    const [showLocations, setShowLocations] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchProperties = ( filterValues ) => { // Esta función recibe los filtros seleccionados
                                                   // y actualiza la ruta con los esos filtros

        const path = router.pathname;   // Ontenemos el pathname actual
        const { query } = router;       // Definimos los query actuales

        const values = getFilterValues(filterValues)    // Definimos el valor de los filtros elegidos en el select como un {clave:valor}

        values.forEach((item) => {                          // Recorremos esos valores de los filtros y generamos un item
            if(item.value && filterValues?.[item.name]) {   // Si ese item tiene un valor asociado y en el filterValues tiene un nombre
                query[item.name] = item.value               // lo introducimos en el query
            }
        })

        router.push({ pathname: path, query: query });      // Redirección al search con todos los query actualizados
    }

    {/* Filters contiene [{filter}] que a su vez tiene distintas opciones {items[], queryName, placeholder}  */}
    {/* e recoge el valor del filtro seleccionado de filter, en concreto el valor del item seleccionado */}
    {/* Escogido el filtro se mapeam los items y se muestran en las options */}

    useEffect(() => {

    if (searchTerm !== '') {                                                          // Si el término de busqueda no esta vacio
      const fetchData = async () => {
        setLoading(true);                                                             // Establecemos loading en true para que salga el spiner  
        const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);  // Petición al api para buscar según el término  
        setLoading(false);                                                            // Loading ahora en false
        setLocationData(data?.hits);                                                  // Establecemos LocationData con los rdos de la petición  
      };

      fetchData();
    }
  }, [searchTerm]);

    return (
        <Flex bg='gray.100' p='4' justifyContent='center' flexWrap='wrap'>
           {filters?.map((filter) => (                                                            
               <Box key={filter.queryName}>
                   <Select 
                        onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })} 
                        placeholder={filter.placeholder} 
                        w='fit-content' 
                        p='2' 
                    >
                    {filter?.items?.map((item) => (
                        <option value={item.value} key={item.value}>
                            {item.name}
                        </option>
                     ))}
                   </Select>
               </Box>
           ))}
           <Flex flexDir='column'>
                <Button onClick={() => setShowLocations(!showLocations)} border='1px' borderColor='gray.200' marginTop='2' >
                    Search Location
                </Button>
                    {showLocations && (
                        <Flex flexDir='column' pos='relative' paddingTop='2'>
                            <Input
                                placeholder='Type Here'
                                value={searchTerm}
                                w='300px'
                                focusBorderColor='gray.300'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm !== '' && (
                                <Icon
                                    as={MdCancel}
                                    pos='absolute'
                                    cursor='pointer'
                                    right='5'
                                    top='5'
                                    zIndex='100'
                                    onClick={() => setSearchTerm('')}
                                />
                            )}
                            {loading && <Spinner margin='auto' marginTop='3' />}
                            {showLocations && (
                                <Box height='300px' overflow='auto'>
                                    {locationData?.map((location) => (
                                        <Box
                                            key={location.id}
                                            onClick={() => {
                                                searchProperties({ locationExternalIDs: location.externalID });
                                                setShowLocations(false);
                                                setSearchTerm(location.name);
                                            }}
                                        >
                                            <Text cursor='pointer' bg='gray.200' p='2' borderBottom='1px' borderColor='gray.100' >
                                                {location.name}
                                            </Text>
                                        </Box>
                                    ))}
                                    {!loading && !locationData?.length && (
                                        <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5' >
                                            <Image src={noresult} />
                                            <Text fontSize='xl' marginTop='3'>
                                            Waiting to search!
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>
                            )}
                        </Flex>
                    )}
            </Flex>
        </Flex>
    );
}

export default SearchFilters
