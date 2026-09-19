import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/popup.scss';
import Home from './App';
import { About } from './About';
import { getLocale, t } from '@/components/i18n';

document.documentElement.lang = getLocale();
document.title = t('popupTitle');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

function App() {
    const [pageToShow, setPageToShow] = useState<Page>('main');

    return (
        <>
            {pageToShow === 'main' && <Home setPageToShow={setPageToShow} />}
            {pageToShow === 'about' && <About setPageToShow={setPageToShow} />}
        </>
    );
}

export type Page = 'main' | 'about';
