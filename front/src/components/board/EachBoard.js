import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../atom';
import { useNavigate, useLocation } from 'react-router-dom';
import Flippy, { FrontSide, BackSide } from 'react-flippy';

import * as API from '../../api';
import { ValidationTextField } from '../upload/MuiCustom';
import BoardComment from './BoardComment';
import Swal from 'sweetalert2';

import {
    UploadResultWrapper,
    UploadResultLeft,
    ImgContainer,
    UploadResultContentContainer,
    UploadResultContentPeopleContainer,
    UploadResultPeopleImg,
    UploadResultBtnContainer,
    UploadResultBtn,
    UploadResultRight,
    UploadResultNameContainer,
    UploadResultNameImg,
    UploadResultLocationContainer,
    UploadResultLocationImg,
    UploadResultDescriptionContainer,
    UploadResultDescriptionImg,
} from '../upload/UploadResultStyle';

import {
    BoardWrapper,
    BoardTitleWrapper,
    BoardTitle,
    BoardTitleContainer,
    BoardContentWrapper,
    BoardContent,
    BoardContentContainer,
    BoardInfoWrapper,
    BoardUserImg,
    BoardUserName,
    BoardDate,
    BoardCommentWrapper,
} from './EachBoardStyle';

import description from '../../img/description.png';
import name from '../../img/name.png';
import location from '../../img/location.png';
import Luggage from '../../img/Luggage.png';

const EachBoard = () => {
    const user = useRecoilValue(userInfoState);
    // console.log('user:', user);
    const [eachBoardInfo, setEachBoardInfo] = useState('');

    const ref = useRef();
    const navigate = useNavigate();
    const allBoardContent = useLocation();
    const getBoardId = allBoardContent.pathname.substring(7);

    const [title, setTitle] = useState(eachBoardInfo.title);
    const [content, setContent] = useState(eachBoardInfo.content);

    useEffect(() => {
        const getEachBoard = async () => {
            const res = await API.get(`board/${getBoardId}`);
            setEachBoardInfo(res.data);
            setTitle(res.data.title);
            setContent(res.data.content);
        };
        getEachBoard();
    }, [getBoardId]);

    // console.log('???????????????', allBoardContent);
    // console.log('????????? ????????????', eachBoardInfo);
    // console.log('????????? ??????', title);
    // console.log('????????? ??????', content);
    // console.log('userEmail', userEmail);

    const boardDelHandler = async () => {
        Swal.fire({
            title: '????????? ??????',
            text: '???????????? ?????????????????????????',
            icon: 'warning',
            showCancelButton: true, // cancel?????? ?????????. ????????? ?????? ??????
            confirmButtonColor: '#3085d6', // confrim ?????? ?????? ??????
            cancelButtonColor: '#d33', // cancel ?????? ?????? ??????
            confirmButtonText: '??????', // confirm ?????? ????????? ??????
            cancelButtonText: '??????', // cancel ?????? ????????? ??????
        }).then((result) => {
            if (result.isConfirmed) {
                // ?????? ??????????????? confirm ????????? ????????????
                API.delData(`board/delete?boardId=${getBoardId}`);
                navigate('/board');
            }
        });
    };

    const updateHandleSubmit = async (e) => {
        try {
            await API.putQuery(
                `board/update?board_id=${eachBoardInfo.board_id}&title=${title}&content=${content}`,
            );
            navigate('/Board');
        } catch (err) {
            console.log('err');
        }
    };

    return user.user_id && user.user_id === eachBoardInfo.userId ? (
        <UploadResultWrapper>
            <Flippy ref={ref} flipOnClick={false} flipDirection="horizontal">
                <FrontSide style={{ padding: '0', boxShadow: 'none' }}>
                    <UploadResultLeft>
                        <ImgContainer src={eachBoardInfo.landmark_img_id} />
                        <BoardWrapper>
                            <BoardInfoWrapper>
                                <BoardUserImg src={eachBoardInfo.profile_image} alt="" />
                                <BoardUserName>{eachBoardInfo.email}</BoardUserName>
                                <BoardDate>
                                    ????????? ?????? ??????: {eachBoardInfo?.created_at?.substring(0, 10)}
                                </BoardDate>
                            </BoardInfoWrapper>
                            <BoardTitleWrapper>
                                <BoardTitle>??????</BoardTitle>
                                <BoardTitleContainer>{eachBoardInfo.title}</BoardTitleContainer>
                            </BoardTitleWrapper>
                            <BoardContentWrapper>
                                <BoardContent>??????</BoardContent>
                                <BoardContentContainer>
                                    {eachBoardInfo.content}
                                </BoardContentContainer>
                            </BoardContentWrapper>
                        </BoardWrapper>
                        <BoardCommentWrapper>
                            <BoardComment />
                        </BoardCommentWrapper>
                        <UploadResultContentPeopleContainer>
                            <UploadResultPeopleImg src={Luggage} />
                            {eachBoardInfo.visitedCount}?????? ?????????????????? ??????????????????
                        </UploadResultContentPeopleContainer>
                        <UploadResultBtnContainer>
                            <UploadResultBtn
                                onClick={() => {
                                    ref.current.toggle();
                                }}
                            >
                                ????????????
                            </UploadResultBtn>
                            <UploadResultBtn onClick={boardDelHandler}>????????????</UploadResultBtn>
                            <UploadResultBtn onClick={() => navigate('/board')}>
                                ????????????
                            </UploadResultBtn>
                        </UploadResultBtnContainer>
                    </UploadResultLeft>
                </FrontSide>
                <BackSide style={{ padding: '0', boxShadow: 'none' }}>
                    <UploadResultLeft>
                        <ImgContainer src={eachBoardInfo.landmark_img_id} alt="" />
                        <UploadResultContentContainer>
                            <ValidationTextField
                                id="outlined-basic"
                                label="??????"
                                variant="outlined"
                                multiline
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                focused
                            />

                            <ValidationTextField
                                id="outlined-multiline-static"
                                label="??????"
                                value={content}
                                multiline
                                rows={6}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                }}
                                focused
                            />
                        </UploadResultContentContainer>
                        <UploadResultBtnContainer>
                            <UploadResultBtn onClick={updateHandleSubmit}>??????</UploadResultBtn>
                            <UploadResultBtn
                                onClick={() => {
                                    ref.current.toggle();
                                }}
                            >
                                ??????
                            </UploadResultBtn>
                        </UploadResultBtnContainer>
                    </UploadResultLeft>
                </BackSide>
            </Flippy>

            <UploadResultRight>
                <UploadResultNameContainer>
                    <UploadResultNameImg src={name} />

                    {eachBoardInfo.landmark_name}
                </UploadResultNameContainer>
                <UploadResultLocationContainer>
                    <UploadResultLocationImg src={location} />
                    {eachBoardInfo.location}
                </UploadResultLocationContainer>
                <UploadResultDescriptionContainer>
                    <UploadResultDescriptionImg src={description} />
                    {eachBoardInfo.description}
                </UploadResultDescriptionContainer>
            </UploadResultRight>
        </UploadResultWrapper>
    ) : (
        <UploadResultWrapper>
            <UploadResultLeft>
                <ImgContainer src={eachBoardInfo.landmark_img_id} alt="" />
                <BoardWrapper>
                    <BoardInfoWrapper>
                        <BoardUserImg src={eachBoardInfo.profile_image} alt="" />
                        <BoardUserName>{eachBoardInfo.email}</BoardUserName>
                        <BoardDate>
                            ????????? ?????? ??????: {eachBoardInfo?.created_at?.substring(0, 10)}
                        </BoardDate>
                    </BoardInfoWrapper>
                    <BoardTitleWrapper>
                        <BoardTitle>??????</BoardTitle>
                        <BoardTitleContainer>{eachBoardInfo.title}</BoardTitleContainer>
                    </BoardTitleWrapper>
                    <BoardContentWrapper>
                        <BoardContent>??????</BoardContent>
                        <BoardContentContainer>{eachBoardInfo.content}</BoardContentContainer>
                    </BoardContentWrapper>
                </BoardWrapper>
                <BoardCommentWrapper>
                    <BoardComment />
                </BoardCommentWrapper>
                <UploadResultContentPeopleContainer>
                    <UploadResultPeopleImg src={Luggage} />
                    {eachBoardInfo.visitedCount}?????? ?????????????????? ??????????????????
                </UploadResultContentPeopleContainer>
            </UploadResultLeft>
            <UploadResultRight>
                <UploadResultNameContainer>
                    <UploadResultNameImg src={name} />
                    {eachBoardInfo.landmark_name}
                </UploadResultNameContainer>
                <UploadResultLocationContainer>
                    <UploadResultLocationImg src={location} />
                    {eachBoardInfo.location}
                </UploadResultLocationContainer>
                <UploadResultDescriptionContainer>
                    <UploadResultDescriptionImg src={description} />
                    {eachBoardInfo.description}
                </UploadResultDescriptionContainer>
            </UploadResultRight>
        </UploadResultWrapper>
    );
};

export default EachBoard;
