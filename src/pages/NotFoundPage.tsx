import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '../constants/constants';

function NotFound() {
	const navigate = useNavigate();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		navigate(`${ROUTES.MAIN}`);
	};

	return (
		<Container>
			<StatusContainer>
				<StatusDisplay>404</StatusDisplay>
				<StatusDisplay>404</StatusDisplay>
			</StatusContainer>
			<ContentContainer>
				<ContentTitle>현재 찾을 수 없는 페이지를 요청 하셨습니다.</ContentTitle>
				<ContentButton onClick={handleClick}>메인으로</ContentButton>
			</ContentContainer>
		</Container>
	);
}

export default NotFound;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(100vh - 30vh);
`;

const StatusContainer = styled.div`
	position: relative;
`;

const StatusDisplay = styled.p`
	position: absolute;
	transform: translate(-50%, -50%);
	margin-top: 14rem;
	font-size: 100px;
	font-weight: 800;

	&:nth-child(1) {
		color: transparent;
		-webkit-text-stroke: 2px #c3f3de;
	}

	&:nth-child(2) {
		color: #c3f3de;
		animation: animate 4s ease-in-out infinite;
	}
`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20rem;
`;

const ContentTitle = styled.p`
	padding: 2rem;
	font-size: 24px;
	line-height: 1.4rem;
	font-weight: 800;
	color: #c3f3de;
	text-align: center;
	word-break: keep-all;
`;

const ContentButton = styled.button`
	margin-top: 3rem;
	font-weight: 500;
	font-size: 24px;
	border: none;
	border-radius: 20px;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
	color: white;
	background-color: #c3f3de;
	padding: 1rem 3rem;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		color: #c3f3de;
		background-color: white;
	}
`;
