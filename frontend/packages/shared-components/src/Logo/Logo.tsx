import styled, { css } from "styled-components";
import LogoPng from '../../assets/logo.png';


const StyledImage = styled.img`
height: 100px;
width:  100px;
`

export function Logo() {
  return(
    <StyledImage src={LogoPng}/>
  )
}