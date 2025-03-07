import { createGlobalStyle } from 'styled-components';
import themeVars from 'styles/themeVars'

const GlobalStyle = createGlobalStyle`
    
    .notation {
        font-family: 'Noto Music', sans-serif;
        display: inline-block;
        margin: 0 8px;

        &.large {
            font-size: 1.5em;
            line-height: 1.5em;
        }
    }
`;

export default GlobalStyle;
