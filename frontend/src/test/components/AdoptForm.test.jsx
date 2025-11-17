// src/components/AdoptForm.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdoptForm from '../../components/AdoptForm';
import { createPet } from '../../api';

// Mock the API module so we control createPet()
jest.mock('../../api', () => ({
  createPet: jest.fn(),
}));

describe('AdoptForm', () => {
  const petTypes = ['Cat', 'Dog', 'Dragon'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pet name and type fields with options', () => {
    render(<AdoptForm userId={123} onAdopt={jest.fn()} petTypes={petTypes} />);

    // Inputs
    expect(screen.getByLabelText(/pet name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pet type/i)).toBeInTheDocument();

    // Options
    petTypes.forEach((type) => {
      expect(screen.getByRole('option', { name: type })).toBeInTheDocument();
    });
  });

  it('shows an error when name is missing and does not call API', async () => {
    render(<AdoptForm userId={123} onAdopt={jest.fn()} petTypes={petTypes} />);

    const adoptButton = screen.getByRole('button', { name: /adopt/i });

    await userEvent.click(adoptButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/please enter a pet name/i);

    expect(createPet).not.toHaveBeenCalled();
  });

  it('shows an error when type is missing and does not call API', async () => {
    render(<AdoptForm userId={123} onAdopt={jest.fn()} petTypes={petTypes} />);

    const nameInput = screen.getByLabelText(/pet name/i);
    const adoptButton = screen.getByRole('button', { name: /adopt/i });

    await userEvent.type(nameInput, 'Mochi');
    await userEvent.click(adoptButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/please select a pet type/i);

    expect(createPet).not.toHaveBeenCalled();
  });

  it('submits valid data, calls createPet and onAdopt, then clears fields', async () => {
    const onAdopt = jest.fn();

    createPet.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Mochi',
        type: 'Cat',
        fullness: 80,
        happiness: 80,
        energy: 80,
      },
    });

    render(<AdoptForm userId={123} onAdopt={onAdopt} petTypes={petTypes} />);

    const nameInput = screen.getByLabelText(/pet name/i);
    const typeSelect = screen.getByLabelText(/pet type/i);
    const adoptButton = screen.getByRole('button', { name: /adopt/i });

    await userEvent.type(nameInput, 'Mochi');
    await userEvent.selectOptions(typeSelect, 'Cat');
    await userEvent.click(adoptButton);

    // API payload
    expect(createPet).toHaveBeenCalledWith({
      name: 'Mochi',
      type: 'Cat',
      userId: 123,
    });

    // onAdopt callback with saved pet
    await waitFor(() => {
      expect(onAdopt).toHaveBeenCalledWith(expect.objectContaining({ name: 'Mochi', type: 'Cat' }));
    });

    // Fields cleared
    expect(nameInput).toHaveValue('');
    expect(typeSelect).toHaveValue('');
  });

  it('shows API error message when adoption fails', async () => {
    createPet.mockResolvedValue({
      ok: false,
      error: 'Adoption failed.',
    });

    render(<AdoptForm userId={123} onAdopt={jest.fn()} petTypes={petTypes} />);

    const nameInput = screen.getByLabelText(/pet name/i);
    const typeSelect = screen.getByLabelText(/pet type/i);
    const adoptButton = screen.getByRole('button', { name: /adopt/i });

    await userEvent.type(nameInput, 'Glitch');
    await userEvent.selectOptions(typeSelect, 'Dragon');
    await userEvent.click(adoptButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/adoption failed/i);
  });
});
