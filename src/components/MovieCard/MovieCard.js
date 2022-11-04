import { Badge } from '@mui/material'
import React from 'react'
import { img_300, unavailable } from '../../config/config'
import ContentModal from '../ContentModal/ContentModal'
import './MovieCard.css'

const MovieCard = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
}) => {
  return (
    <>
      <ContentModal media_type={media_type} id={id}>

        <Badge
          badgeContent={vote_average.toFixed(1)}
          color={vote_average > 6 ? 'primary' : 'secondary'}

        />
        <img
          src={poster ? `${img_300}/${poster}` : unavailable}
          alt={title}

        />
        <b className='title'>
          {title}
        </b>
        <span className='sub-title'>
          {media_type === 'tv' ? 'TV Series' : 'Movie'}
          <span className='sub-title'>
            {date}
          </span>
        </span>
      </ContentModal>
    </>
  )
}

export default MovieCard