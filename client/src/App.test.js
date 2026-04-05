import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders Campus Connect branding', () => {
  // Since App uses <Router>, we use MemoryRouter here to 
  // wrap the component for testing purposes.
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Check for your custom logo text
  const linkElement = screen.getByText(/CAMPUS CONNECT/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders login link when not authenticated', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Ensure the Login button is visible to guest users
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});