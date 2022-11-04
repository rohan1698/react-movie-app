import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import { createTheme, Paper } from '@mui/material';

import WhatshotIcon from '@mui/icons-material/Whatshot';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';

import { useNavigate } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react';

export default function MainNav() {

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

    const [value, setValue] = React.useState(0);
    const history = useNavigate()

    useEffect(() => {
        if (value === 0) {
            history('/')
        } else if (value === 1) {
            history('/movies')
        } else if (value === 2) {
            history('/series')
        } else {
            history('/search')
        }
    }, [value, history])

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, }}>
                <ThemeProvider theme={theme}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        style={{
                            background: "#39445a",
                            color: "#fff",
                            overflow: 'hidden'
                        }}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}

                    >
                        <BottomNavigationAction
                            // style={{color: ''}}
                            label="Trending"
                            icon={<WhatshotIcon />}

                        />
                        <BottomNavigationAction
                            label="Movies"
                            icon={<MovieIcon />}

                        />
                        <BottomNavigationAction
                            label="TV Series"
                            icon={<TvIcon />}

                        />
                        <BottomNavigationAction
                            label="Search"
                            icon={<SearchIcon />}

                        />
                    </BottomNavigation>
                </ThemeProvider>
            </Paper>
        </Box>
    );
}
