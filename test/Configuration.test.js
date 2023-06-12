'use babel-jest';

import React from 'react';
import { render, screen } from '@testing-library/react';
import Configuration from '../src/components/Configuration';

// Mock the apiFetch function
jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: jest.fn(),
}));

describe('Configuration', () => {
	test('renders the component', () => {
		render(<Configuration onConfigurationSubmit={() => {}} />);
		expect(
			screen.getByLabelText('Insert your OpenAI API key:')
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('sk-XXXXXXXXXXXXXXX')
		).toBeInTheDocument();
		expect(screen.getByText('Verify Key')).toBeInTheDocument();
	});

	test('updates the apiKey state when input value changes', () => {
		render(<Configuration onConfigurationSubmit={() => {}} />);
		const apiKeyInput = screen.getByPlaceholderText('sk-XXXXXXXXXXXXXXX');
		fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
		expect(apiKeyInput.value).toBe('test-api-key');
	});

	test('calls onConfigurationSubmit callback with apiKey value when form is submitted', async () => {
		const mockOnConfigurationSubmit = jest.fn();
		render(
			<Configuration onConfigurationSubmit={mockOnConfigurationSubmit} />
		);
		const apiKeyInput = screen.getByPlaceholderText('sk-XXXXXXXXXXXXXXX');
		fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
		fireEvent.submit(screen.getByTestId('configuration-form'));
		expect(mockOnConfigurationSubmit).toHaveBeenCalledWith('test-api-key');
	});

	test('displays loading state while verifying key', () => {
		render(<Configuration onConfigurationSubmit={() => {}} />);
		fireEvent.submit(screen.getByTestId('configuration-form'));
		expect(screen.getByText('Verifying...')).toBeInTheDocument();
		expect(screen.getByText('Verify Key')).toBeDisabled();
	});

	test('displays error message when API call fails', async () => {
		// Mock the fetch function to return an error response
		jest.spyOn(window, 'fetch').mockImplementation(() =>
			Promise.resolve({
				ok: false,
				json: () =>
					Promise.resolve({ message: 'API key verification failed' }),
			})
		);
		render(<Configuration onConfigurationSubmit={() => {}} />);
		const apiKeyInput = screen.getByPlaceholderText('sk-XXXXXXXXXXXXXXX');
		fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
		fireEvent.submit(screen.getByTestId('configuration-form'));
		// Wait for the error message to appear
		await screen.findByText('Error: API key verification failed');
		expect(
			screen.getByText('Error: API key verification failed')
		).toBeInTheDocument();
		expect(screen.getByText('Verify Key')).not.toBeDisabled();
	});
});
