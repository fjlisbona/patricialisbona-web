import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders the coaching homepage content', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /experta en coaching y mindfulness/i })
  ).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'INICIO' })).toHaveAttribute(
    'href',
    '#inicio'
  );
});

test('opens and closes the mobile navigation', () => {
  render(<App />);
  const menuButton = screen.getByRole('button', { name: 'Abrir menú' });

  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  userEvent.click(menuButton);
  expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
});

test('selects a testimonial from the carousel controls', () => {
  render(<App />);
  const secondTestimonialButton = screen.getByRole('button', {
    name: 'Ir al testimonio 2',
  });

  userEvent.click(secondTestimonialButton);
  expect(secondTestimonialButton).toHaveAttribute('aria-pressed', 'true');
  expect(
    screen.queryByRole('button', { name: /pausar testimonios|reanudar testimonios/i })
  ).not.toBeInTheDocument();
});

test('adds a mail icon linked to the published contact email', () => {
  render(<App />);

  expect(
    screen.getByRole('link', { name: 'Enviar email a Patricia Lisbona' })
  ).toHaveAttribute('href', 'mailto:patricia.lisbona.ci@gmail.com');
});
