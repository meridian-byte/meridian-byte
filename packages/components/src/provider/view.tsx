import React from 'react';
import ModalTaskView from '../common/modals/task/view';

export default function View({ children }: { children: React.ReactNode }) {
  return <ModalTaskView>{children}</ModalTaskView>;
}
