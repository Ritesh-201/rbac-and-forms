import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User, Subjects, Actions } from '../types/rbac';

export const defineAbilityFor = (user: User) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    // Admin can manage everything
    can('manage', 'all');
  } else if (user.role === 'employee') {
    // Employee can read all tasks but only modify their own
    can('read', 'Task');
    can('read', 'Board');
    // Employee can update tasks assigned to them (matching by ID)
    can('update', 'Task');
    can('create', 'Task'); // Can create tasks for themselves
  } else if (user.role === 'guest') {
    // Guest can only read
    can('read', 'Task');
    can('read', 'Board');
    cannot('update', 'Task');
    cannot('create', 'Task');
    cannot('delete', 'Task');
  }

  return build();
};

export const useAbility = (user: User) => {
  return defineAbilityFor(user);
};