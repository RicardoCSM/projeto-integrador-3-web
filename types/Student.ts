export type Student = {
  id: string;
  birth_date: string;
  name: string;
  position: number;
  class?: {
    index: number;
    name: string;
  };
};
