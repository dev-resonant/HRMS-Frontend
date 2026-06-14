import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { RegistrationForm } from './components/RegistrationForm/RegistrationForm';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <RegistrationForm />
      </div>
    </ThemeProvider>
  );
};

export default App;
