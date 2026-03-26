import React from 'react';
import ModalTaskCrud from '../common/modals/task/crud';
import ModalNoteCrud from '../common/modals/note/crud';
import ModalConfirm from '../common/modals/confirm';
import MoadlMove from '../common/modals/move';
import MoadlMerge from '../common/modals/merge';

export default function View({ children }: { children: React.ReactNode }) {
  return (
    <ModalConfirm options={{ global: true }}>
      <MoadlMove>
        <MoadlMerge>
          <ModalTaskCrud>
            <ModalNoteCrud options={{ global: true }}>{children}</ModalNoteCrud>
          </ModalTaskCrud>
        </MoadlMerge>
      </MoadlMove>
    </ModalConfirm>
  );
}
