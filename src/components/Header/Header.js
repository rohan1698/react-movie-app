import './Header.css'

const Header = () => {
    return (
        <>
            <span className='header' onClick={() => window.scroll(0, 0)}>
                Movie App
            </span>
        </>
    )
}

export default Header