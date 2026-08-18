'use client';

import React from 'react';
import ModalSearch from '../modal/search';
import ModalCrudCalendar from '../modal/crud/calendar';
import ModalCrudTaskList from '../modal/crud/task-list';
import ModalCrudTask from '../modal/crud/task';
import ModalCrudNote from '../modal/crud/note';

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <ModalSearch>
      <ModalCrudCalendar>
        <ModalCrudNote>
          <ModalCrudTaskList>
            <ModalCrudTask>
              <div>{children}</div>
            </ModalCrudTask>
          </ModalCrudTaskList>
        </ModalCrudNote>
      </ModalCrudCalendar>
    </ModalSearch>
  );
}
