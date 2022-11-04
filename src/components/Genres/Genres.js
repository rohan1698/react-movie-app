import { Chip } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'

const Genres = ({
    type,
    selectedGenres,
    setSelectedGenres,
    genres,
    setGenres,
    setPage,
}) => {

    const handleAddGenre = (genre) => {
        setSelectedGenres([...selectedGenres, genre])
        setGenres(genres.filter((g) => g.id !== genre.id))
        setPage(1)
    }

    const handleRemoveGenre = (genre) => {
        setSelectedGenres((selectedGenres.filter((selected) => selected.id !== genre.id)))
        setGenres([...genres, genre])
        setPage(1)
    }

    const fetchGenres = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)

        setGenres(data.genres)
    }

    useEffect(() => {
        fetchGenres()
        // return () => {
        //     setGenres({})
        // }

        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div style={{ padding: '6px 0' }}>

                {
                    selectedGenres && selectedGenres.map((genre) => (
                        <Chip
                            variant='filled'
                            label={genre.name}
                            style={{ margin: 2, }}
                            // size='small'
                            key={genre.id}
                            clickable
                            color='primary'
                            onDelete={() => handleRemoveGenre(genre)}
                        />
                    ))
                }

                {
                    genres && genres.map((genre) => (
                        <Chip
                            variant='outlined'
                            label={genre.name}
                            style={{ margin: 2, backgroundColor: "#fff" }}
                            // size='small'
                            key={genre.id}
                            clickable
                            onClick={() => handleAddGenre(genre)}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default Genres