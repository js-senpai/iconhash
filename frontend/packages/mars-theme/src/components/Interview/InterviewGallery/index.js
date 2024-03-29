import React, { useMemo,useState,useEffect } from "react";
import {styled} from "frontity";
import {LazyLoadImage, trackWindowScroll} from "react-lazy-load-image-component";
import PropTypes from "prop-types";
import {theme} from "../../../constants/theme";
import Fancybox from "../../Fancybox/Fancybox";
const Container = styled('div')({
    padding: '30px 0'
});

const FlexContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px'
});

const Title = styled('h2')({
    color: theme.colors.black,
    fontWeight: 700,
    fontSize: '22px',
    marginRight: '15px',
    [`@media (min-width: ${theme.screens.lg})`]: {
        fontSize: '32px'
    }
});

const CountImages = styled('span')({
    padding: '4px 12px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 700,
    background: 'rgba(41, 59, 220, 0.06)',
    borderRadius: '8px',
    color: theme.colors.blue
});

const GalleryContainer = styled('div')({
    '& .galleryList': {
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: '100%',
        marginBottom: '25px',
        '& span': {
            width: '100% !important'
        },
        [`@media (min-width: ${theme.screens.lg})`]: {
            gridGap: '34px',
            gridTemplateColumns: 'repeat(3,1fr)'
        }
    }

});

const Image = styled(LazyLoadImage)({
    display: 'block',
    width: '100% !important',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '12px'
});

const LoadMoreButton = styled('button')({
    backgroundColor: '#fff',
    border: '1px solid #E6EAEE',
    borderRadius: '76px',
    padding: '11px',
    textAlign: 'center',
    width: '100%',
    display: 'block',
    cursor: 'pointer',
    [`@media (min-width: ${theme.screens.lg})`]: {
        width: '196px'
    }
});

const InterviewGallery = ({scrollPosition,gallery: { list = [],title }}) => {
    const [perPage, setPerPage] = useState(6);
    const [galleryImages,setGalleryImages] = useState([]);
    useEffect(() => {
        setGalleryImages(list.map(({img}) => img).slice(0,perPage));
        return () => {
            setGalleryImages([]);
            setPerPage(6);
        }
    },[list]);
    const totalImages = useMemo(() => galleryImages.length,[galleryImages]);
    const loadMoreHandler = () => {
       const calcPerPage = perPage + 6;
       setPerPage(calcPerPage);
       setGalleryImages(prev =>[
           ...prev,
           ...list.map(({img}) => img).slice(galleryImages.length,calcPerPage)
       ]);
    };
    const showButton = useMemo(() => perPage < list.length,[perPage]);
    return (
         <Container>
             <FlexContainer>
                 <Title>{title}</Title>
                 <CountImages>{totalImages}</CountImages>
             </FlexContainer>
             <GalleryContainer>
                 <Fancybox
                     options={{
                         Carousel: {
                             infinite: false,
                         },
                     }}
                     className="galleryList"
                 >
                     {
                         galleryImages.map(({ url,title = 'image',width = 100 },index) => (
                             <a data-fancybox="gallery" key={index} href={url}>
                                 <Image scrollPosition={scrollPosition}  effect="blur"  src={url} alt={title} width={width}  />
                             </a>
                         ))
                     }
                 </Fancybox>
             </GalleryContainer>

             {showButton ? <LoadMoreButton type="button" onClick={() => loadMoreHandler()}>Show more</LoadMoreButton>: null}
         </Container>
    )
};

InterviewGallery.propTypes = {
    gallery: PropTypes.shape({
        title: PropTypes.string.isRequired,
        list: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            url: PropTypes.string,
            width: PropTypes.number,
            height: PropTypes.number,
        }).isRequired).isRequired
    }).isRequired
};

export default trackWindowScroll(InterviewGallery);