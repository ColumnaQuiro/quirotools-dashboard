export const REQUIRED_RULE: [((v: any) => boolean | string)] = [
  (v: any) => !!v || 'Campo requerido'
]

export const EMAIL_RULES: [((v: string) => boolean | string)] = [
  (v: string) => /.+@.+\..+/.test(v) || 'Email no válido'
]
