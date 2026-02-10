import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './PasswordInput';

describe('PasswordInput Component', () => {
    it('should render with placeholder', () => {
        render(<PasswordInput value="" onChange={() => {}} placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should call onChange when typing', () => {
        const handleChange = vi.fn();
        render(<PasswordInput value="" onChange={handleChange} />);
        
        const input = screen.getByLabelText('Password input');
        fireEvent.change(input, { target: { value: 'a' } });
        
        expect(handleChange).toHaveBeenCalledWith('a');
    });

    it('should toggle password visibility', () => {
        render(<PasswordInput value="secret" onChange={() => {}} />);
        
        const input = screen.getByLabelText('Password input') as HTMLInputElement;
        expect(input.type).toBe('password');
        
        const toggleButton = screen.getByRole('button', { name: /Show password/i });
        fireEvent.click(toggleButton);
        
        expect(input.type).toBe('text');
        
        fireEvent.click(toggleButton);
        expect(input.type).toBe('password');
    });
});
