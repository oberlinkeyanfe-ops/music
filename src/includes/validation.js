import { defineRule, configure } from "vee-validate";
import {
  required,
  min,
  max,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  alpha_spaces as alphaSpaces,
} from "@vee-validate/rules";

defineRule("required", required);
defineRule("min", min);
defineRule("max", max);
defineRule("email", email);
defineRule("minValue", minValue);
defineRule("maxValue", maxValue);
defineRule("confirmed", confirmed);
defineRule("alpha_spaces", alphaSpaces);

configure({
  generateMessage: (context) => {
    const messages = {
      required: `Le champ ${context.field} est requis.`,
      min: `Le champ ${context.field} est trop court.`,
      max: `Le champ ${context.field} est trop long.`,
      email: `Le champ ${context.field} doit être un email valide.`,
      alpha_spaces: `Le champ ${context.field} ne doit contenir que des lettres et des espaces.`,
      minValue: `Le champ ${context.field} est trop faible.`,
      maxValue: `Le champ ${context.field} est trop élevé.`,
      confirmed: `Les mots de passe ne correspondent pas.`,
    };

    return messages[context.rule.name] || `Le champ ${context.field} est invalide.`;
  },
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});
