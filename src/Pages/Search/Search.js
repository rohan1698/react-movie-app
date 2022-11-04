import { Button, createTheme, Tab, Tabs, TextField, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import MovieCard from '../../components/MovieCard/MovieCard'
import CustomPagination from '../../components/Pagination/CustomPagination'


const Search = () => {

    const [type, setType] = useState()
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [content, setContent] = useState()
    const [numOfPages, setNumOfPages] = useState()

    const theme = createTheme({
        palette: {
            type: 'dark',
            primary: {
                main: '#fff'
            },
            label: {
                primary: '#fff'
            }

        },

    })

    const fetchSearch = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${searchText}&page=${page}&include_adult=false`)

        setContent(data.results)
        setNumOfPages(data.total_pages)
    }

    useEffect(() => {
        window.scroll(0, 0)
        fetchSearch()
        // eslint-disable-next-line
    }, [type, page])

    return (
        <>
            <ThemeProvider theme={theme}>
                <div style={{ display: 'flex', margin: '20px 0' }}>
                    <TextField
                        style={{ flex: 1 }}
                        className='searchBox'
                        label='Search'
                        variant='filled'
                        color='primary'
                        InputProps={{
                            style: {
                                color: 'white',
                            }
                        }}
                        InputLabelProps={{
                            style: {
                                color: 'white',
                            }
                        }}

                        onChange={(e) => setSearchText(e.target.value)}

                    />

                    <Button
                        variant='filled'
                        style={{ marginLeft: 10, marginTop: 10 }}
                        onClick={fetchSearch}
                    >
                        <SearchIcon />
                    </Button>
                </div>

                <Tabs
                    value={type}
                    indicatorColor='primary'
                    textColor='standard'
                    onChange={(event, newValue) => {
                        setType(newValue)
                        setPage(1)
                    }}
                >
                    <Tab style={{ width: '50%' }} label='Search Movies' />
                    <Tab style={{ width: '50%' }} label='Search TV Series' />

                </Tabs>

            </ThemeProvider>
            <div className='trending'>
                {
                    content && content.map((c) => (
                        <MovieCard
                            key={c.id}
                            id={c.id}
                            poster={c.poster_path}
                            title={c.title || c.name}
                            date={c.release_date || c.first_air_date}
                            media_type={type ? 'tv' : 'movie'}
                            vote_average={c.vote_average}

                        />
                    ))
                }
                {
                    searchText &&
                    !content &&
                    (type ?
                        <h2>No series Found</h2> : <h2>No movies Found</h2>)
                }
            </div>
            {
                numOfPages > 1 && (
                    <CustomPagination setPage={setPage} numOfPages={numOfPages} />
                )
            }
        </>
    )
}

export default Search