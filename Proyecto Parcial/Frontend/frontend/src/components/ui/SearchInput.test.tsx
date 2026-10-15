import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
    it('avisa cada cambio de texto mediante onChange', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<SearchInput value="" onChange={onChange} />);

        await user.type(screen.getByRole('searchbox'), 'ana');

        expect(onChange).toHaveBeenCalled();
    });
});