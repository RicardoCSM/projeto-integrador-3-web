export type Student = {
  id: string;
  birth_date: string;
  name: string;
  class?: {
    index: number;
    name: string;
  };
};
