import { renderToString } from 'react-dom/server';
import App from './App';
export function render(route: 'story' | 'farming' | 'living' | 'gallery' | null) {
  return renderToString(<App initialRoute={route} />);
}

export { pageMetadata } from './data/routes';
