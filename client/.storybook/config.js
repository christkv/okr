import { configure } from '@kadira/storybook';
import 'bootstrap/dist/css/bootstrap.css';
import '../src/app.css';

function loadStories() {
  require('../src/components/stories/');
}

configure(loadStories, module);
