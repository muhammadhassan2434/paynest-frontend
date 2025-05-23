import { validate } from 'validate.js';

interface Constraints {
    [key: string]: {
        presence?: { allowEmpty: boolean };
        format?: { pattern: RegExp; message: string; flags?: string };
        email?: boolean;
        length?: { minimum: number; message: string };
        numericality?: { message: string };
    };
}

export const validateString = (id: string, value: string): string | undefined => {
    const constraints: Constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
            },
        },
    };

    if (value !== "") {
        constraints[id].format = {
            pattern: /.+/i,
            message: "Value can't be blank.",
        };
    }

    const validationResult = validate({ [id]: value }, constraints);
    return validationResult && validationResult[id]?.[0];
};

export const validateEmail = (id: string, value: string): string | undefined => {
    const constraints: Constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
            },
        },
    };

    if (value !== "") {
        constraints[id].email = true;
    }

    const validationResult = validate({ [id]: value }, constraints);
    return validationResult && validationResult[id]?.[0];
};

export const validatePassword = (inputId: string, inputValue: string): string | undefined => {
    const password = inputValue.trim();
  
    // Laravel-style 'required' rule
    if (!password) {
      return `${inputId.replace(/([A-Z])/g, ' $1')} is required.`;
    }
  
    // Example Laravel-style strong password rules
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
  
    if (!hasUppercase) {
      return 'Password must contain at least one uppercase letter.';
    }
  
    if (!hasLowercase) {
      return 'Password must contain at least one lowercase letter.';
    }
  
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
  
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
  
    return undefined;
  };
  

export const validateNumber = (id: string, value: string): string | undefined => {
    const constraints: Constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
            },
            numericality: {
                message: 'Value must be a valid number.',
            },
        },
    };

    const validationResult = validate({ [id]: value }, constraints);
    return validationResult && validationResult[id]?.[0];
};

export const validateCreditCardNumber = (id: string, value: string) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^(?:\d{4}-){3}\d{4}$|^\d{16}$/,
        message: "Invalid credit card number.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };
  
export const validateCVV = (id: string, value: string) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^[0-9]{3,4}$/,
        message: "Invalid CVV.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };
  
export const validateExpiryDate = (id: string, value: string) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
        message: "Invalid expiry date. Please use MM/YY format.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };