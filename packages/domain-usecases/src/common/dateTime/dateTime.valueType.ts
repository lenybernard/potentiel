export type DateTime = {
  date: Date;
};

export type DateTimeValueType = DateTime & {
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: DateTime): boolean;
  formatter(): string;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnDateTime = (date: string | Date) => {
  return {
    date: estUneDate(date) ? date : new Date(date),
    estDansLeFutur() {
      return this.date.getTime() > Date.now();
    },
    estAntérieurÀ(dateTime: DateTime) {
      return this.date.getTime() < dateTime.date.getTime();
    },
    formatter() {
      return this.date.toISOString();
    },
  };
};

const estUneDate = (value: unknown): value is Date => {
  return value instanceof Date;
};
