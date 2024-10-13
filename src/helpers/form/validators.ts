const isFilled = () => ({
    validate: (value: string) => value.trim() !== "",
    error: "Enter a valid value"
})

const maximumNumber = (maximum: number) => ({
    validate: (value: number) => value < maximum || value === maximum,
    error: `It should be lower than ${maximum+1}`
})

const minimumNumber = (minimum: number) => ({
    validate: (value: number) => value > minimum || value === minimum,
    error: `It should be greater than ${minimum-1}`
});

function isStrongPassword(password: string) {

  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const numberPattern = /\d/;
  const specialCharPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  const isUppercaseValid = uppercasePattern.test(password);
  const isLowercaseValid = lowercasePattern.test(password);
  const isDigitValid = numberPattern.test(password);
  const isSpecialCharValid = specialCharPattern.test(password);

  return (
    isUppercaseValid && isLowercaseValid && isDigitValid && isSpecialCharValid
  );
}

const isValidPassword = () => ({
  validate: (password: string) => isStrongPassword(password),
  error: "Include uppercase, lowercase, digit, and special character."
})


const emailPattern =
  /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/;

const isValidEmail = () => ({
    validate: (email: string) => emailPattern.test(email),
    error: "Email you entered is not valid"
})

const minimumCharacters = (minimum: number) => ({
  validate: (value: string) => value.trim().length > minimum || value.trim().length === minimum,
  error: `It should be at least ${minimum} characters`,
});

const maximumCharacters = (maximum: number) => ({
    validate: (value: string) => value.trim().length < maximum || value.trim().length === maximum,
    error: `Value should be at last ${maximum} characters.`,
  });

export default {
  isFilled,
  maximumNumber,
  minimumNumber,
  isValidEmail,
  minimumCharacters,
  maximumCharacters,
  isValidPassword
};
