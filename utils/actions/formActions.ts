import {
    validateString,
    validateEmail,
    validatePassword,
    validateNumber,
    validateCreditCardNumber,
    validateExpiryDate,
    validateCVV
  } from '../ValidationConstraints';
  
  export const validateInput = (inputId: string, inputValue: string): string | undefined => {

    if (!inputValue.trim()) {
      if (inputId === 'first_name' || inputId === 'last_name') {
        return `${inputId.replace('_', ' ')} is required.`;
      }
    }

    if (
      inputId === 'fullName' ||
      inputId === 'first_name' ||
      inputId === 'last_name' ||
      inputId === 'location' ||
      inputId === 'phoneNumber' ||
      inputId === 'bio' ||
      inputId === 'address' ||
      inputId === 'street' ||
      inputId === 'postalCode' ||
      inputId === 'appartment' ||
      inputId === 'destination' ||
      inputId === 'ageRange' ||
      inputId === 'description' ||
      inputId === 'about' ||
      inputId === 'creditCardHolderName' ||
      inputId === 'addressLine1' ||
      inputId === 'addressLine2'  
    ) {
      return validateString(inputId, inputValue);
    } else if (inputId === 'email' || 
      inputId === 'currentEmail' || 
      inputId === 'newEmail') {
      return validateEmail(inputId, inputValue);
    } else if (
      inputId === 'password' || 
      inputId === 'confirmPassword' || 
      inputId === 'currentPassword' || 
      inputId === 'newPassword' ||
      inputId === 'confirmNewPassword'
      ) {
      return validatePassword(inputId, inputValue);
    } else if (inputId === 'resetToken') {
      return validateString(inputId, inputValue);
    } else if(inputId === 'places') {
      return validateNumber(inputId, inputValue)
    }else if(inputId === 'creditCardNumber'){
      return validateCreditCardNumber(inputId, inputValue)
    }else if(inputId === 'creditCardExpiryDate'){
        return validateExpiryDate(inputId, inputValue)
    }else if(inputId === 'cvv'){
        return validateCVV(inputId, inputValue)
    }
  };