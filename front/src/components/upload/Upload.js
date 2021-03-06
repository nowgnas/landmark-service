import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as API from '../../api';
import Swal from 'sweetalert2';

import './Upload.css';

// import recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfoState, landmarkPicState } from '../../atom';

import {
    UploadWrapper,
    UploadContainer,
    UploadPlaceholder,
    UploadContent,
    UploadButtonContainer,
    UploadButton,
    UploadCancelButton,
} from './UploadStyle';

const Upload = () => {
    const user = useRecoilValue(userInfoState);
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const filepickerRef = useRef();

    const [landmarkPic, setLandmarkPic] = useRecoilState(landmarkPicState);
    const [landmarkInfo, setLandmarkInfo] = useState('');

    const uploadAvatar = async (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setAvatar(readerEvent.target.result);
        };

        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        API.sendImage('ai/images', formData)
            .then((response) => {
                // console.log(response.data);
                return response.data.gcs_url;
            })
            .then((landmarkURL) => {
                setTimeout(() => {
                    API.post('ai', { url: landmarkURL })
                        .then((response) => {
                            // console.log('response.data', response.data);
                            formData.append('user_id', user.user_id);
                            formData.append('landmark_id', response.data.landmark_id);
                            setLandmarkInfo(() => {
                                return response.data;
                            });
                        })
                        .catch((err) => {
                            console.error(err.response);
                        })
                        .then((responseData) => {
                            // formData.append('user_id', user.user_id);
                            // formData.append('landmark_id', responseData);
                            API.sendImage('visited/images', formData)
                                .then((responseData) => {
                                    setLandmarkPic(responseData.data);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Swal.fire({
                                        title: 'AI??? ????????? ??? ?????? ???????????????. ?????? ????????? ????????? ????????????.',
                                        icon: 'warning',
                                        confirmButtonColor: '#3085d6', // confrim ?????? ?????? ??????
                                        confirmButtonText: '??????', // confirm ?????? ????????? ??????
                                    });
                                });
                        });
                }, 3000).catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.log('error', error);
            });
        setTimeout(() => {}, 500);
        setTimeout(() => {}, 1000);
    };

    // useEffect(() => {
    //     console.log('info', landmarkInfo);
    //     console.log('pic', landmarkPic);
    // }, [landmarkInfo, landmarkPic]);

    const uploadHandler = () => {
        // ????????? ????????? ?????????????????? ????????????...?????? ??? ???????????? ??????
        avatar && landmarkPic && landmarkInfo
            ? setTimeout(() => {
                  navigate('/uploadResult', {
                      state: { landmarkInfo: landmarkInfo, landmarkPic: landmarkPic },
                  });
              }, 500)
            : Swal.fire({
                  title: '?????? ????????? ????????? ??????, AI??? ?????? ????????? ??????????????????.',
                  icon: 'warning',
                  confirmButtonColor: '#3085d6', // confrim ?????? ?????? ??????
                  cancelButtonColor: '#d33', // cancel ?????? ?????? ??????
                  confirmButtonText: '??????', // confirm ?????? ????????? ??????
              });
    };

    // ????????? ?????????????????? ????????? ???????????? , ????????? ??? ????????????
    const uploadCancelButtonHandler = async () => {
        if (avatar) {
            await API.delData(`visited/${landmarkPic.index}`);
            navigate('/');
        } else {
            navigate('/');
        }
    };
    return (
        <UploadWrapper>
            <UploadContainer>
                {!avatar && (
                    <UploadPlaceholder onClick={() => filepickerRef.current.click()}>
                        <span style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                            <p style={{ fontSize: '3.1rem', marginBottom: '1.3rem' }}>+</p>
                            <p>????????? ???????????????, </p>
                            <p>???????????? ????????? ???????????????.</p>
                        </span>
                    </UploadPlaceholder>
                )}
                {avatar && (
                    <UploadContent
                        src={avatar}
                        alt="img"
                        onClick={() => filepickerRef.current.click()}
                    />
                )}
                <input hidden onChange={uploadAvatar} ref={filepickerRef} type="file" />
            </UploadContainer>
            <UploadButtonContainer>
                <UploadButton onClick={uploadHandler}>?????????</UploadButton>
                <UploadCancelButton onClick={uploadCancelButtonHandler}>
                    ????????????{' '}
                </UploadCancelButton>
            </UploadButtonContainer>
        </UploadWrapper>
    );
};

export default Upload;
