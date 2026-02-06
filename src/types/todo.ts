export interface Group {
  id: string;
  name: string;
  icon?: string;
  color?: string; // Store a CSS variable name or hex
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  groupId: string; // references Group.id
  createdAt: number;
}
