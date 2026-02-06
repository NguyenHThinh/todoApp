export type Group = {
  id: string;
  name: string;
  color: string; // Store a CSS variable name or hex
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  groupId: string; // references Group.id
}
