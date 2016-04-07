import { configure } from '@kadira/storybook';
import 'bootstrap/dist/css/bootstrap.css';

function loadStories() {
  require('../src/components/stories/');
}

configure(loadStories, module);
