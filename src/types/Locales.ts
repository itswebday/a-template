// Locale option
export type LocaleOption = "en" | "nl";

// Messages
export type Messages = {
  [key in LocaleOption]: {
    routes: {
      [key: string]: {
        [key in LocaleOption]: string;
      };
    };
  };
};

// Locale messages
export type LocaleMessages = {
  routes: {
    [key: string]: {
      [key in LocaleOption]: string;
    };
  };
};
