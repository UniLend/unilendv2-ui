import { it } from 'vitest';
import AppWrapper from './appWrapper';
import { render } from './test/wraper';

it('App Render Correctly', () => {
    render(<AppWrapper/>)
})