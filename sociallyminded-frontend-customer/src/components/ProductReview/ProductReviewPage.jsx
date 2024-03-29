import React from 'react';
import { PageTemplate, ReviewPageTemplate } from '../common/styles';
import Header from '../common/Header/Header';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { useLocation } from 'react-router';
import useProductReviewHooks from './productReviewHooks';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllReviewsByProductIdUrl } from '../../routes/routes';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { UserAuth } from '../../context/AuthContext';
import LoggedInHeader from '../common/Header/LoggedInHeader';
import Rating from '@mui/material/Rating';
import { AiOutlineArrowUp } from 'react-icons/ai';
// import WordCloud from 'react-wordcloud';

export const ProductReviewPage = () => {

    const { state } = useLocation()
    const navigate = useNavigate()
    
    const { user } = UserAuth()
    
    const {         
        data, displayData, loading, error, generateRandomNum, enlargedImg, handleEnlarged,
        handleShrink, isEnlarged, setIsEnlarged, rating, handleFilterButtonClick, selectedRating,
        setSelectedRating, filteredRating, ratingCount, handleSortNewest, handleSortOldest, setSelectedSort,
        selectedSort,handleSort, scrollToTop, visibleGoTop, setVisibleGoTop
    } = useProductReviewHooks(state)

    return (
        <ReviewPageTemplate>
            {user == null ? <Header></Header> : <LoggedInHeader></LoggedInHeader>}
            <ReviewHeaderContainer>
                <Title>Reviews</Title>
                <ReviewImg
                    src={require('./review-bg.png')}
                    alt="Second slide"
                />
            </ReviewHeaderContainer>
            <ReviewDetailsContainer>

                {/* go back to the product list */}
                <StyledLink onClick={() => navigate(-1)}>Back</StyledLink>
                <h1>{state.d.name}</h1>
                
                {/* when there is no review */}
                {data != null && data.length == 0 && <h5>There are no reviews yet</h5>}

                {/* when there is review */}
                {data != null && data.length != 0 &&
                    <StyledReviewBody>
                        <ReviewBox>
                            <WrapperStar>
                                <div style={{textAlign: "center"}}>
                                    {/* show the average rating*/}
                                    <RatingTotal>{rating} out of 5</RatingTotal>
                                </div>
                                <br/>
                                <Rating name="read-only" precision={0.02} value={rating} readOnly />
                            </WrapperStar>
                        
                        {/* show the filter button by rating and All */}
                            <ReviewFilter>
                            
                                {[null, 1, 2, 3, 4, 5].map((rating) => (
                                    <AllFilter
                                        key={rating}
                                        onClick={() => handleFilterButtonClick(rating)}
                                        className={selectedRating === rating ? "selected" : ""}
                                    >
                                        {/* beside each rating filter button put the number of reviews allocated to it  */}
                                        {rating === null ? "All(" + ratingCount[0] + ")" : `${rating} stars(` + ratingCount[rating] + `)`}
                                        
                                    </AllFilter>
                                ))}
                            
                            </ReviewFilter>
                        </ReviewBox>
                        
                        {/* sorting by latest and oldest button*/}
                        <SortingBox>
                            <span style={{marginRight: "10px"}}>Sort By</span> 
                            <Sorting  onClick={handleSortNewest}  className={selectedSort === "newest" ? "selected" : ""}>
                                Newest
                            </Sorting>
                            <Sorting onClick={handleSortOldest}  className={selectedSort === "oldest" ? "selected" : ""}>
                                Oldest
                            </Sorting>
                        </SortingBox>

                        {/* when there is no review allocated to that rating */}
                        {filteredRating != null && filteredRating.length == 0 && <h5>There are no reviews to this rating yet.</h5>}
                        
                        {/* when there is review allocated to that rating  */}
                        {filteredRating != null && filteredRating.map((d) => (
                            <ReviewContainer>

                                {/* show the user image */}
                                <AvatarImg src={require(`./avatar/${d.avatar}.png`)}></AvatarImg>
                                <ReviewDescription>

                                    {/* show the user name or anonymous*/}
                                    {d.isAnonymous == false && (
                            
                                        <UserName>{d.customer.username}</UserName>
                                    )}
                                    {d.isAnonymous == true && (
                            
                                        <UserName>Anonymous</UserName>
                                    )}

                                    {/* show the rating by star */}
                                    <Rating name="read-only" value={d.rating} readOnly />
                                    <br/>

                                    {/* show date of review */}
                                    {d.dateOfReview!= null && d.dateOfReview.split("T")[0]}
                                    <br/>

                                    {/* show the review description */}
                                    {d.reviewDescription}
                                    <br/>

                                    {/* show the review pictures */}
                                    {d.reviewImages != null &&  (
                                        <ReviewImageListContainer> 

                                            {/* enlarge image when click */}
                                            {d.reviewImages.map((base64, index) => (
                                                <ReviewImgByUser key={index} src={base64} alt={`Review Image ${index }`} onClick={() => handleEnlarged(base64)}/>
                                            ))}

                                            {/* shrink image when click again */}
                                            {enlargedImg !== -1 && (
                                                <div onClick={handleShrink}>
                                                    <img src={enlargedImg} key={enlargedImg} style={{ cursor: "zoom-out",maxWidth:"100%", maxHeight:"100%", position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto', zIndex: 100 }} alt="Enlarged" />
                                                </div>
                                            )}

                                            {/* the background of the image when it is enlarge */}
                                            {isEnlarged && (
                                                <div
                                                    style={{position: 'fixed',top: 0,left: 0,right: 0,bottom: 0, backgroundColor: 'rgba(172, 127, 172, 0.5)',zIndex: 99}}
                                                    onClick={handleShrink}>
                                                </div>
                                            )}
                                        </ReviewImageListContainer>
                                    )}
                                </ReviewDescription>
                            </ReviewContainer>

                        ))}

                        {/* button for go to top */}
                        <GoTopButton
                            className="scroll-to-top-button"
                            style={{ display: visibleGoTop ? "block" : "none" }}
                            onClick={scrollToTop}
                        >
                            <AiOutlineArrowUp/>
                        </GoTopButton>
                    </StyledReviewBody>
                }
            </ReviewDetailsContainer>  
        </ReviewPageTemplate>
    )

}

const ReviewHeaderContainer = styled.div`
    position: relative;
    margin-left:7vw;
    margin-right:7vw;
`

const Title = styled.h1`
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index:1;
    font-size:4.5em;
    font-weight:semi-bold;
`

const ReviewImg = styled.img`
    width:100%;
    height:30vh;
    border-radius:10px;
    margin-top:7vh;
    opacity:0.8;
    z-index:0;
`

const ReviewDetailsContainer = styled.div`
    position: relative;
    margin-left:7vw;
    margin-right:7vw;
    margin-top:4vh;
`


const StyledLink = styled.button`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    font-size: 1.1em;
    margin-bottom:2vh;
    &:hover {
        color:blue;
    }
`



const ReviewContainer = styled.div`
    display:flex;
    flex-direction:row;
    margin-bottom:5vh;
    align-items:center;
    justify-content:center;
`

const AvatarImg = styled.img`
    width:6vw;
    height:12vh;
    margin-right:2vw;
`

const StyledReviewBody = styled(Modal.Body)`
    margin-top:5vh;
`

const UserName = styled.p`
`

const ReviewDescription = styled.div`
    position: relative;
    background: #FBFBFB;
    border-radius: .4em;
    padding:1em;
    width:100%;
    border:1px solid #dbdbdb;

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 9px solid transparent;
        border-right-color: #dbdbdb;
        border-left: 0;
        border-bottom: 0;
        margin-top: -4.5px;
        margin-left: -9px;
    }
      
    &:hover {
        transition: all 0.2s ease-out;
        box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
        top: -4px;
    }
  
    &:before {
        content: "";
        position: absolute;
        z-index: -1;
        border-radius: 32px;
        transform: scale(2);
        transform-origin: 50% 50%;
        transition: transform 0.15s ease-out;
    }
  
    &:hover:before {
        transform: scale(2.15);
    }

`
const ReviewBox = styled.div`
    background-color: #F3EEFC;
    min-height: 5rem;
    border: 1px solid #AC73FF;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 1.875rem;
`
const SortingBox = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
`

const RatingTotal = styled.p`
    color : #AC73FF;
    font-size: 1.125rem;
`
const WrapperStar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin:auto;
`

const ReviewFilter = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-left: 1rem;
    justify-content: flex-start;
    margin-bottom: 1rem;
`
const AllFilter = styled.div`
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    height: 2rem;
    line-height: 2rem;
    min-width: 6.25rem;
    text-align: center;
    padding: 0 0.625rem;
    color: rgba(0,0,0,.8);
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.09);
    box-sizing: border-box;
    display: inline-block;
    margin-right: 0.5rem;
    text-decoration: none;
    color: rgba(0,0,0,.87);
    text-transform: capitalize;
    border-radius: 2px;
    margin-bottom: 0.3125rem;
    margin-top: 0.3125rem;
    &.selected {
        border-color: #AC73FF;
        fill: #AC73FF;
        color: #AC73FF;
      }
`
const Sorting = styled.div`
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    height: 2rem;
    line-height: 2rem;
    min-width: 6.25rem;
    text-align: center;
    padding: 0 0.625rem;
    color: rgba(0,0,0,.8);
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.09);
    box-sizing: border-box;
    display: inline-block;
    margin-right: 0.5rem;
    text-decoration: none;
    color: rgba(0,0,0,.87);
    text-transform: capitalize;
    border-radius: 2px;
    margin-bottom: 0.3125rem;
    margin-top: 0.3125rem;
    &.selected {
        border-color: #AC73FF;
        fill: #AC73FF;
        color: #AC73FF;
      }
`


const ReviewImageListContainer = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
`
const ReviewImgByUser = styled.img`
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 0.625rem 0.625rem;
    margin-right: 6px;
    cursor: zoom-in;
    position: relative;
`
const GoTopButton = styled.button`
position: fixed;
display: flex;
width: 50px;
height: 50px;
bottom: 20px;
right: 20px;
font-size: 25px;
cursor: pointer;
justify-content: center;
align-items: center;
border-radius: 50%;
background-color:  #AC73FF;
color: #fff;
z-index: 9999;
transition: opacity 0.2s ease-in-out;
`